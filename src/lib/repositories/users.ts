import type { D1Database } from '../db';

export type UserRecord = {
  id: number;
  email: string;
  password_hash: string;
  is_admin: number;
};

export async function findUserByEmail(db: D1Database, email: string) {
  const stmt = db.prepare<UserRecord>(
    `SELECT id, email, password_hash, is_admin FROM users WHERE email = ? LIMIT 1`
  );
  const row = await stmt.bind(email.toLowerCase()).first<UserRecord>();
  return row ?? null;
}

export async function findUserById(db: D1Database, id: number) {
  const stmt = db.prepare<UserRecord>(
    `SELECT id, email, password_hash, is_admin FROM users WHERE id = ? LIMIT 1`
  );
  const row = await stmt.bind(id).first<UserRecord>();
  return row ?? null;
}

export async function createUser(db: D1Database, email: string, hash: string, isAdmin = false) {
  const now = Math.floor(Date.now() / 1000);
  await db
    .prepare(
      `INSERT INTO users (email, password_hash, is_admin, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(email.toLowerCase(), hash, isAdmin ? 1 : 0, now, now)
    .run();
  return findUserByEmail(db, email);
}

export async function updatePassword(db: D1Database, id: number, hash: string) {
  const now = Math.floor(Date.now() / 1000);
  await db
    .prepare(`UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`)
    .bind(hash, now, id)
    .run();
  return findUserById(db, id);
}

