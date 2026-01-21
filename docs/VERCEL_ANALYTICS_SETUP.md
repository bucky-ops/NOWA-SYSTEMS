# Vercel Web Analytics Implementation Guide for NOWA

This guide shows how to implement Vercel Web Analytics in the NOWA project, building on top of the existing custom analytics system.

## Quick Start

### 1. Enable Analytics on Vercel Dashboard

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your NOWA project
3. Click the **Analytics** tab
4. Click **Enable** from the dialog

> This adds new routes at `/_vercel/insights/*` after your next deployment.

### 2. Install the Package

The `@vercel/analytics` package is already included in your project dependencies. If you need to reinstall it:

```bash
pnpm i @vercel/analytics
```

Or with your preferred package manager:
```bash
npm i @vercel/analytics
# or
yarn i @vercel/analytics
# or
bun i @vercel/analytics
```

### 3. Integration with NOWA

Since NOWA is a static HTML site with custom JavaScript, use the plain HTML implementation:

Add this to your `index.html` file in the `<head>` section:

```html
<!-- Vercel Web Analytics -->
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

**Example placement in index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NOWA - Digital Credits System</title>
    
    <!-- Other meta tags, stylesheets, etc. -->
    
    <!-- Vercel Web Analytics -->
    <script>
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### 4. Track Custom Events (Optional)

To track custom events in addition to automatic page views, use the Vercel Web Analytics API:

```javascript
// Track a custom event
window.va('event', {
    name: 'Button Click',
    data: {
        button_type: 'cta',
        section: 'hero'
    }
});

// Example: Track form submission
document.getElementById('contact-form').addEventListener('submit', function() {
    window.va('event', {
        name: 'Form Submission',
        data: {
            form_name: 'contact',
            timestamp: new Date().toISOString()
        }
    });
});
```

### 5. Integration with Existing Analytics

Your NOWA project already has a custom analytics system in `assets/js/analytics.js`. Vercel Web Analytics will work alongside it:

- **Vercel Web Analytics**: Automatic page views, route tracking, performance metrics
- **NOWA Analytics**: Custom events, detailed user journey tracking, error tracking

Both systems can run independently and provide complementary insights.

## Deployment

Deploy your changes to Vercel:

```bash
vercel deploy
```

Or push to your connected Git repository:

```bash
git add .
git commit -m "Add Vercel Web Analytics integration"
git push origin main
```

## Verification

After deployment, verify that Web Analytics is working:

1. Visit your deployed site at `https://your-app.vercel.app`
2. Open Developer Tools (F12)
3. Go to the **Network** tab
4. Look for XHR requests to `/_vercel/insights/view`
5. You should see successful requests when you visit pages

**Expected Response:**
```
Status: 200
Content-Type: image/gif
```

## Dashboard Insights

Once deployed and users start visiting:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your NOWA project
3. Click the **Analytics** tab

You'll be able to see:
- **Page Views**: Most visited pages
- **Visitors**: Total and unique visitors
- **Top Referrers**: Where traffic comes from
- **Core Web Vitals**: Performance metrics
- **Real-time Data**: Live visitor activity (after a few minutes of data collection)

## Advanced Configuration

### Custom Events for Paid/Pro Plans

If you have a Pro or Enterprise Vercel plan, you can add custom events:

```javascript
// Example: Track important user actions
window.va('event', {
    name: 'Feature Used',
    data: {
        feature: 'credit_check',
        user_type: 'merchant'
    }
});

// Track conversions
window.va('event', {
    name: 'Conversion',
    data: {
        conversion_type: 'signup',
        value: 100
    }
});
```

### Debugging

To debug analytics in development, add this to your console:

```javascript
// Check if Vercel Analytics is loaded
console.log(window.va);

// View queued events
console.log(window.vaq);
```

## Privacy and Compliance

Vercel Web Analytics is GDPR, CCPA, and other privacy regulation compliant by default:
- No cookies are used
- No personal data is collected
- All data is anonymous
- Data is stored in the EU by default

For more information, see [Vercel Privacy Policy](https://vercel.com/legal/privacy-policy).

## Troubleshooting

### Analytics not showing data

1. **Check if enabled**: Ensure Analytics is enabled in your Vercel dashboard
2. **Check deployment**: Wait a few minutes after deployment before checking
3. **Check domain**: Make sure you're viewing the deployed URL (not localhost)
4. **Check network**: Look for `/_vercel/insights/view` requests in the Network tab
5. **Check CSP**: Verify your Content Security Policy doesn't block analytics

### Data not appearing in dashboard

- First visit takes a few minutes to appear
- Dashboard data updates every few minutes
- Pro/Enterprise plans get real-time updates

### Integration conflicts with custom analytics

The systems run independently and won't conflict. You can disable one if needed:

```javascript
// Disable Vercel Analytics if needed
window.va = function() {}; // no-op function
```

## Next Steps

- [Learn more about Vercel Analytics features](https://vercel.com/docs/analytics)
- [Set up custom events](https://vercel.com/docs/analytics/custom-events)
- [Learn about filtering data](https://vercel.com/docs/analytics/filtering)
- [Explore performance optimization](https://vercel.com/docs/analytics/web-vitals)

---

For questions or issues, contact the NOWA team or refer to the [main Vercel Analytics guide](./VERCEL_ANALYTICS.md).
