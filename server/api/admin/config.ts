import type { Request, Response } from 'express'
import { getDatabase } from '../../utils/db'
import { getIntegrationSettings, updateIntegrationSettings } from '../../../src/lib/repositories/integrations'
import { getConfig as getConfigMock, updateConfig as updateConfigMock } from '../../../src/lib/admin-store'

export const configHandlers = {
  async get(req: Request, res: Response) {
    try {
      const db = await getDatabase()
      const config = db ? await getIntegrationSettings(db) : getConfigMock()
      res.json(config)
    } catch (error) {
      console.error('[api/admin/config] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  async put(req: Request, res: Response) {
    try {
      const db = await getDatabase()
      const updated = db
        ? await updateIntegrationSettings(db, {
            smtp: req.body.smtp,
            s3: req.body.s3,
          })
        : updateConfigMock(req.body)
      res.json(updated)
    } catch (error) {
      console.error('[api/admin/config] error', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
