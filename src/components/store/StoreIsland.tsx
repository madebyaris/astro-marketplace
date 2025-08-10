import React, { useMemo, useState } from 'react';
import { mockProducts } from '../../lib/mock-data';
import ProductGrid from '../ProductGrid';
import StoreSearch from '../StoreSearch';
import { CartProvider } from '../cart/CartContext';
import FilterBar from './FilterBar';

export default function StoreIsland() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('populer');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = mockProducts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
    if (category !== 'all') {
      data = data.filter((p) => (p.categories || []).some((c) => c.toLowerCase() === category.toLowerCase()));
    }
    if (sort === 'termurah') data = [...data].sort((a, b) => a.priceCents - b.priceCents);
    if (sort === 'termahal') data = [...data].sort((a, b) => b.priceCents - a.priceCents);
    if (sort === 'terlaris') data = [...data].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    return data;
  }, [query, sort, category]);

  return (
    <CartProvider>
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Store</h1>
          <p className="mt-1 text-sm text-gray-600">
            Cari produk terbaik dengan filter, urutan, dan promo gratis ongkir.
          </p>
        </div>
        <div className="w-full sm:w-80">
          <StoreSearch query={query} onQueryChange={setQuery} />
        </div>
      </div>

      <div className="mt-4">
        <FilterBar onSortChange={setSort} onCategoryChange={setCategory} />
      </div>

      <div className="mt-6">
        <section>
          <ProductGrid products={filtered} />
        </section>
      </div>
    </CartProvider>
  );
}
