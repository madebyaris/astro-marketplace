import type { APIRoute } from 'astro';
import { getSettings, updateSettings } from '../../../lib/admin-store';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(getSettings()), { headers: { 'content-type': 'application/json' } });
};

export const PUT: APIRoute = async ({ request }) => {
  const data = await request.json();
  const updated = updateSettings(data);
  return new Response(JSON.stringify(updated), { headers: { 'content-type': 'application/json' } });
};


