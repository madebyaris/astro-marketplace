# Affiliate Statistics Feature

This document explains the new affiliate statistics feature that tracks and displays affiliate link performance.

## Features

### 📊 **Statistics Dashboard**
- **Location**: Admin Panel → Statistics
- **Overview Cards**: Total clicks, today's clicks, week clicks, month clicks
- **Click History Chart**: Daily affiliate link clicks over time
- **Marketplace Distribution**: Percentage breakdown by marketplace
- **Top Products**: Products with most affiliate clicks
- **Time Range Filter**: 7 days, 30 days, or 90 days

### 🔗 **Automatic Click Tracking**
- All affiliate links are automatically tracked when clicked
- Records timestamp, marketplace, product, user agent, and referrer
- No impact on user experience - tracking happens in background
- Redirects work even if tracking fails

### 📈 **Analytics Data**
- **Click Count**: Total number of clicks per affiliate link
- **Time Tracking**: Precise timestamps for trend analysis
- **Marketplace Performance**: Compare different marketplace platforms
- **Product Performance**: See which products generate most clicks
- **User Data**: Anonymous user agent and referrer tracking

## Usage

### For Admins

1. **View Statistics**:
   - Navigate to Admin Panel
   - Click "Statistics" in the sidebar
   - Select desired time range (7d/30d/90d)

2. **Analyze Performance**:
   - Check overview cards for quick metrics
   - Review click history chart for trends
   - Compare marketplace distribution
   - Identify top-performing products

### For Developers

1. **Database Setup**:
   ```bash
   # Run the new migration
   npm run db:migrate:local
   ```

2. **Using AffiliateButton Component**:
   ```tsx
   import AffiliateButton from '../components/AffiliateButton';
   
   <AffiliateButton
     productId={1}
     marketplace="Tokopedia"
     targetUrl="https://tokopedia.com/product"
     variant="marketplace"
   />
   ```

3. **Manual Tracking**:
   ```typescript
   import { trackAffiliateClick } from '../lib/affiliate-tracker';
   
   await trackAffiliateClick({
     productId: 1,
     marketplace: 'Shopee',
     targetUrl: 'https://shopee.co.id/product'
   });
   ```

## Database Schema

### affiliate_click_logs
```sql
CREATE TABLE affiliate_click_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  marketplace TEXT NOT NULL,
  target_url TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  session_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## API Endpoints

### Get Statistics
```
GET /api/admin/statistics?range=30d
```
Returns affiliate click statistics for the specified time range.

### Track Click
```
POST /api/affiliate/track
Content-Type: application/json

{
  "productId": 1,
  "marketplace": "Tokopedia",
  "targetUrl": "https://tokopedia.com/product",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://example.com"
}
```
Records an affiliate link click with metadata.

## Components

### AffiliateButton
Renders a marketplace-specific button that tracks clicks and redirects to the target URL.

**Props**:
- `productId`: Product ID for tracking
- `marketplace`: Marketplace name (e.g., "Tokopedia")
- `targetUrl`: Destination URL
- `label`: Optional custom label
- `variant`: Button style ("primary", "secondary", "marketplace")
- `className`: Additional CSS classes

### StatisticsPanel
Admin dashboard component that displays comprehensive affiliate statistics with charts and tables.

## Future Enhancements

- **Real-time Updates**: WebSocket or polling for live statistics
- **Conversion Tracking**: Track if clicks lead to actual purchases
- **A/B Testing**: Test different button styles and placements
- **Geographic Analytics**: Track clicks by location
- **Revenue Tracking**: Connect with affiliate program APIs
- **Export Data**: CSV/Excel export for external analysis

## Privacy & Performance

- **Privacy**: No personal data is stored, only anonymous analytics
- **Performance**: Tracking is asynchronous and doesn't slow down redirects
- **Reliability**: Redirects work even if tracking fails
- **GDPR Compliant**: Only collects necessary technical data

## Troubleshooting

### Statistics Not Loading
1. Check if the database migration ran successfully
2. Verify API endpoints are accessible
3. Check browser console for JavaScript errors

### Clicks Not Being Tracked
1. Ensure AffiliateButton component is used correctly
2. Check network tab for failed API requests
3. Verify database permissions and table existence

### Performance Issues
1. Consider adding database indexes for large datasets
2. Implement data archiving for old click logs
3. Use caching for frequently accessed statistics

