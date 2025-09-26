import { defineEventHandler, readBody, createError } from 'h3'
import { getDatabase } from '../../utils/db'
import { deleteCategory } from '../../../src/lib/repositories/categories'
import { deleteCategory as deleteCategoryMock } from '../../../src/lib/admin-store'

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
    const ok = db ? await deleteCategory(db, id) : deleteCategoryMock(id)
    return { ok }
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
