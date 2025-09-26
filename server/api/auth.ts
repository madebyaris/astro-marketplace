import type { Request, Response } from 'express'
import { getDatabase } from '../utils/db'
import { findUserByEmail } from '../../src/lib/repositories/users'
import { setSessionCookie, getSessionId, clearSessionCookie } from '../utils/cookies'
import { setSession, getSession, deleteSession } from '../utils/storage'
import bcrypt from 'bcryptjs'

export const authHandlers = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      const db = await getDatabase()
      if (!db) {
        return res.status(500).json({ error: 'Database not available' })
      }

      const user = await findUserByEmail(db, email)
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
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
      setSessionCookie(res, sessionId)

      res.json({
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          isAdmin: !!user.is_admin
        }
      })
    } catch (error) {
      console.error('[api/auth/login] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const sessionId = getSessionId(req)
      if (sessionId) {
        await deleteSession(sessionId)
      }
      clearSessionCookie(res)
      
      res.json({ ok: true })
    } catch (error) {
      console.error('[api/auth/logout] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  async me(req: Request, res: Response) {
    try {
      const sessionId = getSessionId(req)
      if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      const session = await getSession(sessionId)
      if (!session) {
        return res.status(401).json({ error: 'Invalid session' })
      }

      // Check if session is expired
      if (session.expiresAt < Date.now()) {
        return res.status(401).json({ error: 'Session expired' })
      }

      res.json({
        user: {
          id: session.userId,
          email: session.email,
          isAdmin: session.isAdmin
        }
      })
    } catch (error) {
      console.error('[api/auth/me] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
