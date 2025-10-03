import type { DatabaseAdapter } from '../database/adapter'
import { queryFirst, execute } from '../database/helpers'
import type { UserRecord } from '../../types'

export async function findUserByEmail(db: DatabaseAdapter, email: string): Promise<UserRecord | null> {
  const stmt = db.prepare<UserRecord>(
    `SELECT id, email, password_hash, is_admin FROM users WHERE email = ? LIMIT 1`
  )
  return await stmt.first<UserRecord>()
}

export async function findUserById(db: DatabaseAdapter, id: number): Promise<UserRecord | null> {
  const stmt = db.prepare<UserRecord>(
    `SELECT id, email, password_hash, is_admin FROM users WHERE id = ? LIMIT 1`
  )
  return await stmt.first<UserRecord>()
}

export async function createUser(db: DatabaseAdapter, email: string, hash: string, isAdmin = false): Promise<UserRecord> {
  const now = Math.floor(Date.now() / 1000)
  const result = await execute(db, `
    INSERT INTO users (email, password_hash, is_admin, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `, [email, hash, isAdmin ? 1 : 0, now, now])
  
  if (!result.success) {
    throw new Error('Failed to create user')
  }
  
  const user = await findUserById(db, result.meta?.lastInsertRowid as number)
  if (!user) {
    throw new Error('Failed to retrieve created user')
  }
  
  return user
}

export async function updatePassword(db: DatabaseAdapter, id: number, hash: string): Promise<void> {
  const now = Math.floor(Date.now() / 1000)
  const result = await execute(db, `
    UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?
  `, [hash, now, id])
  
  if (!result.success) {
    throw new Error('Failed to update password')
  }
}
