import React from 'react';
import type { Product } from '../../types/product';
import { CartProvider } from './CartContext';
import AddToCartButton from './AddToCartButton';

type Props = { product: Product };

export default function AddToCartIsland({ product }: Props) {
  return (
    <CartProvider>
      <AddToCartButton product={product} />
    </CartProvider>
  );
}


