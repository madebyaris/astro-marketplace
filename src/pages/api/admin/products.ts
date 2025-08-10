import type { APIRoute } from 'astro';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../../../lib/admin-store';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(listProducts()), { headers: { 'content-type': 'application/json' } });
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const created = createProduct(data);
  return new Response(JSON.stringify(created), { headers: { 'content-type': 'application/json' } });
};

export const PUT: APIRoute = async ({ request }) => {
  const data = await request.json();
  const { id, ...rest } = data || {};
  const updated = updateProduct(Number(id), rest);
  return new Response(JSON.stringify(updated ?? null), { headers: { 'content-type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ request }) => {
  const data = await request.json();
  const ok = deleteProduct(Number(data?.id));
  return new Response(JSON.stringify({ ok }), { headers: { 'content-type': 'application/json' } });
};


