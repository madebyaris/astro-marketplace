import React, { useEffect, useMemo, useState } from 'react';
import type { Product } from '../../types/product';

type Tab = 'products' | 'settings' | 'pages' | 'marketplaces' | 'users' | 'homepage' | 'categories' | 'statistics';

// Simple SVG Icons
const Icons = {
  Products: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Homepage: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Pages: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Categories: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Marketplaces: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Statistics: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
};

const navigationItems = [
  { id: 'products', label: 'Products', icon: Icons.Products },
  { id: 'statistics', label: 'Statistics', icon: Icons.Statistics },
  { id: 'homepage', label: 'Homepage', icon: Icons.Homepage },
  { id: 'pages', label: 'Pages', icon: Icons.Pages },
  { id: 'categories', label: 'Categories', icon: Icons.Categories },
  { id: 'marketplaces', label: 'Marketplaces', icon: Icons.Marketplaces },
  { id: 'users', label: 'Users', icon: Icons.Users },
  { id: 'settings', label: 'Settings', icon: Icons.Settings },
] as const;

export default function AdminApp() {
  const [tab, setTab] = useState<Tab>('products');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 sticky top-0 h-screen">
          <div className="bg-white h-full shadow-sm border-r border-gray-200/60 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-blue-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900 text-sm">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Marketplace Management</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="p-3 overflow-y-auto h-full">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id as Tab)}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/25' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
        </nav>
          </div>
      </aside>

        {/* Main Content - Full Width */}
        <main className="flex-1 min-w-0">
          <div className="bg-white min-h-screen">
            {tab === 'products' && <ProductsPanel />}
            {tab === 'statistics' && <StatisticsPanel />}
            {tab === 'homepage' && <HomepagePanel />}
            {tab === 'categories' && <CategoriesPanel />}
            {tab === 'pages' && <PagesPanel />}
            {tab === 'marketplaces' && <MarketplacesPanel />}
            {tab === 'users' && <UsersPanel />}
            {tab === 'settings' && <SettingsPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };
  useEffect(()=>{ void load(); }, []);

  const startNew = () => setEditing({
    id: 0,
    slug: '',
    title: '',
    description: '',
    shortDescription: '',
    descriptionHtml: '',
    marketplaceUrls: {},
    priceCents: 0,
    stock: 0,
    imageUrl: '',
    allowDirectPurchase: true,
  });

  const save = async (p: Product) => {
    const method = p.id ? 'PUT' : 'POST';
    const body = JSON.stringify(p.id ? p : ({...p, id: undefined} as any));
    await fetch('/api/admin/products', { method, headers: { 'content-type': 'application/json' }, body });
    setEditing(null);
    await load();
  };

  const remove = async (id: number) => {
    await fetch('/api/admin/products', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) });
    await load();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product catalog</p>
      </div>
        <button 
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
        >
          <Icons.Plus />
          Add Product
        </button>
      </div>

      {!products.length ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Icons.Products />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first product to the catalog.</p>
          <button 
            onClick={startNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
          >
            <Icons.Plus />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200/60">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Stock</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200/60">
              {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Icons.Products />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{p.title}</div>
                          <div className="text-sm text-gray-500">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">
                        Rp {Intl.NumberFormat('id-ID').format(p.priceCents)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : p.stock > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.allowDirectPurchase 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {p.allowDirectPurchase ? 'Direct Sale' : 'Affiliate Only'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditing(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Icons.Edit />
                          Edit
                        </button>
                        <button 
                          onClick={() => remove(p.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Icons.Trash />
                          Delete
                        </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {editing && <ProductForm initial={editing} onCancel={()=>setEditing(null)} onSave={save} />}
    </div>
  );
}

function ProductForm({ initial, onCancel, onSave }: { initial: Product; onCancel: () => void; onSave: (p: Product) => void }) {
  const [p, setP] = useState<Product>(initial);
  const update = (k: keyof Product, v: any) => setP({ ...p, [k]: v });
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200/60 bg-gradient-to-r from-emerald-50 to-blue-50">
          <h2 className="text-xl font-bold text-gray-900">
            {p.id ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {p.id ? 'Update product information' : 'Fill in the details for your new product'}
          </p>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6">
        <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                  value={p.title} 
                  onChange={(e)=>update('title', e.target.value)}
                  placeholder="Enter product title"
                />
        </div>
              
        <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                  value={p.slug} 
                  onChange={(e)=>update('slug', e.target.value)}
                  placeholder="product-url-slug"
                />
        </div>

              <div className="grid grid-cols-2 gap-4">
        <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (IDR)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                    value={p.priceCents} 
                    onChange={(e)=>update('priceCents', Number(e.target.value)||0)}
                    placeholder="0"
                  />
        </div>
        <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                    value={p.stock} 
                    onChange={(e)=>update('stock', Number(e.target.value)||0)}
                    placeholder="0"
                  />
        </div>
        </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image URL</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                  value={p.imageUrl} 
                  onChange={(e)=>update('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
        </div>

        <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                  value={p.shortDescription||''} 
                  onChange={(e)=>update('shortDescription', e.target.value)}
                  placeholder="Brief product summary for cards"
                />
        </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase Settings</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                  value={p.allowDirectPurchase? '1':'0'} 
                  onChange={(e)=>update('allowDirectPurchase', e.target.value==='1')}
                >
                  <option value="1">Allow Direct Purchase</option>
                  <option value="0">Affiliate/Redirect Only</option>
                </select>
        </div>
        </div>

            {/* Extended Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Description</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors h-24 resize-none" 
                  value={p.description} 
                  onChange={(e)=>update('description', e.target.value)}
                  placeholder="Detailed product description for SEO"
                />
        </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">HTML Description</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors h-32 resize-none font-mono text-sm" 
                  value={p.descriptionHtml||''} 
                  onChange={(e)=>update('descriptionHtml', e.target.value)} 
                  placeholder="<p>Rich HTML description for product pages</p>"
                />
        </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Marketplace Links</label>
                <div className="space-y-4">
            {['tokopedia','shopee','bukalapak','lazada'].map(key => (
              <div key={key}>
                      <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{key}</label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                        value={(p.marketplaceUrls?.[key])||''} 
                        onChange={(e)=>update('marketplaceUrls', { ...(p.marketplaceUrls||{}), [key]: e.target.value })} 
                        placeholder={`https://${key}.com/product-link`}
                      />
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200/60 bg-gray-50/50 flex items-center justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={()=>onSave(p)}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
          >
            {p.id ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<{ purchasingEnabled: boolean; siteTitle: string; siteDescription: string; ogImage?: string; canonicalDomain?: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/settings');
    const data = await res.json();
    setSettings(data);
    setLoading(false);
  };
  useEffect(()=>{ void load(); }, []);

  const save = async () => {
    await fetch('/api/admin/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(settings) });
    await load();
  };

  if (loading || !settings) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
          <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your site settings and SEO preferences</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">General Settings</h2>
        </div>
        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-amber-600 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
          </div>
          <div>
                <p className="text-sm font-medium text-amber-800">Important</p>
                <p className="text-sm text-amber-700 mt-1">Enter valid URLs for OG image and canonical domain. Example: https://example.com</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Site Title</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                value={settings.siteTitle} 
                onChange={(e)=>setSettings({ ...settings, siteTitle: e.target.value })}
                placeholder="Your site title"
              />
            </div>
            
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Purchasing Status</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                value={settings.purchasingEnabled? '1':'0'} 
                onChange={(e)=>setSettings({ ...settings, purchasingEnabled: e.target.value==='1' })}
              >
                <option value="1">✅ Purchasing Enabled</option>
                <option value="0">🚫 Purchasing Disabled</option>
            </select>
          </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Site Description</label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors h-24 resize-none" 
                value={settings.siteDescription} 
                onChange={(e)=>setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Brief description of your marketplace"
              />
          </div>

          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Open Graph Image URL</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="https://example.com/og-image.jpg" 
                value={settings.ogImage||''} 
                onChange={(e)=>setSettings({ ...settings, ogImage: e.target.value })}
              />
          </div>

          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Canonical Domain</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="https://example.com" 
                value={settings.canonicalDomain||''} 
                onChange={(e)=>setSettings({ ...settings, canonicalDomain: e.target.value })}
              />
          </div>
        </div>

          <div className="flex items-center justify-end mt-6">
            <button 
              onClick={save}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">Integrations</h2>
          <p className="text-sm text-gray-500 mt-1">Configure external services and API connections</p>
        </div>
      <IntegrationsPanel />
      </div>
    </div>
  );
}

function IntegrationsPanel() {
  const [loading, setLoading] = useState(true);
  const [cfg, setCfg] = useState<{ smtp: { host: string; port: number; user: string; from: string }; s3: { endpoint: string; bucket: string; accessKeyId: string; secretAccessKey: string } } | null>(null);
  
  useEffect(()=>{ 
    (async ()=>{ 
      setLoading(true); 
      const res = await fetch('/api/admin/config'); 
      setCfg(await res.json()); 
      setLoading(false); 
    })(); 
  }, []);

  const save = async () => {
    // simple client-side validation
    if (cfg?.smtp.host && !/^\w+([.-]?\w+)*\.[a-zA-Z]{2,}$/.test(cfg.smtp.host) && !cfg.smtp.host.startsWith('localhost')) {
      alert('SMTP host appears to be invalid');
      return;
    }
    await fetch('/api/admin/config', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(cfg) });
  };

  if (loading || !cfg) {
  return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading integrations...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SMTP Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
        <div>
              <h3 className="font-semibold text-gray-900">SMTP Email</h3>
              <p className="text-sm text-gray-500">Configure email delivery service</p>
          </div>
        </div>
          
          <div className="space-y-4">
        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="smtp.example.com" 
                value={cfg.smtp.host} 
                onChange={(e)=>setCfg({ ...cfg, smtp: { ...cfg.smtp, host: e.target.value } })} 
              />
          </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="587" 
                type="number" 
                value={cfg.smtp.port} 
                onChange={(e)=>setCfg({ ...cfg, smtp: { ...cfg.smtp, port: Number(e.target.value)||0 } })} 
              />
        </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="your-email@example.com" 
                value={cfg.smtp.user} 
                onChange={(e)=>setCfg({ ...cfg, smtp: { ...cfg.smtp, user: e.target.value } })} 
              />
      </div>
            
        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="noreply@example.com" 
                type="email" 
                value={cfg.smtp.from} 
                onChange={(e)=>setCfg({ ...cfg, smtp: { ...cfg.smtp, from: e.target.value } })} 
              />
            </div>
          </div>
        </div>

        {/* S3 Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Object Storage</h3>
              <p className="text-sm text-gray-500">S3-compatible storage for files</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="https://s3.amazonaws.com" 
                value={cfg.s3.endpoint} 
                onChange={(e)=>setCfg({ ...cfg, s3: { ...cfg.s3, endpoint: e.target.value } })} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bucket Name</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="my-marketplace-assets" 
                value={cfg.s3.bucket} 
                onChange={(e)=>setCfg({ ...cfg, s3: { ...cfg.s3, bucket: e.target.value } })} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Key ID</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="AKIAIOSFODNN7EXAMPLE" 
                value={cfg.s3.accessKeyId} 
                onChange={(e)=>setCfg({ ...cfg, s3: { ...cfg.s3, accessKeyId: e.target.value } })} 
              />
            </div>
            
        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Access Key</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" 
                type="password"
                value={cfg.s3.secretAccessKey} 
                onChange={(e)=>setCfg({ ...cfg, s3: { ...cfg.s3, secretAccessKey: e.target.value } })} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200/60">
        <button 
          onClick={save}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
        >
          Save Integrations
        </button>
      </div>
    </div>
  );
}

function HomepagePanel() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<{ heroTitle: string; heroSubtitle: string } | null>(null);
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      setState({ heroTitle: data.heroTitle || '', heroSubtitle: data.heroSubtitle || '' });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    await fetch('/api/admin/pages', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(state) });
  };

  if (loading || !state) {
  return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading homepage...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Homepage Content</h1>
        <p className="text-gray-500 text-sm mt-1">Customize your homepage hero section</p>
      </div>

      {/* Hero Settings */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">Hero Section</h2>
          <p className="text-sm text-gray-500 mt-1">Main banner text displayed on your homepage</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                value={state.heroTitle} 
                onChange={(e)=>setState({ ...state, heroTitle: e.target.value })}
                placeholder="Main headline for your homepage"
              />
          </div>
            
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                value={state.heroSubtitle} 
                onChange={(e)=>setState({ ...state, heroSubtitle: e.target.value })}
                placeholder="Supporting text below the main headline"
              />
          </div>
        </div>

          <div className="flex items-center justify-end mt-6">
            <button 
              onClick={save}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PagesPanel() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<{ aboutHtml: string; privacyHtml: string; policyHtml: string } | null>(null);
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      setPages({ aboutHtml: data.aboutHtml || '', privacyHtml: data.privacyHtml || '', policyHtml: data.policyHtml || '' });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    await fetch('/api/admin/pages', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(pages) });
  };

  if (loading || !pages) {
  return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading pages...</span>
          </div>
          </div>
          </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your site's content pages</p>
        </div>

      {/* Pages Content */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200/60">
            <h2 className="font-semibold text-gray-900">About Us Page</h2>
            <p className="text-sm text-gray-500 mt-1">Content for the /about page</p>
          </div>
          <div className="p-6">
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors h-40 resize-none font-mono text-sm"
              value={pages.aboutHtml}
              onChange={(e) => setPages({ ...pages, aboutHtml: e.target.value })}
              placeholder="<p>Enter HTML content for your About page...</p>"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200/60">
            <h2 className="font-semibold text-gray-900">Privacy Policy</h2>
            <p className="text-sm text-gray-500 mt-1">Content for the /privacy page</p>
          </div>
          <div className="p-6">
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors h-40 resize-none font-mono text-sm"
              value={pages.privacyHtml}
              onChange={(e) => setPages({ ...pages, privacyHtml: e.target.value })}
              placeholder="<p>Enter HTML content for your Privacy Policy...</p>"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200/60">
            <h2 className="font-semibold text-gray-900">Store Policy</h2>
            <p className="text-sm text-gray-500 mt-1">Content for the /kebijakan page</p>
          </div>
          <div className="p-6">
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors h-40 resize-none font-mono text-sm"
              value={pages.policyHtml}
              onChange={(e) => setPages({ ...pages, policyHtml: e.target.value })}
              placeholder="<p>Enter HTML content for your Store Policy...</p>"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={save}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
          >
            Save All Pages
          </button>
        </div>
      </div>
    </div>
  );
}

function MarketplacesPanel() {
  const [list, setList] = useState<string[]>(['tokopedia', 'shopee']);
  const [newName, setNewName] = useState('');

  const addMarketplace = () => {
    if (!newName.trim()) return;
    if (!list.includes(newName.trim())) {
      setList([...list, newName.trim()]);
    }
    setNewName('');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Marketplaces</h1>
        <p className="text-gray-500 text-sm mt-1">Manage supported marketplace platforms</p>
        </div>

      {/* Add New Marketplace */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">Add Marketplace</h2>
          <p className="text-sm text-gray-500 mt-1">Add a new marketplace platform</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <input
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Marketplace name (e.g., tokopedia, shopee)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMarketplace()}
            />
            <button
              onClick={addMarketplace}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 flex items-center gap-2"
            >
              <Icons.Plus />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Marketplace List */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">Active Marketplaces</h2>
          <p className="text-sm text-gray-500 mt-1">Currently supported marketplace platforms</p>
        </div>
        <div className="p-6">
          {list.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Icons.Marketplaces />
              </div>
              <p className="text-gray-500">No marketplaces configured yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((marketplace) => (
                <div
                  key={marketplace}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200/60 flex items-center justify-center">
                      <Icons.Marketplaces />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 capitalize">{marketplace}</div>
                      <div className="text-sm text-gray-500">{marketplace}.com</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setList(list.filter(x => x !== marketplace))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Icons.Trash />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UsersPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage user accounts and permissions</p>
      </div>

      {/* Development Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 text-blue-600 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Development Mode</h3>
            <p className="text-sm text-blue-800 mt-1">
              This is a mock user management interface. In production, this will be connected to D1 database with proper authentication.
            </p>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">Add New User</h2>
          <p className="text-sm text-gray-500 mt-1">Create a new user account (mock)</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <button
              onClick={() => {
                setEmail('');
                setPassword('');
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
              Add User (Mock)
            </button>
          </div>
        </div>
      </div>

      {/* Mock Users List */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">Current Users</h2>
          <p className="text-sm text-gray-500 mt-1">List of registered users (mock data)</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">admin@example.com</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Admin
                    </span>
                    Joined 2 days ago
                  </div>
                </div>
              </div>
          <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Icons.Edit />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoriesPanel() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Array<{ id: number; slug: string; name: string }>>([]);
  const [form, setForm] = useState<{ id?: number; slug: string; name: string }>({ slug: '', name: '' });

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/categories');
    setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    const method = form.id ? 'PUT' : 'POST';
    await fetch('/api/admin/categories', {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ slug: '', name: '' });
    await load();
  };

  const remove = async (id: number) => {
    await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id })
    });
    await load();
  };

  if (loading) {
  return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading categories...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Organize your products with categories</p>
      </div>

      {/* Add/Edit Category Form */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">
            {form.id ? 'Edit Category' : 'Add New Category'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {form.id ? 'Update category information' : 'Create a new product category'}
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="category-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Category Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={save}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
              >
                {form.id ? 'Update' : 'Add'}
              </button>
              {form.id && (
                <button
                  onClick={() => setForm({ slug: '', name: '' })}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">All Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
        </div>
        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Icons.Categories />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories yet</h3>
              <p className="text-gray-500">Create your first category to organize products</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200/60 flex items-center justify-center">
                      <Icons.Categories />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.slug}</div>
                    </div>
                  </div>
              <div className="flex items-center gap-2">
                    <button
                      onClick={() => setForm({ id: category.id, slug: category.slug, name: category.name })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Icons.Edit />
                      Edit
                    </button>
                    <button
                      onClick={() => remove(category.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Icons.Trash />
                      Delete
                    </button>
              </div>
                </div>
          ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatisticsPanel() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalClicks: number;
    todayClicks: number;
    weekClicks: number;
    monthClicks: number;
    topProducts: Array<{
      id: number;
      title: string;
      slug: string;
      totalClicks: number;
      clicksToday: number;
      marketplaces: Array<{ label: string; clicks: number; targetUrl: string }>;
    }>;
    clickHistory: Array<{
      date: string;
      clicks: number;
    }>;
    marketplaceStats: Array<{
      marketplace: string;
      clicks: number;
      percentage: number;
    }>;
  } | null>(null);

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/statistics?range=${timeRange}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [timeRange]);

  if (loading || !stats) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading statistics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Affiliate Statistics</h1>
            <p className="text-gray-500 text-sm mt-1">Track affiliate link performance and clicks</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalClicks.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.todayClicks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.weekClicks}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.monthClicks}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Click History Chart */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200/60">
            <h2 className="font-semibold text-gray-900">Click History</h2>
            <p className="text-sm text-gray-500 mt-1">Daily affiliate link clicks over time</p>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end justify-between gap-1">
              {stats.clickHistory.slice(-14).map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t-sm"
                    style={{ height: `${(day.clicks / Math.max(...stats.clickHistory.map(d => d.clicks))) * 100}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marketplace Distribution */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200/60">
            <h2 className="font-semibold text-gray-900">Marketplace Distribution</h2>
            <p className="text-sm text-gray-500 mt-1">Clicks by marketplace platform</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.marketplaceStats.map((marketplace, index) => (
                <div key={marketplace.marketplace}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{marketplace.marketplace}</span>
                    <span className="text-sm text-gray-500">{marketplace.clicks} ({marketplace.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${marketplace.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <h2 className="font-semibold text-gray-900">Top Performing Products</h2>
          <p className="text-sm text-gray-500 mt-1">Products with the most affiliate clicks</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {stats.topProducts.map((product) => (
              <div key={product.id} className="border border-gray-200/60 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.title}</h3>
                    <p className="text-sm text-gray-500">{product.slug}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{product.totalClicks}</div>
                    <div className="text-sm text-gray-500">total clicks</div>
                    <div className="text-sm text-green-600 font-medium">+{product.clicksToday} today</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Marketplace Breakdown:</h4>
                  {product.marketplaces.map((marketplace) => (
                    <div key={marketplace.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{marketplace.label}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{marketplace.targetUrl}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{marketplace.clicks}</div>
                        <div className="text-sm text-gray-500">clicks</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


