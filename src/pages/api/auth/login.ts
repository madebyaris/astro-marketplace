import type { APIRoute } from 'astro';
import { requireEnvDb } from '../../../lib/db';
import { hashPassword, verifyPassword } from '../../../lib/auth/hash';
import { findUserByEmail } from '../../../lib/repositories/users';
import { createSession } from '../../../lib/repositories/sessions';

const SESSION_COOKIE = 'astro_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

const json = (data: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      'content-type': 'application/json',
      ...init?.headers,
    },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string') {
      return json({ error: 'Invalid payload' }, { status: 400 });
    }

    const db = requireEnvDb(locals.runtime?.env ?? {});
    const kv = locals.runtime?.env?.SESSION;
    if (!kv) {
      return json({ error: 'Server misconfiguration: SESSION binding missing' }, { status: 500 });
    }

    const user = await findUserByEmail(db, email);
    if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const session = await createSession(kv, user.id, COOKIE_MAX_AGE);
    const cookie = createSessionCookie(session.id, COOKIE_MAX_AGE);

    return new Response(JSON.stringify({ ok: true, user: { id: user.id, email: user.email, isAdmin: !!user.is_admin } }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'set-cookie': cookie,
      },
    });
  } catch (error) {
    console.error('[auth/login] error', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

function createSessionCookie(id: string, maxAge: number) {
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
  const params = [
    `${SESSION_COOKIE}=${id}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${maxAge}`,
    `Expires=${expires}`,
  ];
  if (import.meta.env.PROD) {
    params.push('Secure');
  }
  return params.join('; ');
}


