import React from 'react';
import { useCart } from './CartContext';
import { Price } from '../Price';

export default function CartSheet() {
  const { items, totalCents, removeItem, updateQty, clear } = useCart();
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <h2 className="mb-3 text-lg font-semibold">Cart</h2>
      {!items.length ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center gap-3">
              <img src={i.imageUrl} alt="" className="h-14 w-14 rounded object-cover" />
              <div className="flex-1">
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-gray-500">
                  <Price cents={i.priceCents} />
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <label>Qty</label>
                  <div className="inline-flex items-center rounded border border-gray-200">
                    <button className="px-2" onClick={() => updateQty(i.productId, Math.max(1, i.quantity - 1))}>−</button>
                    <input
                      aria-label="Quantity"
                      type="number"
                      min={1}
                      value={i.quantity}
                      onChange={(e) => updateQty(i.productId, Math.max(1, Number(e.target.value) || 1))}
                      className="w-14 border-x border-gray-200 px-2 py-1 text-center outline-none"
                    />
                    <button className="px-2" onClick={() => updateQty(i.productId, i.quantity + 1)}>+</button>
                  </div>
                  <button className="text-red-600 hover:underline" onClick={() => removeItem(i.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-lg font-semibold text-emerald-600">
              <Price cents={totalCents} />
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/checkout" className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-center text-white hover:bg-emerald-700">
              Checkout
            </a>
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:border-gray-300" onClick={clear}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
