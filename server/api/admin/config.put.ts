import { updateIntegrationSettings } from '../../lib/repositories/integrations'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const db = createDatabase()
    const updated = await updateIntegrationSettings(db, {
      smtp: body.smtp,
      s3: body.s3,
    })
    return updated
  } catch (error) {
    console.error('[api/admin/config] error', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
