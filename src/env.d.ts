/// <reference types="astro/client" />

type KVNamespaceStub = {
  get: (key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' }) => Promise<any>;
  put: (key: string, value: string | ArrayBuffer, options?: { expiration?: number; expirationTtl?: number }) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

interface EnvBindings {
  DB: import('./lib/db').D1Database;
  SESSION: KVNamespaceStub;
  SESSION_SECRET: string;
  [key: string]: unknown;
}

declare global {
  namespace App {
    interface Locals {
      runtime: {
        env: EnvBindings;
      };
    }
  }
}
