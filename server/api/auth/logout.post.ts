import { createSessionStore } from '../../lib/session/store'

const SESSION_COOKIE = 'astro_session'

export default defineEventHandler(async (event) => {
  try {
    const sessionStore = createSessionStore()
    const cookie = getCookie(event, SESSION_COOKIE)
    
    if (cookie) {
      await sessionStore.deleteSession(cookie)
    }

    // Clear session cookie
    deleteCookie(event, SESSION_COOKIE, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    })

    return {
      ok: true
    }
  } catch (error) {
    console.error('[auth/logout] error', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
