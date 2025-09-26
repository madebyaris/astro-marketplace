import { defineEventHandler } from 'h3'
import { getDatabase } from '../../utils/db'
import { getSettings } from '../../../src/lib/repositories/settings'
import { getSettings as getSettingsMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const db = await getDatabase()
    const settings = db ? await getSettings(db) : getSettingsMock()
    return settings
  } catch (error) {
    console.error('[api/admin/settings] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
