import React, { useState } from 'react';
import { useCart } from '../cart/CartContext';

export default function CheckoutIsland() {
  const { items, clear } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);

  const placeOrder = async () => {
    setPlacing(true);
    try {
      // TODO: call server API to create order in DB
      await new Promise((r) => setTimeout(r, 500));
      clear();
      window.location.href = '/order/confirmation';
    } finally {
      setPlacing(false);
    }
  };

  const isValid = name.trim().length > 2 && /.+@.+/.test(email) && address.trim().length > 5;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
        <div className="flex items-center justify-between"><span>Jumlah Item</span><span>{totalItems}</span></div>
        <div className="mt-1 flex items-center justify-between"><span>Total</span><span>Rp {Intl.NumberFormat('id-ID').format(Math.round(totalCents/100)*100)}</span></div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-600">Nama Lengkap</label>
        <input className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-emerald-500 focus:ring-2" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-600">Email</label>
        <input className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-emerald-500 focus:ring-2" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-600">Alamat</label>
        <textarea className="h-24 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-emerald-500 focus:ring-2" placeholder="Alamat lengkap" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <button
        disabled={!items.length || placing || !isValid}
        onClick={placeOrder}
        className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {placing ? 'Memproses...' : 'Buat Pesanan (Uji)'}
      </button>
      <p className="text-center text-xs text-gray-500">Dengan melanjutkan, Anda menyetujui <a className="underline" href="/kebijakan">Kebijakan</a> dan <a className="underline" href="/privacy">Privasi</a>.</p>
    </div>
  );
}
