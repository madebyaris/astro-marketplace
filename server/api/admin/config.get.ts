import { getIntegrationSettings } from '../../lib/repositories/integrations'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const db = createDatabase()
    const config = await getIntegrationSettings(db)
    return config
  } catch (error) {
    console.error('[api/admin/config] error', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
