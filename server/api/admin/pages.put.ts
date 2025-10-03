import { updatePages } from '../../lib/repositories/pages'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const update = {
      aboutHtml: typeof body.aboutHtml === 'string' ? body.aboutHtml : undefined,
      privacyHtml: typeof body.privacyHtml === 'string' ? body.privacyHtml : undefined,
      policyHtml: typeof body.policyHtml === 'string' ? body.policyHtml : undefined,
      heroTitle: typeof body.heroTitle === 'string' ? body.heroTitle : undefined,
      heroSubtitle: typeof body.heroSubtitle === 'string' ? body.heroSubtitle : undefined,
    }
    
    const db = createDatabase()
    const updated = await updatePages(db, update)
    
    return updated
  } catch (error) {
    console.error('[api/admin/pages] error', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
