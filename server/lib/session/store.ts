import type { Storage } from 'unstorage'
import type { SessionData } from '../../types'

const SESSION_PREFIX = 'session:'
const DEFAULT_TTL = 60 * 60 * 24 // 1 day

export class SessionStore {
  private storage: Storage

  constructor(storage: Storage) {
    this.storage = storage
  }

  async createSession(userId: number, ttlSeconds = DEFAULT_TTL): Promise<SessionData> {
    const id = crypto.randomUUID()
    const now = Math.floor(Date.now() / 1000)
    const session: SessionData = {
      id,
      userId,
      createdAt: now,
      expiresAt: now + ttlSeconds
    }

    await this.storage.setItem(SESSION_PREFIX + id, JSON.stringify(session), {
      ttl: ttlSeconds
    })

    return session
  }

  async getSession(id: string): Promise<SessionData | null> {
    if (!id) return null

    try {
      const data = await this.storage.getItem(SESSION_PREFIX + id)
      if (!data) return null

      const session = JSON.parse(data as string) as SessionData
      
      // Check if session is expired
      if (session.expiresAt < Math.floor(Date.now() / 1000)) {
        await this.deleteSession(id)
        return null
      }

      return session
    } catch (error) {
      console.warn('Failed to get session:', error)
      return null
    }
  }

  async deleteSession(id: string): Promise<void> {
    if (!id) return
    
    try {
      await this.storage.removeItem(SESSION_PREFIX + id)
    } catch (error) {
      console.warn('Failed to delete session:', error)
    }
  }

  async refreshSession(id: string, ttlSeconds = DEFAULT_TTL): Promise<SessionData | null> {
    const session = await this.getSession(id)
    if (!session) return null

    const now = Math.floor(Date.now() / 1000)
    const refreshedSession: SessionData = {
      ...session,
      expiresAt: now + ttlSeconds
    }

    await this.storage.setItem(SESSION_PREFIX + id, JSON.stringify(refreshedSession), {
      ttl: ttlSeconds
    })

    return refreshedSession
  }
}

// Session store factory
export function createSessionStore(): SessionStore {
  const storage = useStorage('sessions')
  return new SessionStore(storage)
}
