import type { Request, Response } from 'express'
import { getDatabase } from '../../utils/db'
import { listCategories, createCategory, updateCategory, deleteCategory } from '../../../src/lib/repositories/categories'
import { listCategories as listCategoriesMock, createCategory as createCategoryMock, updateCategory as updateCategoryMock, deleteCategory as deleteCategoryMock } from '../../../src/lib/admin-store'

export const categoriesHandlers = {
  async get(req: Request, res: Response) {
    try {
      const db = await getDatabase()
      const categories = db ? await listCategories(db) : listCategoriesMock()
      res.json(categories)
    } catch (error) {
      console.error('[api/admin/categories] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  async post(req: Request, res: Response) {
    try {
      const { slug, name } = req.body
      if (!slug || !name) {
        return res.status(400).json({ error: 'Slug and name are required' })
      }
      const db = await getDatabase()
      const category = db
        ? await createCategory(db, { slug, name })
        : createCategoryMock({ slug, name } as any)
      res.status(201).json(category)
    } catch (error) {
      console.error('[api/admin/categories] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  async put(req: Request, res: Response) {
    try {
      const id = Number(req.body?.id)
      if (!id) {
        return res.status(400).json({ error: 'Category id is required' })
      }
      const update: { slug?: string; name?: string } = {}
      if (typeof req.body.slug === 'string') update.slug = req.body.slug.trim()
      if (typeof req.body.name === 'string') update.name = req.body.name.trim()
      const db = await getDatabase()
      const category = db
        ? await updateCategory(db, id, update)
        : updateCategoryMock(id, update as any)
      if (!category) {
        return res.status(404).json({ error: 'Category not found' })
      }
      res.json(category)
    } catch (error) {
      console.error('[api/admin/categories] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.body?.id)
      if (!id) {
        return res.status(400).json({ error: 'Category id is required' })
      }
      const db = await getDatabase()
      const ok = db ? await deleteCategory(db, id) : deleteCategoryMock(id)
      res.json({ ok })
    } catch (error) {
      console.error('[api/admin/categories] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
