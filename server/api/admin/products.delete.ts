import { defineEventHandler, readBody, createError } from 'h3'
import { getDatabase } from '../../utils/db'
import { deleteProduct } from '../../../src/lib/repositories/products'
import { deleteProduct as deleteProductMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const payload = await readBody(event)
    const id = Number(payload?.id)
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product id is required'
      })
    }
    const db = await getDatabase()
    const ok = db
      ? await deleteProduct(db, id)
      : deleteProductMock(id)
    return { ok }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('[api/admin/products] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
