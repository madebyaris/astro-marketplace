import type { DatabaseAdapter } from '../database/adapter'
import { execute, queryFirst } from '../database/helpers'
import type { PagesContent } from '../../types'

export async function getPages(db: DatabaseAdapter): Promise<PagesContent> {
  const row = await queryFirst<{
    about_html?: string | null
    privacy_html?: string | null
    policy_html?: string | null
    hero_title?: string | null
    hero_subtitle?: string | null
  }>(db, `
    SELECT
      about_html,
      privacy_html,
      policy_html,
      hero_title,
      hero_subtitle
    FROM pages
    LIMIT 1
  `)

  if (!row) {
    return {}
  }

  return {
    aboutHtml: row.about_html ?? undefined,
    privacyHtml: row.privacy_html ?? undefined,
    policyHtml: row.policy_html ?? undefined,
    heroTitle: row.hero_title ?? undefined,
    heroSubtitle: row.hero_subtitle ?? undefined,
  }
}

export async function updatePages(db: DatabaseAdapter, input: Partial<PagesContent>): Promise<PagesContent> {
  const current = await getPages(db)
  const next: PagesContent = { ...current, ...input }

  await execute(db, `
    INSERT INTO pages (
      about_html, privacy_html, policy_html,
      hero_title, hero_subtitle, updated_at
    ) VALUES (?, ?, ?, ?, ?, strftime('%s','now'))
    ON CONFLICT DO UPDATE SET
      about_html = excluded.about_html,
      privacy_html = excluded.privacy_html,
      policy_html = excluded.policy_html,
      hero_title = excluded.hero_title,
      hero_subtitle = excluded.hero_subtitle,
      updated_at = excluded.updated_at
  `, [
    next.aboutHtml ?? null,
    next.privacyHtml ?? null,
    next.policyHtml ?? null,
    next.heroTitle ?? null,
    next.heroSubtitle ?? null,
  ])

  return next
}
