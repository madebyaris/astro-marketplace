import type { APIRoute } from 'astro';

const site = 'https://example.com'; // replace at deployment

export const GET: APIRoute = () => {
  const urls = ['', '/store', '/admin', '/privacy', '/kebijakan', '/about', '/contact', '/cart', '/checkout'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `<url><loc>${site}${path}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
  )
  .join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml' } });
};
