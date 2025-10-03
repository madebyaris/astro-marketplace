import { deleteProduct } from '../../lib/repositories/products'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const id = Number(body?.id);
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product id is required'
      })
    }
    
    const db = createDatabase()
    const ok = await deleteProduct(db, id)
    
    return { ok }
  } catch (error) {
    console.error('[api/admin/products] error', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
