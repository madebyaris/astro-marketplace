import React, { useMemo, useState } from 'react';
import { mockCategories } from '../../lib/mock-categories';

type Props = {
  onSortChange?: (v: string) => void;
  onCategoryChange?: (slug: string) => void;
};

const useCategoryOptions = () => {
  return useMemo(() => [{ slug: 'all', name: 'Semua' }, ...mockCategories.map((c) => ({ slug: c.slug, name: c.name }))], []);
};

export default function FilterBar({ onSortChange, onCategoryChange }: Props) {
  const [sort, setSort] = useState('populer');
  const [cat, setCat] = useState('all');
  const categories = useCategoryOptions();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <label htmlFor="category" className="text-gray-500">Kategori:</label>
        <select
          id="category"
          className="rounded-lg border border-gray-200 px-2 py-1.5"
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            onCategoryChange?.(e.target.value);
          }}
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Urutkan:</span>
        <select
          className="rounded-lg border border-gray-200 px-2 py-1.5"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            onSortChange?.(e.target.value);
          }}
        >
          <option value="populer">Paling Relevan</option>
          <option value="terlaris">Terlaris</option>
          <option value="termurah">Harga Terendah</option>
          <option value="termahal">Harga Tertinggi</option>
        </select>
      </div>
    </div>
  );
}
