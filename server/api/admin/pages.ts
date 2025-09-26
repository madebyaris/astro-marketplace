import type { Request, Response } from 'express'
import { getDatabase } from '../../utils/db'
import { getPages, updatePages } from '../../../src/lib/repositories/pages'
import { getPages as getPagesMock, updatePages as updatePagesMock } from '../../../src/lib/admin-store'

export const pagesHandlers = {
  async get(req: Request, res: Response) {
    try {
      const db = await getDatabase()
      const pages = db ? await getPages(db) : getPagesMock()
      res.json(pages)
    } catch (error) {
      console.error('[api/admin/pages] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  async put(req: Request, res: Response) {
    try {
      const update = {
        aboutHtml: typeof req.body.aboutHtml === 'string' ? req.body.aboutHtml : undefined,
        privacyHtml: typeof req.body.privacyHtml === 'string' ? req.body.privacyHtml : undefined,
        policyHtml: typeof req.body.policyHtml === 'string' ? req.body.policyHtml : undefined,
        heroTitle: typeof req.body.heroTitle === 'string' ? req.body.heroTitle : undefined,
        heroSubtitle: typeof req.body.heroSubtitle === 'string' ? req.body.heroSubtitle : undefined,
      }
      const db = await getDatabase()
      const updated = db ? await updatePages(db, update) : updatePagesMock(update as any)
      res.json(updated)
    } catch (error) {
      console.error('[api/admin/pages] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
