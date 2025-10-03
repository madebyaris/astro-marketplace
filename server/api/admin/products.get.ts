import { listProducts } from '../../lib/repositories/products'
import { createDatabase } from '../../lib/database/adapter'
// Mock data fallback
const mockProducts = [
  {
    id: 1,
    slug: 'sample-product',
    title: 'Sample Product',
    description: 'This is a sample item.',
    priceCents: 1999,
    stock: 10,
    imageUrl: 'https://picsum.photos/seed/sample/600/400',
    allowDirectPurchase: true,
    affiliate: { label: 'Tokopedia', targetUrl: 'https://www.tokopedia.com/' },
  }
]

export default defineEventHandler(async (event) => {
  try {
    const db = createDatabase()
    const products = await listProducts(db)
    return products
  } catch (error) {
    console.error('[api/admin/products] error', error)
    // Fallback to mock data if database is not available
    return mockProducts
  }
})
