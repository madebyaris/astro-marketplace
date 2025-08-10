import React from 'react';

export function Price({ cents }: { cents: number }) {
  const price = (cents / 100).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });
  return <span>{price}</span>;
}
