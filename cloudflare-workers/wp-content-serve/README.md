# WP Content Serve Worker

Cloudflare Worker that proxies requests from `activeaway.com/wp-content/uploads/*` to `files.activeaway.com/wp-content/uploads/*` to maintain WordPress URL structure while serving files from R2.

## Purpose

When migrating from WordPress to Astro, this worker preserves old WordPress media URLs for SEO:
- Old URL: `https://activeaway.com/wp-content/uploads/2024-Calendar.pdf`
- Actual storage: Cloudflare R2 bucket
- Served via: `https://files.activeaway.com/wp-content/uploads/2024-Calendar.pdf`
- Worker proxies: The request transparently

## Safety Features

- **Scope Limited**: Only handles `/wp-content/uploads/*` paths
- **Pass-Through**: All other requests are forwarded unchanged
- **No Breaking Changes**: Existing site functionality preserved
- **Error Handling**: Returns proper 404 for missing files
- **Caching**: Adds 1-year cache headers for performance

## Deployment Steps

### 1. Install Dependencies

```bash
npm install -g wrangler
```

### 2. Authenticate

```bash
wrangler login
```

### 3. Test Deployment (SAFE - Do this first!)

Edit `wrangler.toml` and uncomment the test route:

```toml
routes = [
  { pattern = "test.activeaway.com/wp-content/uploads/*", zone_name = "activeaway.com" }
]
```

Then deploy:

```bash
cd cloudflare-workers/wp-content-serve
wrangler deploy
```

Test at: `https://test.activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf`

### 4. Production Deployment (ONLY after testing)

After confirming test works:

1. Edit `wrangler.toml` and change to production route:

```toml
routes = [
  { pattern = "activeaway.com/wp-content/uploads/*", zone_name = "activeaway.com" }
]
```

2. Deploy:

```bash
wrangler deploy
```

3. Test production URL: `https://activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf`

## Testing Checklist

Before production deployment, verify:

- [ ] Test URL works: `test.activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf`
- [ ] Returns PDF with correct content-type
- [ ] 404 for non-existent files
- [ ] Main site still works: `activeaway.com/` 
- [ ] Forms still work
- [ ] Other routes unaffected

## Monitoring

View worker logs in real-time:

```bash
wrangler tail
```

Check for:
- Successful proxy requests
- 404 errors (might indicate missing files to upload)
- Any 500 errors (indicates worker issues)

## Rollback Plan

If anything breaks:

1. **Quick rollback** - Delete the route in Cloudflare dashboard:
   - Go to Cloudflare → Workers → active-away-wp-content-serve
   - Click "Routes" tab
   - Delete the route
   - Or run: `wrangler delete`

2. **Site continues working** - Worker only affects `/wp-content/uploads/*`

## Files Needed in R2

Upload WordPress PDFs to R2 with the path:
```
wp-content/uploads/filename.pdf
```

They'll be accessible at:
```
https://files.activeaway.com/wp-content/uploads/filename.pdf
```

And proxied to:
```
https://activeaway.com/wp-content/uploads/filename.pdf  (via this worker)
```

## Performance

- Files cached for 1 year (immutable)
- Served from Cloudflare edge (fast worldwide)
- No origin server load
- Zero cost (within Workers free tier)

## SEO Impact

✅ **Zero SEO loss** - URLs stay identical  
✅ **No redirects** - Direct serving (faster than 301)  
✅ **Preserves backlinks** - All external links continue working

## Support

For issues:
1. Check `wrangler tail` logs
2. Verify file exists in R2
3. Test direct R2 URL: `https://files.activeaway.com/wp-content/uploads/file.pdf`
4. Check worker route is active in Cloudflare dashboard


