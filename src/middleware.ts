import type { MiddlewareHandler } from 'astro';
import { createLocalD1 } from './lib/db';

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

  return next();
};

