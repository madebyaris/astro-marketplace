export default defineEventHandler(async (event) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: process.env.NODE_ENV || 'development'
  }
})
