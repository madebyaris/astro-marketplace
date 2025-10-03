import { getPages } from '../../lib/repositories/pages'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const db = createDatabase()
    const pages = await getPages(db)
    return pages
  } catch (error) {
    console.error('[api/admin/pages] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
