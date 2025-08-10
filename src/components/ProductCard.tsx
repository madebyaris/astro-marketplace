import React from 'react';
import type { Product } from '../types/product';
import { Price } from './Price';
import AddToCartButton from './cart/AddToCartButton';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const affiliate = product.affiliate;
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md">
      <a href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </a>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <a href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-medium leading-snug hover:underline">
          {product.title}
        </a>
        <div className="text-[13px] font-semibold text-emerald-600">
          <Price cents={product.priceCents} />
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          {typeof product.rating === 'number' && (
            <span>⭐ {product.rating.toFixed(1)}</span>
          )}
          {typeof product.soldCount === 'number' && (
            <span>• Terjual {Intl.NumberFormat('id-ID').format(product.soldCount)}</span>
          )}
        </div>
        <div className="flex items-center justify-between text-[12px] text-gray-500">
          <span className="truncate">{product.storeName || 'Store'}</span>
          <span>{product.location || 'ID'}</span>
        </div>
        {product.freeShipping && (
          <div className="text-[11px] font-medium text-emerald-600">Bebas Ongkir</div>
        )}
        <div className="mt-auto flex gap-2 pt-1">
          {product.allowDirectPurchase && product.stock > 0 ? (
            <AddToCartButton product={product} />
          ) : null}
          {affiliate ? (
            <a
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-gray-700 hover:border-gray-300"
              href={affiliate.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Beli di {affiliate.label}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
