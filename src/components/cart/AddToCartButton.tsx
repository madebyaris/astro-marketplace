import React from 'react';
import type { Product } from '../../types/product';
import { useCart } from './CartContext';

type Props = { product: Product };

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  return (
    <button
      className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
      onClick={() => addItem(product, 1)}
    >
      Add to Cart
    </button>
  );
}
