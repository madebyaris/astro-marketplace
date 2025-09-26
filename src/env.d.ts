/// <reference types="astro/client" />

interface EnvBindings {
  DB: import('./lib/db').D1Database;
  SESSION: import('./lib/types').KVNamespaceStub;
  SESSION_SECRET: string;
  [key: string]: unknown;
}

declare global {
  namespace App {
    interface Locals {
      runtime: {
        env: EnvBindings;
      };
      user?: {
        id: number;
        email: string;
        isAdmin: boolean;
        sessionId: string;
      };
    }
  }
}
