export type KVNamespaceStub = {
  get: (key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' }) => Promise<any>;
  put: (key: string, value: string | ArrayBuffer, options?: { expiration?: number; expirationTtl?: number }) => Promise<void>;
  delete: (key: string) => Promise<void>;
};


