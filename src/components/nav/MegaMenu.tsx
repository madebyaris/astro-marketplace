import React, { useEffect, useRef, useState } from 'react';
import { mockCategories } from '../../lib/mock-categories';

export default function MegaMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (panelRef.current && panelRef.current.contains(target)) return;
      if (btnRef.current && btnRef.current.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        className="hidden items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 ring-emerald-500 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:inline-flex"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span aria-hidden>≡</span>
        <span>Kategori</span>
      </button>

      {/* Desktop dropdown */}
      {open && (
        <div
          ref={panelRef}
          className="absolute left-0 top-10 z-40 hidden w-[760px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:block"
          role="menu"
        >
          <div className="grid grid-cols-3 gap-4">
            {mockCategories.map((c) => (
              <a
                key={c.slug}
                href={`/store?cat=${c.slug}`}
                className="group flex items-center gap-3 rounded-lg border border-transparent p-3 hover:border-emerald-200 hover:bg-emerald-50"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <span className="text-lg">{c.emoji}</span>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-emerald-700">{c.name}</div>
                  <div className="text-xs text-gray-500">Lihat produk {c.name}</div>
                </div>
                <span className="ml-auto text-gray-300 group-hover:text-emerald-400">›</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 ring-emerald-500 hover:bg-gray-50 sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open categories"
      >
        ≡ <span>Kategori</span>
      </button>
      {open && (
        <div className="sm:hidden">
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[80%] overflow-y-auto bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">Kategori</div>
              <button className="rounded-lg p-2 hover:bg-gray-50" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {mockCategories.map((c) => (
                <a
                  key={c.slug}
                  href={`/store?cat=${c.slug}`}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg">{c.emoji}</span>
                  <span className="font-medium text-gray-900">{c.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
