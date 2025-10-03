import type { DatabaseAdapter } from '../database/adapter'
import { execute, queryAll, queryFirst } from '../database/helpers'
import type { Category } from '../../types'

export async function listCategories(db: DatabaseAdapter): Promise<Category[]> {
  const { rows } = await queryAll<Category>(db, `
    SELECT id, slug, name
    FROM categories
    ORDER BY name
  `)
  return rows
}

export async function createCategory(db: DatabaseAdapter, input: Omit<Category, 'id'>): Promise<Category> {
  await execute(db, `
    INSERT INTO categories (slug, name)
    VALUES (?, ?)
  `, [input.slug, input.name])

  const category = await queryFirst<Category>(db, `
    SELECT id, slug, name
    FROM categories
    WHERE slug = ?
  `, [input.slug])

  if (!category) {
    throw new Error('Failed to fetch created category')
  }

  return category
}

export async function updateCategory(db: DatabaseAdapter, id: number, input: Partial<Category>): Promise<Category | null> {
  const existing = await queryFirst<Category>(db, `
    SELECT id, slug, name
    FROM categories
    WHERE id = ?
  `, [id])

  if (!existing) return null

  const updated = {
    ...existing,
    slug: input.slug ?? existing.slug,
    name: input.name ?? existing.name,
  }

  await execute(db, `
    UPDATE categories SET
      slug = ?,
      name = ?,
      updated_at = strftime('%s','now')
    WHERE id = ?
  `, [updated.slug, updated.name, id])

  return updated
}

export async function deleteCategory(db: DatabaseAdapter, id: number): Promise<boolean> {
  const result = await execute(db, `DELETE FROM categories WHERE id = ?`, [id])
  return Boolean(result?.meta?.changes)
}
