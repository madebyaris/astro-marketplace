import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  // Frontend-only mock login (no auth context)

  return (
    <form
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email) return;
        setPending(true);
        try {
          await new Promise((r) => setTimeout(r, 300));
          // Optionally persist a flag to simulate session
          try { window.localStorage.setItem('astro_marketplace_mock_user', JSON.stringify({ email })); } catch {}
          window.location.href = '/store';
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
