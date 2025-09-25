import type { APIRoute } from 'astro';
import { getIntegrationSettings, updateIntegrationSettings } from '../../../lib/repositories/integrations';
import { getConfig as getConfigMock, updateConfig as updateConfigMock } from '../../../lib/admin-store';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const handleError = (error: unknown) => {
  console.error('[api/admin/config] error', error);
  return json({ error: 'Internal Server Error' }, 500);
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    const config = db ? await getIntegrationSettings(db) : getConfigMock();
    return json(config);
  } catch (error) {
    return handleError(error);
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    const db = locals.runtime?.env?.DB;
    const updated = db
      ? await updateIntegrationSettings(db, {
          smtp: payload.smtp,
          s3: payload.s3,
        })
      : updateConfigMock(payload);
    return json(updated);
  } catch (error) {
    return handleError(error);
  }
};


