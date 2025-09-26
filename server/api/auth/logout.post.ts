import { defineEventHandler } from 'h3'
import { getSessionId, clearSessionCookie } from '../../utils/cookies'
import { deleteSession } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getSessionId(event)
    if (sessionId) {
      await deleteSession(sessionId)
    }
    clearSessionCookie(event)
    
    return { ok: true }
  } catch (error) {
    console.error('[api/auth/logout] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
