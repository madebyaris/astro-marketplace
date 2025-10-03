import { listCategories } from '../../lib/repositories/categories'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const db = createDatabase()
    const categories = await listCategories(db)
    return categories
  } catch (error) {
    console.error('[api/admin/categories] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
