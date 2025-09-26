import { defineEventHandler } from 'h3'
import { getDatabase } from '../../utils/db'
import { listCategories } from '../../../src/lib/repositories/categories'
import { listCategories as listCategoriesMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const db = await getDatabase()
    const categories = db ? await listCategories(db) : listCategoriesMock()
    return categories
  } catch (error) {
    console.error('[api/admin/categories] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
