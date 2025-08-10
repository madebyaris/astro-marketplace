import type { APIRoute } from 'astro';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../../../lib/admin-store';

export const GET: APIRoute = () => new Response(JSON.stringify(listCategories()), { headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const created = createCategory(data);
  return new Response(JSON.stringify(created), { headers: { 'content-type': 'application/json' } });
};

export const PUT: APIRoute = async ({ request }) => {
  const data = await request.json();
  const updated = updateCategory(Number(data?.id), data);
  return new Response(JSON.stringify(updated ?? null), { headers: { 'content-type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ request }) => {
  const data = await request.json();
  const ok = deleteCategory(Number(data?.id));
  return new Response(JSON.stringify({ ok }), { headers: { 'content-type': 'application/json' } });
};


