import type { DatabaseAdapter } from '../database/adapter'
import { execute, queryFirst } from '../database/helpers'
import type { Settings } from '../../types'

export async function getSettings(db: DatabaseAdapter): Promise<Settings> {
  const row = await queryFirst<{
    purchasing_enabled: number
    site_title?: string | null
    site_description?: string | null
    primary_color?: string | null
    og_image?: string | null
    canonical_domain?: string | null
  }>(db, `
    SELECT
      purchasing_enabled,
      site_title,
      site_description,
      primary_color,
      og_image,
      canonical_domain
    FROM settings
    LIMIT 1
  `)

  if (!row) {
    // Return default settings if none exist
    return {
      purchasingEnabled: true,
      siteTitle: 'Astro Marketplace',
      siteDescription: 'Simple marketplace with affiliate links'
    }
  }

  return {
    purchasingEnabled: Boolean(row.purchasing_enabled),
    siteTitle: row.site_title ?? undefined,
    siteDescription: row.site_description ?? undefined,
    primaryColor: row.primary_color ?? undefined,
    ogImage: row.og_image ?? undefined,
    canonicalDomain: row.canonical_domain ?? undefined,
  }
}

export async function updateSettings(db: DatabaseAdapter, input: Partial<Settings>): Promise<Settings> {
  const current = await getSettings(db)
  const next: Settings = { ...current, ...input }

  await execute(db, `
    INSERT INTO settings (
      purchasing_enabled, site_title, site_description,
      primary_color, og_image, canonical_domain, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, strftime('%s','now'))
    ON CONFLICT DO UPDATE SET
      purchasing_enabled = excluded.purchasing_enabled,
      site_title = excluded.site_title,
      site_description = excluded.site_description,
      primary_color = excluded.primary_color,
      og_image = excluded.og_image,
      canonical_domain = excluded.canonical_domain,
      updated_at = excluded.updated_at
  `, [
    next.purchasingEnabled ? 1 : 0,
    next.siteTitle ?? null,
    next.siteDescription ?? null,
    next.primaryColor ?? null,
    next.ogImage ?? null,
    next.canonicalDomain ?? null,
  ])

  return next
}
