import { deleteCategory } from '../../lib/repositories/categories'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const id = Number(body?.id)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category id is required'
      })
    }
    
    const db = createDatabase()
    const ok = await deleteCategory(db, id)
    
    return { ok }
  } catch (error) {
    console.error('[api/admin/categories] error', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
