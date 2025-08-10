import type { Product } from '../types/product';

export const mockProducts: Product[] = [
  {
    id: 1,
    slug: 'sample-product',
    title: 'Sample Product',
    description: 'This is a sample item.',
    descriptionHtml: `
      <p><strong>Sample Product</strong> is an example listing showcasing our marketplace layout and SEO approach.</p>
      <ul>
        <li>High-quality materials</li>
        <li>Trusted seller</li>
        <li>Fast shipping across Indonesia</li>
      </ul>
      <p>Optimized for search engines with descriptive content, headings, and structured data.</p>
    `,
    priceCents: 1999,
    stock: 10,
    imageUrl: 'https://picsum.photos/seed/sample/600/400',
    gallery: [
      'https://picsum.photos/seed/sample1/200/120',
      'https://picsum.photos/seed/sample2/200/120',
      'https://picsum.photos/seed/sample3/200/120',
      'https://picsum.photos/seed/sample4/200/120',
      'https://picsum.photos/seed/sample5/200/120',
    ],
    allowDirectPurchase: true,
    affiliate: { label: 'Tokopedia', targetUrl: 'https://www.tokopedia.com/' },
    categories: ['General'],
    rating: 4.7,
    soldCount: 1250,
    location: 'Jakarta',
    storeName: 'Astro Official',
    freeShipping: true,
  },
  {
    id: 2,
    slug: 'affiliate-only',
    title: 'Affiliate Only Item',
    description: 'Redirect to external marketplace only.',
    priceCents: 2999,
    stock: 0,
    imageUrl: 'https://picsum.photos/seed/affiliate/600/400',
    gallery: [],
    allowDirectPurchase: false,
    affiliate: { label: 'Shopee', targetUrl: 'https://shopee.co.id/' },
    categories: ['General'],
    rating: 4.4,
    soldCount: 880,
    location: 'Bandung',
    storeName: 'Best Store',
    freeShipping: false,
  },
];
