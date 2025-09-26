import type { Request, Response } from 'express'

const SESSION_COOKIE = 'astro_session'

export function getSessionId(req: Request): string | null {
  return req.cookies[SESSION_COOKIE] || null
}

export function setSessionCookie(res: Response, sessionId: string, maxAge = 60 * 60 * 24 * 7) {
  res.cookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: maxAge * 1000 // Express expects milliseconds
  })
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/'
  })
}
