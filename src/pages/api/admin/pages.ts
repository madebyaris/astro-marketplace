import type { APIRoute } from 'astro';
import { getPages, updatePages } from '../../../lib/repositories/pages';
import { getPages as getPagesMock, updatePages as updatePagesMock } from '../../../lib/admin-store';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const handleError = (error: unknown) => {
  console.error('[api/admin/pages] error', error);
  return json({ error: 'Internal Server Error' }, 500);
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    const pages = db ? await getPages(db) : getPagesMock();
    return json(pages);
  } catch (error) {
    return handleError(error);
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    const update = {
      aboutHtml: typeof payload.aboutHtml === 'string' ? payload.aboutHtml : undefined,
      privacyHtml: typeof payload.privacyHtml === 'string' ? payload.privacyHtml : undefined,
      policyHtml: typeof payload.policyHtml === 'string' ? payload.policyHtml : undefined,
      heroTitle: typeof payload.heroTitle === 'string' ? payload.heroTitle : undefined,
      heroSubtitle: typeof payload.heroSubtitle === 'string' ? payload.heroSubtitle : undefined,
    };
    const db = locals.runtime?.env?.DB;
    const updated = db ? await updatePages(db, update) : updatePagesMock(update as any);
    return json(updated);
  } catch (error) {
    return handleError(error);
  }
};


