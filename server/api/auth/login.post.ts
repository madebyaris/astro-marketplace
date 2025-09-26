import { defineEventHandler, readBody, createError } from 'h3'
import { getDatabase } from '../../utils/db'
import { findUserByEmail } from '../../../src/lib/repositories/users'
import { setSessionCookie } from '../../utils/cookies'
import { setSession } from '../../utils/storage'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    const db = await getDatabase()
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database not available'
      })
    }

    const user = await findUserByEmail(db, email)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Create session
    const sessionId = crypto.randomUUID()
    const now = Date.now()
    const expiresAt = now + (7 * 24 * 60 * 60 * 1000) // 7 days

    await setSession(sessionId, {
      userId: user.id,
      email: user.email,
      isAdmin: !!user.is_admin,
      createdAt: now,
      expiresAt
    })

    // Set session cookie
    setSessionCookie(event, sessionId)

    return {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: !!user.is_admin
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('[api/auth/login] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
