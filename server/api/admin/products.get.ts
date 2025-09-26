import { defineEventHandler } from 'h3'
import { getDatabase } from '../../utils/db'
import { listProducts } from '../../../src/lib/repositories/products'
import { listProducts as listProductsMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const db = await getDatabase()
    if (!db) {
      return listProductsMock()
    }
    const products = await listProducts(db)
    return products
  } catch (error) {
    console.error('[api/admin/products] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
