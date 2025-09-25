import type { APIRoute } from 'astro';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../../../lib/repositories/categories';
import {
  listCategories as listCategoriesMock,
  createCategory as createCategoryMock,
  updateCategory as updateCategoryMock,
  deleteCategory as deleteCategoryMock,
} from '../../../lib/admin-store';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const handleError = (error: unknown) => {
  console.error('[api/admin/categories] error', error);
  return json({ error: 'Internal Server Error' }, 500);
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    const categories = db ? await listCategories(db) : listCategoriesMock();
    return json(categories);
  } catch (error) {
    return handleError(error);
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    const slug = typeof payload?.slug === 'string' ? payload.slug.trim() : '';
    const name = typeof payload?.name === 'string' ? payload.name.trim() : '';
    if (!slug || !name) {
      return json({ error: 'Slug and name are required' }, 400);
    }
    const db = locals.runtime?.env?.DB;
    const category = db
      ? await createCategory(db, { slug, name })
      : createCategoryMock({ slug, name } as any);
    return json(category, 201);
  } catch (error) {
    return handleError(error);
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    const id = Number(payload?.id);
    if (!id) {
      return json({ error: 'Category id is required' }, 400);
    }
    const db = locals.runtime?.env?.DB;
    const update: { slug?: string; name?: string } = {};
    if (typeof payload.slug === 'string') update.slug = payload.slug.trim();
    if (typeof payload.name === 'string') update.name = payload.name.trim();
    const category = db
      ? await updateCategory(db, id, update)
      : updateCategoryMock(id, update as any);
    if (!category) {
      return json({ error: 'Category not found' }, 404);
    }
    return json(category);
  } catch (error) {
    return handleError(error);
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    const id = Number(payload?.id);
    if (!id) {
      return json({ error: 'Category id is required' }, 400);
    }
    const db = locals.runtime?.env?.DB;
    const ok = db ? await deleteCategory(db, id) : deleteCategoryMock(id);
    return json({ ok });
  } catch (error) {
    return handleError(error);
  }
};


