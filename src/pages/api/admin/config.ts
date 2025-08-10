import type { APIRoute } from 'astro';
import { getConfig, updateConfig } from '../../../lib/admin-store';

export const GET: APIRoute = () => new Response(JSON.stringify(getConfig()), { headers: { 'content-type': 'application/json' } });

export const PUT: APIRoute = async ({ request }) => {
  const data = await request.json();
  const updated = updateConfig(data);
  return new Response(JSON.stringify(updated), { headers: { 'content-type': 'application/json' } });
};


