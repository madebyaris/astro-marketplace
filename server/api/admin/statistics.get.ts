import { createDatabase } from '../../lib/database/adapter'
import { queryAll, queryFirst } from '../../lib/database/helpers'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const range = (query.range as string) || '30d'
    
    const db = createDatabase()
    
    const today = Math.floor(Date.now() / 1000)
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
    const startTimestamp = today - days * 24 * 60 * 60

    // Get totals
    const totals = await queryFirst<{
      total_clicks: number
      today_clicks: number
      week_clicks: number
      month_clicks: number
    }>(db, `
      SELECT
        COUNT(*) AS total_clicks,
        SUM(CASE WHEN timestamp >= strftime('%s','now','-1 day') THEN 1 ELSE 0 END) AS today_clicks,
        SUM(CASE WHEN timestamp >= strftime('%s','now','-7 day') THEN 1 ELSE 0 END) AS week_clicks,
        SUM(CASE WHEN timestamp >= strftime('%s','now','-30 day') THEN 1 ELSE 0 END) AS month_clicks
      FROM affiliate_click_logs
    `)

    // Get top products
    const topProductsResult = await queryAll<{
      id: number
      title: string
      slug: string
      click_count: number
    }>(db, `
      SELECT
        p.id,
        p.title,
        p.slug,
        COUNT(l.id) AS click_count
      FROM products p
      JOIN affiliate_click_logs l ON l.product_id = p.id
      WHERE l.timestamp >= ?
      GROUP BY p.id
      ORDER BY click_count DESC
      LIMIT 5
    `, [startTimestamp])

    const topProducts = await Promise.all(
      topProductsResult.rows.map(async (row) => {
        const marketplacesResult = await queryAll<{
          marketplace: string
          clicks: number
        }>(db, `
          SELECT marketplace, COUNT(*) AS clicks
          FROM affiliate_click_logs
          WHERE product_id = ? AND timestamp >= ?
          GROUP BY marketplace
        `, [row.id, startTimestamp])

        const marketplaces = marketplacesResult.rows.map(m => ({
          label: m.marketplace,
          clicks: m.clicks,
          targetUrl: '',
        }))

        return {
          id: row.id,
          title: row.title,
          slug: row.slug,
          totalClicks: row.click_count,
          clicksToday: 0,
          marketplaces,
        }
      })
    )

    // Get click history
    const historyResult = await queryAll<{
      day: string
      clicks: number
    }>(db, `
      SELECT date(timestamp, 'unixepoch') AS day, COUNT(*) AS clicks
      FROM affiliate_click_logs
      WHERE timestamp >= ?
      GROUP BY day
      ORDER BY day ASC
    `, [startTimestamp])

    const clickHistory = historyResult.rows.map(row => ({
      date: row.day,
      clicks: row.clicks,
    }))

    // Get marketplace stats
    const marketplaceResult = await queryAll<{
      marketplace: string
      clicks: number
    }>(db, `
      SELECT marketplace, COUNT(*) AS clicks
      FROM affiliate_click_logs
      WHERE timestamp >= ?
      GROUP BY marketplace
      ORDER BY clicks DESC
    `, [startTimestamp])

    const totalMarketplaceClicks = marketplaceResult.rows.reduce(
      (acc, row) => acc + row.clicks,
      0
    )

    const marketplaceStats = marketplaceResult.rows.map(row => ({
      marketplace: row.marketplace,
      clicks: row.clicks,
      percentage: totalMarketplaceClicks
        ? Number(((row.clicks / totalMarketplaceClicks) * 100).toFixed(1))
        : 0,
    }))

    return {
      range,
      totalClicks: totals?.total_clicks ?? 0,
      todayClicks: totals?.today_clicks ?? 0,
      weekClicks: totals?.week_clicks ?? 0,
      monthClicks: totals?.month_clicks ?? 0,
      topProducts,
      clickHistory,
      marketplaceStats,
    }
  } catch (error) {
    console.error('[api/admin/statistics] error', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
