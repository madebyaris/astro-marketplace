import type { KVNamespaceStub } from '../types';

export type SessionData = {
  userId: number;
  createdAt: number;
  expiresAt: number;
};

const SESSION_PREFIX = 'sessions:';
const DEFAULT_TTL = 60 * 60 * 24; // 1 day

export async function createSession(kv: KVNamespaceStub, userId: number, ttlSeconds = DEFAULT_TTL) {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + ttlSeconds;
  const payload: SessionData = { userId, createdAt: now, expiresAt };
  await kv.put(SESSION_PREFIX + id, JSON.stringify(payload), { expirationTtl: ttlSeconds });
  return { id, ...payload };
}

export async function getSession(kv: KVNamespaceStub, id: string) {
  if (!id) return null;
  const text = await kv.get(SESSION_PREFIX + id, { type: 'text' });
  if (!text) return null;
  try {
    const payload = JSON.parse(text) as SessionData;
    if (payload.expiresAt < Math.floor(Date.now() / 1000)) {
      await deleteSession(kv, id);
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession(kv: KVNamespaceStub, id: string) {
  if (!id) return;
  await kv.delete(SESSION_PREFIX + id);
}

