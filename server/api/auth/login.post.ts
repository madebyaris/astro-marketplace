import { findUserByEmail } from '../../lib/repositories/users'
import { createSessionStore } from '../../lib/session/store'
import { createDatabase } from '../../lib/database/adapter'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body
    
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid payload'
      })
    }

    const db = createDatabase()
    const sessionStore = createSessionStore()

    const user = await findUserByEmail(db, email)
    if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
      // Add delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 300))
      throw createError({
        statusCode: 401,
        statusMessage: 'Email atau password salah'
      })
    }

    const session = await sessionStore.createSession(user.id, COOKIE_MAX_AGE)
    const cookie = createSessionCookie(session.id, COOKIE_MAX_AGE)

    setCookie(event, 'astro_session', session.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: !!user.is_admin
      }
    }
  } catch (error) {
    console.error('[auth/login] error', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
