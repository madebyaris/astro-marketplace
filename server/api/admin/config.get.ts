import { defineEventHandler } from 'h3'
import { getDatabase } from '../../utils/db'
import { getIntegrationSettings } from '../../../src/lib/repositories/integrations'
import { getConfig as getConfigMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const db = await getDatabase()
    const config = db ? await getIntegrationSettings(db) : getConfigMock()
    return config
  } catch (error) {
    console.error('[api/admin/config] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
