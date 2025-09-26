import type { APIRoute } from 'astro';
import { deleteSession } from '../../../lib/repositories/sessions';

const SESSION_COOKIE = 'astro_session';

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
    const kv = locals.runtime?.env?.SESSION;
    if (!kv) {
      return json({ error: 'Server misconfiguration: SESSION binding missing' }, { status: 500 });
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const sessionId = parseSessionId(cookieHeader);
    if (sessionId) {
      await deleteSession(kv, sessionId);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'set-cookie': `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`,
      },
    });
  } catch (error) {
    console.error('[auth/logout] error', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

function parseSessionId(cookie: string) {
  const parts = cookie.split(';').map((part) => part.trim());
  const entry = parts.find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return entry ? entry.split('=')[1] : null;
}


