import { defineEventHandler, readBody, createError } from 'h3'
import { getDatabase } from '../../utils/db'
import { createCategory } from '../../../src/lib/repositories/categories'
import { createCategory as createCategoryMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const payload = await readBody(event)
    const slug = typeof payload?.slug === 'string' ? payload.slug.trim() : ''
    const name = typeof payload?.name === 'string' ? payload.name.trim() : ''
    if (!slug || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug and name are required'
      })
    }
    const db = await getDatabase()
    const category = db
      ? await createCategory(db, { slug, name })
      : createCategoryMock({ slug, name } as any)
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
