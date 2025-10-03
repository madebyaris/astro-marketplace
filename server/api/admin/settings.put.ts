import { updateSettings } from '../../lib/repositories/settings'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const update = {
      purchasingEnabled: body.purchasingEnabled,
      siteTitle: typeof body.siteTitle === 'string' ? body.siteTitle : undefined,
      siteDescription: typeof body.siteDescription === 'string' ? body.siteDescription : undefined,
      primaryColor: typeof body.primaryColor === 'string' ? body.primaryColor : undefined,
      ogImage: typeof body.ogImage === 'string' ? body.ogImage : undefined,
      canonicalDomain: typeof body.canonicalDomain === 'string' ? body.canonicalDomain : undefined,
    }
    
    const db = createDatabase()
    const updated = await updateSettings(db, update)
    
    return updated
  } catch (error) {
    console.error('[api/admin/settings] error', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
