import React from 'react';

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
};

export default function StoreSearch({ query, onQueryChange }: Props) {
  return (
    <div className="relative">
      <label htmlFor="store-search" className="sr-only">Search products</label>
      <input
        id="store-search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
      />
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        ⌘K
      </div>
    </div>
  );
}
