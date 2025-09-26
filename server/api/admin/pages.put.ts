import { defineEventHandler, readBody, createError } from 'h3'
import { getDatabase } from '../../utils/db'
import { updatePages } from '../../../src/lib/repositories/pages'
import { updatePages as updatePagesMock } from '../../../src/lib/admin-store'

export default defineEventHandler(async (event) => {
  try {
    const payload = await readBody(event)
    const update = {
      aboutHtml: typeof payload.aboutHtml === 'string' ? payload.aboutHtml : undefined,
      privacyHtml: typeof payload.privacyHtml === 'string' ? payload.privacyHtml : undefined,
      policyHtml: typeof payload.policyHtml === 'string' ? payload.policyHtml : undefined,
      heroTitle: typeof payload.heroTitle === 'string' ? payload.heroTitle : undefined,
      heroSubtitle: typeof payload.heroSubtitle === 'string' ? payload.heroSubtitle : undefined,
    }
    const db = await getDatabase()
    const updated = db ? await updatePages(db, update) : updatePagesMock(update as any)
    return updated
  } catch (error) {
    console.error('[api/admin/pages] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
