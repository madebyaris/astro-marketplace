import type { Request, Response } from 'express'
import { getDatabase } from '../../utils/db'

export async function statisticsHandler(req: Request, res: Response) {
  try {
    const range = req.query.range as string || '30d'
    const db = await getDatabase()
    
    if (!db) {
      return res.json({
        range,
        totalClicks: 0,
        todayClicks: 0,
        weekClicks: 0,
        monthClicks: 0,
        topProducts: [],
        clickHistory: [],
        marketplaceStats: [],
      })
    }

    const today = Math.floor(Date.now() / 1000)
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
    const startTimestamp = today - days * 24 * 60 * 60

    const totalsStmt = await db.prepare(`
      SELECT
        COUNT(*) AS total_clicks,
        SUM(CASE WHEN timestamp >= strftime('%s','now','-1 day') THEN 1 ELSE 0 END) AS today_clicks,
        SUM(CASE WHEN timestamp >= strftime('%s','now','-7 day') THEN 1 ELSE 0 END) AS week_clicks,
        SUM(CASE WHEN timestamp >= strftime('%s','now','-30 day') THEN 1 ELSE 0 END) AS month_clicks
      FROM affiliate_click_logs
    `).all()

    const totalsRow = totalsStmt.results?.[0] ?? {
      total_clicks: 0,
      today_clicks: 0,
      week_clicks: 0,
      month_clicks: 0,
    }

    const topProductsStmt = await db.prepare(`
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
    `).bind(startTimestamp).all()

    const topProducts = await Promise.all(
      (topProductsStmt.results ?? []).map(async (row: any) => {
        const marketplacesStmt = await db.prepare(`
          SELECT marketplace, COUNT(*) AS clicks
          FROM affiliate_click_logs
          WHERE product_id = ? AND timestamp >= ?
          GROUP BY marketplace
        `).bind(row.id, startTimestamp).all()

        const marketplaces = (marketplacesStmt.results ?? []).map((m: any) => ({
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

    const historyStmt = await db.prepare(`
      SELECT date(timestamp, 'unixepoch') AS day, COUNT(*) AS clicks
      FROM affiliate_click_logs
      WHERE timestamp >= ?
      GROUP BY day
      ORDER BY day ASC
    `).bind(startTimestamp).all()

    const clickHistory = (historyStmt.results ?? []).map((row: any) => ({
      date: row.day,
      clicks: row.clicks,
    }))

    const marketplaceStmt = await db.prepare(`
      SELECT marketplace, COUNT(*) AS clicks
      FROM affiliate_click_logs
      WHERE timestamp >= ?
      GROUP BY marketplace
      ORDER BY clicks DESC
    `).bind(startTimestamp).all()

    const totalMarketplaceClicks = (marketplaceStmt.results ?? []).reduce(
      (acc: number, row: any) => acc + row.clicks,
      0
    )

    const marketplaceStats = (marketplaceStmt.results ?? []).map((row: any) => ({
      marketplace: row.marketplace,
      clicks: row.clicks,
      percentage: totalMarketplaceClicks
        ? Number(((row.clicks / totalMarketplaceClicks) * 100).toFixed(1))
        : 0,
    }))

    res.json({
      range,
      totalClicks: totalsRow.total_clicks ?? 0,
      todayClicks: totalsRow.today_clicks ?? 0,
      weekClicks: totalsRow.week_clicks ?? 0,
      monthClicks: totalsRow.month_clicks ?? 0,
      topProducts,
      clickHistory,
      marketplaceStats,
    })
  } catch (error) {
    console.error('[api/admin/statistics] error', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}