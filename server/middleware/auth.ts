import type { Request, Response, NextFunction } from 'express'
import { getSessionId } from '../utils/cookies'
import { getSession } from '../utils/storage'
import { getDatabase } from '../utils/db'
import { findUserById } from '../../src/lib/repositories/users'

export interface User {
  id: number
  email: string
  isAdmin: boolean
  sessionId: string
}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

function isProtectedPath(pathname: string): boolean {
  if (pathname.startsWith('/admin')) return true
  if (pathname.startsWith('/api/admin')) return true
  return false
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip auth for non-protected paths
  if (!isProtectedPath(req.path)) {
    return next()
  }
  
  const sessionId = getSessionId(req)
  if (!sessionId) {
    return sendAuthError(req, res)
  }
  
  const session = await getSession(sessionId)
  if (!session) {
    return sendAuthError(req, res)
  }
  
  // Check if session is expired
  if (session.expiresAt < Date.now()) {
    return sendAuthError(req, res)
  }
  
  const db = await getDatabase()
  if (!db) {
    return sendAuthError(req, res)
  }
  
  const user = await findUserById(db, session.userId)
  if (!user) {
    return sendAuthError(req, res)
  }
  
  // Attach user to request
  req.user = {
    id: user.id,
    email: user.email,
    isAdmin: !!user.is_admin,
    sessionId
  }
  
  next()
}

function sendAuthError(req: Request, res: Response) {
  if (req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const redirectUrl = new URL('/login', `${req.protocol}://${req.get('host')}`)
  redirectUrl.searchParams.set('redirect', req.originalUrl)
  
  return res.redirect(redirectUrl.href)
}
