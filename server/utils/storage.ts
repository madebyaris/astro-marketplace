import { getSessionKV } from './env'

export interface SessionData {
  userId: number
  email: string
  isAdmin: boolean
  createdAt: number
  expiresAt: number
}

// In-memory storage fallback for development
const memoryStorage = new Map<string, any>()

export async function getSession(sessionId: string): Promise<SessionData | null> {
  const kv = getSessionKV()
  if (!kv) {
    // Fallback to memory storage for development
    return memoryStorage.get(`session:${sessionId}`) as SessionData | null
  }
  
  const data = await kv.get(`session:${sessionId}`)
  if (!data) return null
  
  try {
    return JSON.parse(data) as SessionData
  } catch {
    return null
  }
}

export async function setSession(sessionId: string, data: SessionData, ttl = 60 * 60 * 24 * 7): Promise<void> {
  const kv = getSessionKV()
  if (!kv) {
    // Fallback to memory storage for development
    memoryStorage.set(`session:${sessionId}`, data)
    return
  }
  
  await kv.put(`session:${sessionId}`, JSON.stringify(data), {
    expirationTtl: ttl
  })
}

export async function deleteSession(sessionId: string): Promise<void> {
  const kv = getSessionKV()
  if (!kv) {
    // Fallback to memory storage for development
    memoryStorage.delete(`session:${sessionId}`)
    return
  }
  
  await kv.delete(`session:${sessionId}`)
}
