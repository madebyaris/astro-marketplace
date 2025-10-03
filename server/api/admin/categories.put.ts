import { updateCategory } from '../../lib/repositories/categories'
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
    
    const update: { slug?: string; name?: string } = {}
    if (typeof body.slug === 'string') update.slug = body.slug.trim()
    if (typeof body.name === 'string') update.name = body.name.trim()
    
    const db = createDatabase()
    const category = await updateCategory(db, id, update)
    
    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }
    
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
