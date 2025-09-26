import express from 'express'
import cookieParser from 'cookie-parser'
import { authMiddleware } from './middleware/auth.js'
import healthHandler from './api/health.get.js'
import { productsHandlers } from './api/admin/products.js'
import { categoriesHandlers } from './api/admin/categories.js'
import { settingsHandlers } from './api/admin/settings.js'
import { statisticsHandler } from './api/admin/statistics.get.js'
import { pagesHandlers } from './api/admin/pages.js'
import { configHandlers } from './api/admin/config.js'
import { trackHandler } from './api/affiliate/track.post.js'
import { authHandlers } from './api/auth.js'

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(authMiddleware)

// Health check
app.get('/api/health', healthHandler)

// Admin API routes
app.get('/api/admin/products', productsHandlers.get)
app.post('/api/admin/products', productsHandlers.post)
app.put('/api/admin/products', productsHandlers.put)
app.delete('/api/admin/products', productsHandlers.delete)

app.get('/api/admin/categories', categoriesHandlers.get)
app.post('/api/admin/categories', categoriesHandlers.post)
app.put('/api/admin/categories', categoriesHandlers.put)
app.delete('/api/admin/categories', categoriesHandlers.delete)

app.get('/api/admin/settings', settingsHandlers.get)
app.put('/api/admin/settings', settingsHandlers.put)

app.get('/api/admin/statistics', statisticsHandler)

app.get('/api/admin/pages', pagesHandlers.get)
app.put('/api/admin/pages', pagesHandlers.put)

app.get('/api/admin/config', configHandlers.get)
app.put('/api/admin/config', configHandlers.put)

// Affiliate API
app.post('/api/affiliate/track', trackHandler)

// Auth API
app.post('/api/auth/login', authHandlers.login)
app.post('/api/auth/logout', authHandlers.logout)
app.get('/api/auth/me', authHandlers.me)

// Serve static files
app.use(express.static('dist'))
app.use(express.static('public'))

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
