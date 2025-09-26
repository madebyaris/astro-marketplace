import { defineEventHandler } from 'h3'
import { getDatabase } from '../../utils/db'
import { getPages } from '../../../src/lib/repositories/pages'
import { getPages as getPagesMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const db = await getDatabase()
    const pages = db ? await getPages(db) : getPagesMock()
    return pages
  } catch (error) {
    console.error('[api/admin/pages] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
