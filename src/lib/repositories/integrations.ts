import type { D1Database } from '../db';
import { execute, queryFirst } from '../db';

export type IntegrationSettings = {
  smtp: {
    host: string;
    port: number;
    user: string;
    from: string;
  };
  s3: {
    endpoint: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
};

export async function getIntegrationSettings(db: D1Database): Promise<IntegrationSettings> {
  const row = await queryFirst<{
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_from: string;
    s3_endpoint: string;
    s3_bucket: string;
    s3_access_key_id: string;
    s3_secret_access_key: string;
  }>(db, `
    SELECT smtp_host, smtp_port, smtp_user, smtp_from,
           s3_endpoint, s3_bucket, s3_access_key_id, s3_secret_access_key
    FROM integration_settings WHERE id = 1
  `);

  if (!row) throw new Error('integration_settings row missing');

  return {
    smtp: {
      host: row.smtp_host,
      port: row.smtp_port,
      user: row.smtp_user,
      from: row.smtp_from,
    },
    s3: {
      endpoint: row.s3_endpoint,
      bucket: row.s3_bucket,
      accessKeyId: row.s3_access_key_id,
      secretAccessKey: row.s3_secret_access_key,
    },
  };
}

export async function updateIntegrationSettings(db: D1Database, input: Partial<IntegrationSettings>): Promise<IntegrationSettings> {
  const current = await getIntegrationSettings(db);
  const next: IntegrationSettings = {
    smtp: { ...current.smtp, ...(input.smtp ?? {}) },
    s3: { ...current.s3, ...(input.s3 ?? {}) },
  };

  await execute(db, `
    UPDATE integration_settings SET
      smtp_host = ?,
      smtp_port = ?,
      smtp_user = ?,
      smtp_from = ?,
      s3_endpoint = ?,
      s3_bucket = ?,
      s3_access_key_id = ?,
      s3_secret_access_key = ?,
      updated_at = strftime('%s','now')
    WHERE id = 1
  `, [
    next.smtp.host,
    next.smtp.port,
    next.smtp.user,
    next.smtp.from,
    next.s3.endpoint,
    next.s3.bucket,
    next.s3.accessKeyId,
    next.s3.secretAccessKey,
  ]);

  return next;
}

