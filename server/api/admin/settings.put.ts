import { defineEventHandler, readBody, createError } from 'h3'
import { getDatabase } from '../../utils/db'
import { updateSettings } from '../../../src/lib/repositories/settings'
import { updateSettings as updateSettingsMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const payload = await readBody(event)
    const update = {
      purchasingEnabled: payload.purchasingEnabled,
      siteTitle: typeof payload.siteTitle === 'string' ? payload.siteTitle : undefined,
      siteDescription: typeof payload.siteDescription === 'string' ? payload.siteDescription : undefined,
      primaryColor: typeof payload.primaryColor === 'string' ? payload.primaryColor : undefined,
      ogImage: typeof payload.ogImage === 'string' ? payload.ogImage : undefined,
      canonicalDomain: typeof payload.canonicalDomain === 'string' ? payload.canonicalDomain : undefined,
    }
    const db = await getDatabase()
    const updated = db ? await updateSettings(db, update) : updateSettingsMock(update as any)
    return updated
  } catch (error) {
    console.error('[api/admin/settings] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
