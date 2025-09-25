import type { D1Database } from '../db';
import { execute, queryFirst } from '../db';

export type Settings = {
  purchasingEnabled: boolean;
  siteTitle: string;
  siteDescription: string;
  primaryColor: string;
  ogImage?: string;
  canonicalDomain?: string;
};

export async function getSettings(db: D1Database): Promise<Settings> {
  const row = await queryFirst<{
    purchasing_enabled: number;
    site_title: string;
    site_description: string;
    primary_color: string;
    og_image: string | null;
    canonical_domain: string | null;
  }>(db, `
    SELECT purchasing_enabled, site_title, site_description, primary_color, og_image, canonical_domain
    FROM settings
    WHERE id = 1
  `); 

  if (!row) throw new Error('Settings row missing');

  return {
    purchasingEnabled: Boolean(row.purchasing_enabled),
    siteTitle: row.site_title,
    siteDescription: row.site_description,
    primaryColor: row.primary_color,
    ogImage: row.og_image || undefined,
    canonicalDomain: row.canonical_domain || undefined,
  };
}

export async function updateSettings(db: D1Database, input: Partial<Settings>): Promise<Settings> {
  const current = await getSettings(db);

  const next: Settings = {
    ...current,
    ...input,
  };

  await execute(db, `
    UPDATE settings SET
      purchasing_enabled = ?,
      site_title = ?,
      site_description = ?,
      primary_color = ?,
      og_image = ?,
      canonical_domain = ?,
      updated_at = strftime('%s','now')
    WHERE id = 1
  `, [
    next.purchasingEnabled ? 1 : 0,
    next.siteTitle,
    next.siteDescription,
    next.primaryColor,
    next.ogImage ?? '',
    next.canonicalDomain ?? '',
  ]);

  return next;
}

