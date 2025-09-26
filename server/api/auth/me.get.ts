import { defineEventHandler } from 'h3'
import { getSessionId } from '../../utils/cookies'
import { getSession } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getSessionId(event)
    if (!sessionId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    const session = await getSession(sessionId)
    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid session'
      })
    }

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Session expired'
      })
    }

    return {
      user: {
        id: session.userId,
        email: session.email,
        isAdmin: session.isAdmin
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('[api/auth/me] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
