import bcrypt from 'bcryptjs'

const SESSION_COOKIE = 'astro_session'

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12)
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export function createSessionCookie(id: string, maxAge: number): string {
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString()
  const params = [
    `${SESSION_COOKIE}=${id}`,
    `Max-Age=${maxAge}`,
    `Path=/`,
    `Expires=${expires}`,
  ]
  
  // Add Secure flag in production
  if (process.env.NODE_ENV === 'production') {
    params.push('Secure')
  }
  
  return params.join('; ')
}