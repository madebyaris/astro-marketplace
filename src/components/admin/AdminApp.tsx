import React, { useEffect, useMemo, useState } from 'react';
import type { Product } from '../../types/product';

type Tab = 'products' | 'settings' | 'pages' | 'marketplaces' | 'users' | 'homepage' | 'categories';

export default function AdminApp() {
  const [tab, setTab] = useState<Tab>('products');
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-2xl border border-gray-200 p-4">
        <div className="text-sm font-semibold text-gray-700">Admin</div>
        <nav className="mt-3 grid gap-1 text-sm">
          <button className={`rounded-lg px-3 py-2 text-left hover:bg-gray-50 ${tab==='products'?'bg-gray-50 font-medium':''}`} onClick={()=>setTab('products')}>Products</button>
          <button className={`rounded-lg px-3 py-2 text-left hover:bg-gray-50 ${tab==='homepage'?'bg-gray-50 font-medium':''}`} onClick={()=>setTab('homepage')}>Homepage</button>
          <button className={`rounded-lg px-3 py-2 text-left hover:bg-gray-50 ${tab==='pages'?'bg-gray-50 font-medium':''}`} onClick={()=>setTab('pages')}>Pages</button>
          <button className={`rounded-lg px-3 py-2 text-left hover:bg-gray-50 ${tab==='categories'?'bg-gray-50 font-medium':''}`} onClick={()=>setTab('categories')}>Categories</button>
          <button className={`rounded-lg px-3 py-2 text-left hover:bg-gray-50 ${tab==='marketplaces'?'bg-gray-50 font-medium':''}`} onClick={()=>setTab('marketplaces')}>Marketplaces</button>
          <button className={`rounded-lg px-3 py-2 text-left hover:bg-gray-50 ${tab==='users'?'bg-gray-50 font-medium':''}`} onClick={()=>setTab('users')}>Users</button>
          <button className={`rounded-lg px-3 py-2 text-left hover:bg-gray-50 ${tab==='settings'?'bg-gray-50 font-medium':''}`} onClick={()=>setTab('settings')}>Settings</button>
        </nav>
      </aside>
      <section>
        {tab==='products' && <ProductsPanel />}
        {tab==='homepage' && <HomepagePanel />}
        {tab==='categories' && <CategoriesPanel />}
        {tab==='pages' && <PagesPanel />}
        {tab==='marketplaces' && <MarketplacesPanel />}
        {tab==='users' && <UsersPanel />}
        {tab==='settings' && <SettingsPanel />}
      </section>
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

  if (loading) return <div className="text-sm text-gray-500">Memuat…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700" onClick={startNew}>Tambah</button>
      </div>
      {!products.length ? (
        <p className="text-sm text-gray-500">Belum ada produk.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2">Judul</th>
                <th className="px-3 py-2">Harga</th>
                <th className="px-3 py-2">Stok</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">{p.title}</td>
                  <td className="px-3 py-2">Rp {Intl.NumberFormat('id-ID').format(p.priceCents)}</td>
                  <td className="px-3 py-2">{p.stock}</td>
                  <td className="px-3 py-2">{p.slug}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="rounded border px-2 py-1 text-gray-700 hover:bg-gray-50" onClick={()=>setEditing(p)}>Edit</button>
                    <button className="ml-2 rounded border px-2 py-1 text-red-600 hover:bg-red-50" onClick={()=>remove(p.id)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-gray-600">Judul</label>
          <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={p.title} onChange={(e)=>update('title', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Slug</label>
          <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={p.slug} onChange={(e)=>update('slug', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Harga (cents)</label>
          <input type="number" className="w-full rounded-lg border border-gray-200 px-3 py-2" value={p.priceCents} onChange={(e)=>update('priceCents', Number(e.target.value)||0)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Stok</label>
          <input type="number" className="w-full rounded-lg border border-gray-200 px-3 py-2" value={p.stock} onChange={(e)=>update('stock', Number(e.target.value)||0)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Gambar</label>
          <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={p.imageUrl} onChange={(e)=>update('imageUrl', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Short Description</label>
          <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={p.shortDescription||''} onChange={(e)=>update('shortDescription', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Deskripsi</label>
          <textarea className="h-28 w-full rounded-lg border border-gray-200 px-3 py-2" value={p.description} onChange={(e)=>update('description', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Deskripsi HTML</label>
          <textarea className="h-28 w-full rounded-lg border border-gray-200 px-3 py-2" value={p.descriptionHtml||''} onChange={(e)=>update('descriptionHtml', e.target.value)} placeholder="<p>...</p>" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Marketplace URLs</label>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {['tokopedia','shopee','bukalapak','lazada'].map(key => (
              <div key={key}>
                <label className="mb-1 block text-xs text-gray-500 capitalize">{key}</label>
                <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={(p.marketplaceUrls?.[key])||''} onChange={(e)=>update('marketplaceUrls', { ...(p.marketplaceUrls||{}), [key]: e.target.value })} placeholder={`https://${key}.com/...`} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Direct Purchase</label>
          <select className="w-full rounded-lg border border-gray-200 px-3 py-2" value={p.allowDirectPurchase? '1':'0'} onChange={(e)=>update('allowDirectPurchase', e.target.value==='1')}>
            <option value="1">Enabled</option>
            <option value="0">Disabled</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button className="rounded border px-3 py-1.5 text-gray-700 hover:bg-gray-50" onClick={onCancel}>Batal</button>
        <button className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700" onClick={()=>onSave(p)}>Simpan</button>
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

  if (loading || !settings) return <div className="text-sm text-gray-500">Memuat…</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Settings</h2>
      <div className="rounded-2xl border border-gray-200 p-4">
        <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-900">Masukkan URL yang valid untuk OG image dan domain canonical. Contoh canonical: https://example.com</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Site Title</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={settings.siteTitle} onChange={(e)=>setSettings({ ...settings, siteTitle: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Purchasing</label>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2" value={settings.purchasingEnabled? '1':'0'} onChange={(e)=>setSettings({ ...settings, purchasingEnabled: e.target.value==='1' })}>
              <option value="1">Enabled</option>
              <option value="0">Disabled</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-gray-600">Site Description</label>
            <textarea className="h-24 w-full rounded-lg border border-gray-200 px-3 py-2" value={settings.siteDescription} onChange={(e)=>setSettings({ ...settings, siteDescription: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">OG Image URL</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2" placeholder="https://.../og.jpg" value={settings.ogImage||''} onChange={(e)=>setSettings({ ...settings, ogImage: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Canonical Domain</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2" placeholder="https://example.com" value={settings.canonicalDomain||''} onChange={(e)=>setSettings({ ...settings, canonicalDomain: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <button className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700" onClick={save}>Simpan</button>
        </div>
      </div>

      <h3 className="text-base font-semibold">Integrations</h3>
      <IntegrationsPanel />
    </div>
  );
}

function IntegrationsPanel() {
  const [loading, setLoading] = useState(true);
  const [cfg, setCfg] = useState<{ smtp: { host: string; port: number; user: string; from: string }; s3: { endpoint: string; bucket: string; accessKeyId: string; secretAccessKey: string } } | null>(null);
  useEffect(()=>{ (async ()=>{ setLoading(true); const res = await fetch('/api/admin/config'); setCfg(await res.json()); setLoading(false); })(); }, []);
  const save = async () => {
    // simple client-side validation
    if (cfg?.smtp.host && !/^\w+([.-]?\w+)*\.[a-zA-Z]{2,}$/.test(cfg.smtp.host) && !cfg.smtp.host.startsWith('localhost')) {
      alert('SMTP host tampak tidak valid');
      return;
    }
    await fetch('/api/admin/config', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(cfg) });
  };
  if (loading || !cfg) return <div className="text-sm text-gray-500">Memuat integrasi…</div>;
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold">SMTP</div>
          <div className="mt-2 grid grid-cols-1 gap-2">
            <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="Host" value={cfg.smtp.host} onChange={(e)=>setCfg({ ...cfg, smtp: { ...cfg.smtp, host: e.target.value } })} />
            <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="Port" type="number" value={cfg.smtp.port} onChange={(e)=>setCfg({ ...cfg, smtp: { ...cfg.smtp, port: Number(e.target.value)||0 } })} />
            <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="User" value={cfg.smtp.user} onChange={(e)=>setCfg({ ...cfg, smtp: { ...cfg.smtp, user: e.target.value } })} />
            <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="From Email" type="email" value={cfg.smtp.from} onChange={(e)=>setCfg({ ...cfg, smtp: { ...cfg.smtp, from: e.target.value } })} />
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold">S3 / Object Storage</div>
          <div className="mt-2 grid grid-cols-1 gap-2">
            <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="Endpoint" value={cfg.s3.endpoint} onChange={(e)=>setCfg({ ...cfg, s3: { ...cfg.s3, endpoint: e.target.value } })} />
            <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="Bucket" value={cfg.s3.bucket} onChange={(e)=>setCfg({ ...cfg, s3: { ...cfg.s3, bucket: e.target.value } })} />
            <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="Access Key ID" value={cfg.s3.accessKeyId} onChange={(e)=>setCfg({ ...cfg, s3: { ...cfg.s3, accessKeyId: e.target.value } })} />
            <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="Secret Access Key" value={cfg.s3.secretAccessKey} onChange={(e)=>setCfg({ ...cfg, s3: { ...cfg.s3, secretAccessKey: e.target.value } })} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <button className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700" onClick={save}>Simpan Integrasi</button>
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
  if (loading || !state) return <div className="text-sm text-gray-500">Memuat…</div>;
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Homepage Content</h2>
      <div className="rounded-2xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Hero Title</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={state.heroTitle} onChange={(e)=>setState({ ...state, heroTitle: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Hero Subtitle</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={state.heroSubtitle} onChange={(e)=>setState({ ...state, heroSubtitle: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <button className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700" onClick={save}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

function PagesPanel() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<{ aboutHtml: string; privacyHtml: string; policyHtml: string } | null>(null);
  useEffect(()=>{(async()=>{ setLoading(true); const res=await fetch('/api/admin/pages'); const data=await res.json(); setPages({ aboutHtml: data.aboutHtml||'', privacyHtml: data.privacyHtml||'', policyHtml: data.policyHtml||'' }); setLoading(false); })()},[]);
  const save = async () => { await fetch('/api/admin/pages', { method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(pages) }); };
  if (loading || !pages) return <div className="text-sm text-gray-500">Memuat…</div>;
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Pages</h2>
      <div className="rounded-2xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Tentang Kami (HTML)</label>
            <textarea className="h-40 w-full rounded-lg border border-gray-200 px-3 py-2" value={pages.aboutHtml} onChange={(e)=>setPages({ ...pages, aboutHtml: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Kebijakan Privasi (HTML)</label>
            <textarea className="h-40 w-full rounded-lg border border-gray-200 px-3 py-2" value={pages.privacyHtml} onChange={(e)=>setPages({ ...pages, privacyHtml: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Kebijakan Toko (HTML)</label>
            <textarea className="h-40 w-full rounded-lg border border-gray-200 px-3 py-2" value={pages.policyHtml} onChange={(e)=>setPages({ ...pages, policyHtml: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <button className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700" onClick={save}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

function MarketplacesPanel() {
  const [list, setList] = useState<string[]>(['tokopedia','shopee']);
  const [newName, setNewName] = useState('');
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Marketplace List</h2>
      <div className="rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input className="flex-1 rounded-lg border border-gray-200 px-3 py-2" placeholder="Nama marketplace (slug)" value={newName} onChange={(e)=>setNewName(e.target.value)} />
          <button className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700" onClick={()=>{ if(!newName.trim()) return; if(!list.includes(newName.trim())) setList([...list, newName.trim()]); setNewName(''); }}>Tambah</button>
        </div>
        <ul className="mt-3 divide-y">
          {list.map((m)=> (
            <li key={m} className="flex items-center justify-between py-2 text-sm">
              <span className="capitalize">{m}</span>
              <button className="rounded border px-2 py-1 text-red-600 hover:bg-red-50" onClick={()=>setList(list.filter(x=>x!==m))}>Hapus</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function UsersPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Users</h2>
      <div className="rounded-2xl border border-gray-200 p-4">
        <p className="text-sm text-gray-600">Mock user management (create user, toggle admin). Hook this up to D1 auth later.</p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="Email" />
          <div className="flex items-center gap-2">
            <input type="password" className="flex-1 rounded-lg border border-gray-200 px-3 py-2" placeholder="Password" />
            <button className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700">Tambah</button>
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
  const load = async () => { setLoading(true); const res = await fetch('/api/admin/categories'); setCategories(await res.json()); setLoading(false); };
  useEffect(()=>{ void load(); }, []);
  const save = async () => {
    const method = form.id ? 'PUT' : 'POST';
    await fetch('/api/admin/categories', { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ slug: '', name: '' });
    await load();
  };
  const remove = async (id: number) => { await fetch('/api/admin/categories', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) }); await load(); };
  if (loading) return <div className="text-sm text-gray-500">Memuat…</div>;
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Categories</h2>
      <div className="rounded-2xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="slug" value={form.slug} onChange={(e)=>setForm({ ...form, slug: e.target.value })} />
          <input className="rounded-lg border border-gray-200 px-3 py-2" placeholder="name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
          <div className="flex items-center gap-2">
            <button className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700" onClick={save}>{form.id? 'Update':'Add'}</button>
            {form.id && <button className="rounded border px-3 py-1.5 text-gray-700 hover:bg-gray-50" onClick={()=>setForm({ slug:'', name:'' })}>Cancel</button>}
          </div>
        </div>
        <ul className="mt-4 divide-y text-sm">
          {categories.map(c => (
            <li key={c.id} className="flex items-center justify-between py-2">
              <div><span className="text-gray-500">{c.slug}</span> — <span className="font-medium">{c.name}</span></div>
              <div className="flex items-center gap-2">
                <button className="rounded border px-2 py-1 text-gray-700 hover:bg-gray-50" onClick={()=>setForm({ id: c.id, slug: c.slug, name: c.name })}>Edit</button>
                <button className="rounded border px-2 py-1 text-red-600 hover:bg-red-50" onClick={()=>remove(c.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


