import bcrypt from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 10;

export function hashPassword(password: string, saltRounds = DEFAULT_SALT_ROUNDS) {
  return bcrypt.hashSync(password, saltRounds);
}

export function verifyPassword(password: string, hash: string) {
  if (!hash) return false;
  try {
    return bcrypt.compareSync(password, hash);
  } catch {
    return false;
  }
}

export function needsRehash(hash: string, saltRounds = DEFAULT_SALT_ROUNDS) {
  try {
    const details = bcrypt.getRounds(hash);
    return details !== saltRounds;
  } catch {
    return true;
  }
}


