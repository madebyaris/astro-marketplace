import { getSettings } from '../../lib/repositories/settings'
import { createDatabase } from '../../lib/database/adapter'

export default defineEventHandler(async (event) => {
  try {
    const db = createDatabase()
    const settings = await getSettings(db)
    return settings
  } catch (error) {
    console.error('[api/admin/settings] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
