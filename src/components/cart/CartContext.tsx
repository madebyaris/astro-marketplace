import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '../../types/product';

export type CartItem = {
  productId: number;
  slug: string;
  title: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartContextValue = {
  items: CartItem[];
  totalCents: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'astro_marketplace_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event('cart:updated'));
    } catch {}
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: Product, quantity = 1) => {
      setState((prev) => {
        const existing = prev.items.find((i) => i.productId === product.id);
        if (existing) {
          return {
            items: prev.items.map((i) =>
              i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          };
        }
        return {
          items: [
            ...prev.items,
            {
              productId: product.id,
              slug: product.slug,
              title: product.title,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
              quantity,
            },
          ],
        };
      });
    };

    const removeItem = (productId: number) => {
      setState((prev) => ({ items: prev.items.filter((i) => i.productId !== productId) }));
    };

    const updateQty = (productId: number, quantity: number) => {
      setState((prev) => ({
        items: prev.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      }));
    };

    const clear = () => setState({ items: [] });

    const totalCents = state.items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);

    return { items: state.items, totalCents, addItem, removeItem, updateQty, clear };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
