import type { D1Database } from '../db';
import { execute, queryFirst } from '../db';

export type PagesContent = {
  aboutHtml: string;
  privacyHtml: string;
  policyHtml: string;
  heroTitle: string;
  heroSubtitle: string;
};

export async function getPages(db: D1Database): Promise<PagesContent> {
  const row = await queryFirst<{
    about_html: string;
    privacy_html: string;
    policy_html: string;
    hero_title: string;
    hero_subtitle: string;
  }>(db, `
    SELECT about_html, privacy_html, policy_html, hero_title, hero_subtitle
    FROM pages_content WHERE id = 1
  `);
  if (!row) throw new Error('pages_content row missing');

  return {
    aboutHtml: row.about_html,
    privacyHtml: row.privacy_html,
    policyHtml: row.policy_html,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
  };
}

export async function updatePages(db: D1Database, input: Partial<PagesContent>): Promise<PagesContent> {
  const current = await getPages(db);
  const next: PagesContent = { ...current, ...input };

  await execute(db, `
    UPDATE pages_content SET
      about_html = ?,
      privacy_html = ?,
      policy_html = ?,
      hero_title = ?,
      hero_subtitle = ?,
      updated_at = strftime('%s','now')
    WHERE id = 1
  `, [
    next.aboutHtml,
    next.privacyHtml,
    next.policyHtml,
    next.heroTitle,
    next.heroSubtitle,
  ]);

  return next;
}

