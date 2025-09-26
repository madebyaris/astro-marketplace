import { defineEventHandler, readBody, createError } from 'h3'
import { getDatabase } from '../../utils/db'
import { updateCategory } from '../../../src/lib/repositories/categories'
import { updateCategory as updateCategoryMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const payload = await readBody(event)
    const id = Number(payload?.id)
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category id is required'
      })
    }
    const db = await getDatabase()
    const update: { slug?: string; name?: string } = {}
    if (typeof payload.slug === 'string') update.slug = payload.slug.trim()
    if (typeof payload.name === 'string') update.name = payload.name.trim()
    const category = db
      ? await updateCategory(db, id, update)
      : updateCategoryMock(id, update as any)
    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }
    return category
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('[api/admin/categories] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
