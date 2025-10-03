import { createDatabase } from '../../lib/database/adapter'
import { execute } from '../../lib/database/helpers'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { productId, marketplace, targetUrl, userAgent, referrer } = body
    
    if (!productId || !marketplace || !targetUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    const db = createDatabase()
    const timestamp = Math.floor(Date.now() / 1000)
    const ipAddress = getHeader(event, 'x-forwarded-for') || 
                      getHeader(event, 'x-real-ip') || 
                      '127.0.0.1'
    
    // Insert click record into affiliate_click_logs
    await execute(db, `
      INSERT INTO affiliate_click_logs 
      (product_id, marketplace, target_url, timestamp, user_agent, referrer, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [productId, marketplace, targetUrl, timestamp, userAgent || null, referrer || null, ipAddress])
    
    // Update click count in affiliate_links
    await execute(db, `
      UPDATE affiliate_links 
      SET click_count = click_count + 1 
      WHERE product_id = ? AND label = ?
    `, [productId, marketplace])

    return {
      success: true,
      timestamp
    }
  } catch (error) {
    console.error('Error tracking affiliate click:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
