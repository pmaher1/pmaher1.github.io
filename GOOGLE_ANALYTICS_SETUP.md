# Google Analytics 4 Setup Guide

This website already has Google Analytics 4 (GA4) support built into the Jekyll theme. Follow these steps to enable it:

## Step 1: Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in the bottom left)
3. Click **Create Property**
4. Fill in your property details:
   - Property name: "pmaher1.github.io" (or your preferred name)
   - Reporting time zone: Select your timezone
   - Currency: Select your currency
5. Click **Next**
6. Fill in business details (select appropriate options for an academic website)
7. Click **Create**

## Step 2: Add a Data Stream

1. After creating the property, you'll be prompted to set up a data stream
2. Click **Web**
3. Enter your website URL: `https://pmaher1.github.io`
4. Enter a stream name: "Main Website" (or your preference)
5. Click **Create stream**

## Step 3: Get Your Measurement ID

1. After creating the stream, you'll see your **Measurement ID** (format: `G-XXXXXXXXXX`)
2. **Copy this Measurement ID** - you'll need it in the next step

## Step 4: Enable GA4 in Your Website

1. Open `_config.yml` in your website folder
2. Find these two lines (around line 78 and 374):
   ```yaml
   google_analytics: # your Google Analytics measurement ID (format: G-XXXXXXXXXX)
   ```
   and
   ```yaml
   enable_google_analytics: false # enables google analytics
   ```

3. Update them to:
   ```yaml
   google_analytics: G-XXXXXXXXXX # Replace with YOUR actual Measurement ID
   ```
   and
   ```yaml
   enable_google_analytics: true # enables google analytics
   ```

4. Save the file

## Step 5: Deploy and Verify

1. Commit and push your changes to GitHub:
   ```bash
   git add _config.yml
   git commit -m "Enable Google Analytics 4"
   git push
   ```

2. Wait a few minutes for GitHub Pages to rebuild your site

3. Visit your website in a browser

4. Go back to Google Analytics → **Reports** → **Realtime**
   - You should see your own visit appear within seconds/minutes
   - If you see activity, it's working! 🎉

## What You Can Track (Academic Site Recommendations)

Once set up, GA4 will automatically track:

### Default Metrics
- **Page views**: Which pages are most popular
- **Sessions**: How many visits your site gets
- **Users**: Unique visitors
- **Engagement time**: How long people stay
- **Traffic sources**: Where visitors come from (Google, Google Scholar, Twitter, direct, etc.)
- **Geographic data**: Countries and cities of your visitors
- **Devices**: Desktop vs mobile, browsers, screen sizes

### Custom Tracking (Optional - Advanced)

You can add custom event tracking for:
- **PDF downloads**: Track when people download your papers
- **Outbound links**: See when people click links to journals, GitHub, etc.
- **Contact clicks**: Track email or social media link clicks
- **Video plays**: If you have embedded videos

To add custom tracking, you would need to modify the `_includes/scripts.liquid` file to add gtag event tracking. Example:

```javascript
// Track PDF downloads
document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
  link.addEventListener('click', function(e) {
    gtag('event', 'file_download', {
      'file_name': this.href
    });
  });
});
```

## Privacy Considerations

- GA4 is more privacy-focused than Universal Analytics
- It uses cookieless tracking options
- Consider adding a privacy policy page mentioning analytics
- You can anonymize IP addresses (GA4 does this by default)

## Troubleshooting

**Not seeing data?**
- Check that `enable_google_analytics: true` is set
- Verify your Measurement ID is correct (format: `G-XXXXXXXXXX`)
- Clear your browser cache and visit the site again
- Check the browser console for errors (F12 → Console tab)
- Make sure the site has been rebuilt and deployed

**AdBlockers**
- Ad blockers may prevent GA4 from loading
- This is expected behavior - test in a private/incognito window without extensions

## Support

- [Google Analytics Help Center](https://support.google.com/analytics)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
