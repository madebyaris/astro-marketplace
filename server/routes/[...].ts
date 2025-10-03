// Catch-all route handler
// This serves the Astro static build for client-side navigation

export default defineEventHandler((event) => {
  // Let Nitro's publicAssets handler serve the static files
  // This is just a fallback that should rarely be hit
  return null
})
