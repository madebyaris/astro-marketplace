import { defineEventHandler, readBody, createError } from 'h3'
import { getDatabase } from '../../utils/db'
import { updateIntegrationSettings } from '../../../src/lib/repositories/integrations'
import { updateConfig as updateConfigMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const payload = await readBody(event)
    const db = await getDatabase()
    const updated = db
      ? await updateIntegrationSettings(db, {
          smtp: payload.smtp,
          s3: payload.s3,
        })
      : updateConfigMock(payload)
    return updated
  } catch (error) {
    console.error('[api/admin/config] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
