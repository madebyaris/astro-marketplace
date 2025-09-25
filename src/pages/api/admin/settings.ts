import type { APIRoute } from 'astro';
import { getSettings, updateSettings } from '../../../lib/repositories/settings';
import { getSettings as getSettingsMock, updateSettings as updateSettingsMock } from '../../../lib/admin-store';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const handleError = (error: unknown) => {
  console.error('[api/admin/settings] error', error);
  return json({ error: 'Internal Server Error' }, 500);
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    const settings = db ? await getSettings(db) : getSettingsMock();
    return json(settings);
  } catch (error) {
    return handleError(error);
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    const update = {
      purchasingEnabled: payload.purchasingEnabled,
      siteTitle: typeof payload.siteTitle === 'string' ? payload.siteTitle : undefined,
      siteDescription: typeof payload.siteDescription === 'string' ? payload.siteDescription : undefined,
      primaryColor: typeof payload.primaryColor === 'string' ? payload.primaryColor : undefined,
      ogImage: typeof payload.ogImage === 'string' ? payload.ogImage : undefined,
      canonicalDomain: typeof payload.canonicalDomain === 'string' ? payload.canonicalDomain : undefined,
    };
    const db = locals.runtime?.env?.DB;
    const updated = db ? await updateSettings(db, update) : updateSettingsMock(update as any);
    return json(updated);
  } catch (error) {
    return handleError(error);
  }
};


