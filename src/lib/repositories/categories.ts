import type { D1Database } from '../db';
import { execute, queryAll, queryFirst } from '../db';

export type Category = {
  id: number;
  slug: string;
  name: string;
};

export async function listCategories(db: D1Database): Promise<Category[]> {
  const { rows } = await queryAll<Category>(db, `
    SELECT id, slug, name
    FROM categories
    ORDER BY name ASC
  `);
  return rows;
}

export async function createCategory(db: D1Database, input: Omit<Category, 'id'>): Promise<Category> {
  await execute(db, `
    INSERT INTO categories (slug, name)
    VALUES (?, ?)
  `, [input.slug, input.name]);

  const row = await queryFirst<Category>(db, `
    SELECT id, slug, name
    FROM categories
    WHERE slug = ?
  `, [input.slug]);
  if (!row) throw new Error('Failed to fetch inserted category');
  return row;
}

export async function updateCategory(db: D1Database, id: number, input: Partial<Category>): Promise<Category | null> {
  const existing = await queryFirst<Category>(db, `
    SELECT id, slug, name
    FROM categories
    WHERE id = ?
  `, [id]);
  if (!existing) return null;

  await execute(db, `
    UPDATE categories
    SET slug = ?, name = ?, updated_at = strftime('%s','now')
    WHERE id = ?
  `, [
    input.slug ?? existing.slug,
    input.name ?? existing.name,
    id,
  ]);

  const row = await queryFirst<Category>(db, `
    SELECT id, slug, name
    FROM categories
    WHERE id = ?
  `, [id]);
  return row ?? existing;
}

export async function deleteCategory(db: D1Database, id: number): Promise<boolean> {
  const result = await execute(db, `DELETE FROM categories WHERE id = ?`, [id]);
  return Boolean(result?.meta?.changes);
}

