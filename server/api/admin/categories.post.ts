import { createCategory } from '../../lib/repositories/categories'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const slug = typeof body?.slug === 'string' ? body.slug.trim() : ''
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    
    if (!slug || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug and name are required'
      })
    }
    
    const db = createDatabase()
    const category = await createCategory(db, { slug, name })
    
    setResponseStatus(event, 201)
    return category
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
