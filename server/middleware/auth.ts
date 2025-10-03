import { findUserById } from '../lib/repositories/users'
import type { User } from '../types'

const SESSION_COOKIE = 'astro_session'

export default defineEventHandler(async (event) => {
  // Skip auth for public routes
  if (isPublicRoute(event.node.req.url || '')) {
    return
  }

  const cookie = getCookie(event, SESSION_COOKIE)
  if (!cookie) {
    if (isProtectedRoute(event.node.req.url || '')) {
      return sendRedirect(event, '/login', 302)
    }
    return
  }

  try {
    const sessionStore = createSessionStore()
    const session = await sessionStore.getSession(cookie)
    
    if (!session) {
      if (isProtectedRoute(event.node.req.url || '')) {
        return sendRedirect(event, '/login', 302)
      }
      return
    }

    // Load user data from database
    const db = createDatabase()
    const user = await findUserById(db, session.userId)
    
    if (!user) {
      // Session exists but user doesn't - clean up
      await sessionStore.deleteSession(cookie)
      if (isProtectedRoute(event.node.req.url || '')) {
        return sendRedirect(event, '/login', 302)
      }
      return
    }

    // Attach user to event context
    event.context.user = {
      id: user.id,
      email: user.email,
      isAdmin: !!user.is_admin,
      sessionId: cookie
    } as User

  } catch (error) {
    console.error('Auth middleware error:', error)
    // On error, redirect to login for protected routes
    if (isProtectedRoute(event.node.req.url || '')) {
      return sendRedirect(event, '/login', 302)
    }
  }
})

function isPublicRoute(url: string): boolean {
  const publicPaths = [
    '/',
    '/store',
    '/product/',
    '/about',
    '/privacy',
    '/kebijakan',
    '/contact',
    '/api/health',
    '/api/affiliate/',
    '/login'
  ]
  
  return publicPaths.some(path => 
    path.endsWith('/') ? url.startsWith(path) : url === path
  )
}

function isProtectedRoute(url: string): boolean {
  return url.startsWith('/admin') || url.startsWith('/api/admin')
}
