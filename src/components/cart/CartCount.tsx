import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'astro_marketplace_cart_v1';

function readCount(): number {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return 0;
    const data = JSON.parse(raw) as { items?: Array<{ quantity: number }> };
    return (data.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0);
  } catch {
    return 0;
  }
}

type Props = {
  variant?: 'pill' | 'badge';
};

export default function CartCount({ variant = 'pill' }: Props) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    setCount(readCount());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCount(readCount());
    };
    const onCartUpdated = () => setCount(readCount());
    window.addEventListener('storage', onStorage);
    window.addEventListener('cart:updated', onCartUpdated as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cart:updated', onCartUpdated as EventListener);
    };
  }, []);

  if (count <= 0) return null;

  if (variant === 'badge') {
    return (
      <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold leading-none text-white shadow-md">
        {count}
      </span>
    );
  }

  return (
    <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-xs font-semibold leading-5 text-white">
      {count}
    </span>
  );
}
