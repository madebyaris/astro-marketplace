import type { MiddlewareHandler } from 'astro';
import { createLocalD1 } from './lib/db';
import { getSession } from './lib/repositories/sessions';
import { findUserById } from './lib/repositories/users';

const SESSION_COOKIE = 'astro_session';

export const onRequest: MiddlewareHandler = async (context, next) => {
  if (!context.locals.runtime?.env?.DB) {
    const localDb = await createLocalD1();
    if (localDb) {
      context.locals.runtime = context.locals.runtime || { env: {} as any };
      context.locals.runtime.env = {
        ...context.locals.runtime.env,
        DB: localDb,
      } as any;
    }
  }

  const env = context.locals.runtime?.env;
  const cookie = context.request.headers.get('cookie') || '';
  const sessionId = parseSessionId(cookie);

  if (env?.SESSION && env?.DB && sessionId) {
    const session = await getSession(env.SESSION, sessionId);
    if (session) {
      const user = await findUserById(env.DB, session.userId);
      if (user) {
        context.locals.user = {
          id: user.id,
          email: user.email,
          isAdmin: !!user.is_admin,
          sessionId,
        };
      }
    }
  }

  if (isProtectedPath(context.request) && !context.locals.user) {
    if (context.request.headers.get('accept')?.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
    const url = new URL('/login', context.request.url);
    url.searchParams.set('redirect', context.request.url);
    return Response.redirect(url, 302);
  }

  return next();
};

function parseSessionId(cookie: string) {
  const parts = cookie.split(';').map((part) => part.trim());
  const entry = parts.find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return entry ? entry.split('=')[1] : null;
}

function isProtectedPath(request: Request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/admin')) return true;
  if (url.pathname.startsWith('/api/admin')) return true;
  return false;
}

