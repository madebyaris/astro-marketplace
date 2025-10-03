import type { DatabaseAdapter } from '../database/adapter'
import { execute, queryFirst } from '../database/helpers'

export interface IntegrationSettings {
  smtp?: {
    host?: string
    port?: number
    user?: string
    password?: string
    from?: string
  }
  s3?: {
    bucket?: string
    region?: string
    accessKey?: string
    secretKey?: string
  }
}

export async function getIntegrationSettings(db: DatabaseAdapter): Promise<IntegrationSettings> {
  const row = await queryFirst<{
    smtp_host?: string | null
    smtp_port?: number | null
    smtp_user?: string | null
    smtp_password?: string | null
    smtp_from?: string | null
    s3_bucket?: string | null
    s3_region?: string | null
    s3_access_key?: string | null
    s3_secret_key?: string | null
  }>(db, `
    SELECT
      smtp_host, smtp_port, smtp_user, smtp_password, smtp_from,
      s3_bucket, s3_region, s3_access_key, s3_secret_key
    FROM integrations
    LIMIT 1
  `)

  if (!row) {
    return {}
  }

  return {
    smtp: row.smtp_host ? {
      host: row.smtp_host,
      port: row.smtp_port ?? undefined,
      user: row.smtp_user ?? undefined,
      password: row.smtp_password ?? undefined,
      from: row.smtp_from ?? undefined,
    } : undefined,
    s3: row.s3_bucket ? {
      bucket: row.s3_bucket,
      region: row.s3_region ?? undefined,
      accessKey: row.s3_access_key ?? undefined,
      secretKey: row.s3_secret_key ?? undefined,
    } : undefined,
  }
}

export async function updateIntegrationSettings(db: DatabaseAdapter, input: Partial<IntegrationSettings>): Promise<IntegrationSettings> {
  const current = await getIntegrationSettings(db)
  
  const smtp = input.smtp ? {
    ...current.smtp,
    ...input.smtp
  } : current.smtp

  const s3 = input.s3 ? {
    ...current.s3,
    ...input.s3
  } : current.s3

  await execute(db, `
    INSERT INTO integrations (
      smtp_host, smtp_port, smtp_user, smtp_password, smtp_from,
      s3_bucket, s3_region, s3_access_key, s3_secret_key,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s','now'))
    ON CONFLICT DO UPDATE SET
      smtp_host = excluded.smtp_host,
      smtp_port = excluded.smtp_port,
      smtp_user = excluded.smtp_user,
      smtp_password = excluded.smtp_password,
      smtp_from = excluded.smtp_from,
      s3_bucket = excluded.s3_bucket,
      s3_region = excluded.s3_region,
      s3_access_key = excluded.s3_access_key,
      s3_secret_key = excluded.s3_secret_key,
      updated_at = excluded.updated_at
  `, [
    smtp?.host ?? null,
    smtp?.port ?? null,
    smtp?.user ?? null,
    smtp?.password ?? null,
    smtp?.from ?? null,
    s3?.bucket ?? null,
    s3?.region ?? null,
    s3?.accessKey ?? null,
    s3?.secretKey ?? null,
  ])

  return { smtp, s3 }
}
