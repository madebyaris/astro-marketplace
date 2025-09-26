import React, { useEffect, useState } from 'react';

const DEFAULT_REDIRECT = '/admin';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirect, setRedirect] = useState(DEFAULT_REDIRECT);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('redirect');
    if (next) setRedirect(next);
  }, []);

  return (
    <form
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email || !password) return;
        setPending(true);
        setError(null);
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error || 'Login gagal, silakan coba lagi.');
            return;
          }
          window.location.href = redirect;
        } catch (err) {
          console.error(err);
          setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
          setPending(false);
        }
      }}
    >
      <div>
        <label className="mb-1 block text-sm text-gray-600" htmlFor="email">Email</label>
        <input
          id="email"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-600" htmlFor="password">Password</label>
        <input
          id="password"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign In'}
      </button>
      <p className="text-center text-xs text-gray-500">Dengan masuk, Anda menyetujui <a href="/kebijakan" className="underline">Kebijakan</a> dan <a href="/privacy" className="underline">Privasi</a>.</p>
    </form>
  );
}
