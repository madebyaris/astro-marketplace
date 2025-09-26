import type { Request, Response } from 'express'
import { getDatabase } from '../../utils/db'
import { getSettings, updateSettings } from '../../../src/lib/repositories/settings'
import { getSettings as getSettingsMock, updateSettings as updateSettingsMock } from '../../../src/lib/admin-store'

export const settingsHandlers = {
  async get(req: Request, res: Response) {
    try {
      const db = await getDatabase()
      const settings = db ? await getSettings(db) : getSettingsMock()
      res.json(settings)
    } catch (error) {
      console.error('[api/admin/settings] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  async put(req: Request, res: Response) {
    try {
      const update = {
        purchasingEnabled: req.body.purchasingEnabled,
        siteTitle: typeof req.body.siteTitle === 'string' ? req.body.siteTitle : undefined,
        siteDescription: typeof req.body.siteDescription === 'string' ? req.body.siteDescription : undefined,
        primaryColor: typeof req.body.primaryColor === 'string' ? req.body.primaryColor : undefined,
        ogImage: typeof req.body.ogImage === 'string' ? req.body.ogImage : undefined,
        canonicalDomain: typeof req.body.canonicalDomain === 'string' ? req.body.canonicalDomain : undefined,
      }
      const db = await getDatabase()
      const updated = db ? await updateSettings(db, update) : updateSettingsMock(update as any)
      res.json(updated)
    } catch (error) {
      console.error('[api/admin/settings] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
