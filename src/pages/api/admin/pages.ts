import type { APIRoute } from 'astro';
import { getPages, updatePages } from '../../../lib/admin-store';

export const GET: APIRoute = () => new Response(JSON.stringify(getPages()), { headers: { 'content-type': 'application/json' } });

export const PUT: APIRoute = async ({ request }) => {
  const data = await request.json();
  const updated = updatePages(data);
  return new Response(JSON.stringify(updated), { headers: { 'content-type': 'application/json' } });
};


