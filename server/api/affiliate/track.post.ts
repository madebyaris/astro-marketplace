import type { Request, Response } from 'express'
import { getDatabase } from '../../utils/db'

export async function trackHandler(req: Request, res: Response) {
  try {
    const { productId, marketplace, targetUrl, userAgent, referrer } = req.body
    
    if (!productId || !marketplace || !targetUrl) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const db = await getDatabase()
    
    if (db) {
      // Real implementation with database
      const timestamp = Math.floor(Date.now() / 1000)
      const ipAddress = req.ip || '127.0.0.1'
      
      // Insert click record
      await db.prepare(`
        INSERT INTO affiliate_click_logs 
        (product_id, marketplace, target_url, timestamp, user_agent, referrer, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(productId, marketplace, targetUrl, timestamp, userAgent || null, referrer || null, ipAddress).run()
      
      // Update click count
      await db.prepare(`
        UPDATE affiliate_links 
        SET click_count = click_count + 1 
        WHERE product_id = ? AND label = ?
      `).bind(productId, marketplace).run()
    }

    const clickRecord = {
      id: Math.floor(Math.random() * 10000), // Mock ID for non-DB mode
      productId,
      marketplace,
      targetUrl,
      timestamp: new Date().toISOString(),
      userAgent: userAgent || null,
      referrer: referrer || null,
      ipAddress: req.ip || '127.0.0.1'
    }

    console.log('Affiliate click tracked:', clickRecord)

    res.json({ 
      success: true, 
      clickId: clickRecord.id 
    })
  } catch (error) {
    console.error('Error tracking affiliate click:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}