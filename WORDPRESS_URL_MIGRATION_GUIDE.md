# WordPress URL Migration Guide

## Problem

Your old WordPress site has URLs like:
- `https://activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf`
- `https://activeaway.com/wp-content/uploads/images/photo.jpg`

These URLs are linked across the web (emails, social media, other websites, Google Search results). Breaking them will:
- ❌ Create 404 errors
- ❌ Lose SEO value from backlinks
- ❌ Frustrate users with broken links
- ❌ Hurt search rankings

## Solution: Multiple Approaches

---

## ✅ **RECOMMENDED: Cloudflare Workers Proxy** (Best for Files)

This keeps your old URLs working by proxying requests to your old WordPress media library or Cloudflare Images.

### **How it Works:**
1. User requests `/wp-content/uploads/2024-Calendar_compressed.pdf`
2. Cloudflare Worker intercepts the request
3. Worker fetches the file from your WordPress backup or R2 storage
4. Returns the file to the user
5. URL stays exactly the same!

### **Setup Steps:**

#### **Option A: Proxy to Old WordPress (Temporary)**

If your old WordPress site is still running (even on a subdomain):

1. Create file: `functions/wp-content-proxy.js`

```javascript
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Check if it's a wp-content URL
  if (url.pathname.startsWith('/wp-content/')) {
    // Proxy to old WordPress site
    const wpUrl = `https://old.activeaway.com${url.pathname}`;
    
    try {
      const response = await fetch(wpUrl);
      
      // Return the file with original headers
      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    } catch (error) {
      // If old site doesn't have it, return 404
      return new Response('File not found', { status: 404 });
    }
  }
  
  // Not a wp-content URL, continue normally
  return context.next();
}
```

#### **Option B: Serve from Cloudflare R2 Storage** (Long-term)

1. **Upload WordPress media to R2:**
   - Download your entire `/wp-content/uploads/` folder from WordPress
   - Upload to Cloudflare R2 bucket
   - Maintain the exact same folder structure

2. **Create Worker to serve from R2:**

```javascript
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Check if it's a wp-content URL
  if (url.pathname.startsWith('/wp-content/uploads/')) {
    const R2 = context.env.WP_CONTENT_BUCKET;
    
    // Remove /wp-content/uploads/ prefix to get the R2 key
    const key = url.pathname.replace('/wp-content/uploads/', '');
    
    try {
      const object = await R2.get(key);
      
      if (object === null) {
        return new Response('File not found', { status: 404 });
      }
      
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      
      return new Response(object.body, {
        headers
      });
    } catch (error) {
      return new Response('Error fetching file', { status: 500 });
    }
  }
  
  return context.next();
}
```

3. **Bind R2 bucket in wrangler.toml:**

```toml
[[r2_buckets]]
binding = "WP_CONTENT_BUCKET"
bucket_name = "wp-content-uploads"
```

---

## ✅ **Alternative: Cloudflare Page Rules** (Simple Redirects)

If you want to redirect `/wp-content/` URLs to new locations instead of proxying:

### **Setup:**

1. Go to Cloudflare Dashboard
2. Navigate to **Rules** → **Page Rules**
3. Create rule:
   - **URL:** `activeaway.com/wp-content/uploads/*`
   - **Setting:** Forwarding URL
   - **Status Code:** 301 (Permanent Redirect)
   - **Destination URL:** `https://activeaway.com/downloads/$1`

**Example:**
- Old: `/wp-content/uploads/2024-Calendar_compressed.pdf`
- New: `/downloads/2024-Calendar_compressed.pdf`

Then move your files to `public/downloads/` folder.

**Pros:**
- ✅ Simple to set up
- ✅ Preserves SEO (301 redirects pass link juice)
- ✅ Clean new URLs

**Cons:**
- ❌ URLs change (some links may not update)
- ❌ Requires moving all files

---

## ✅ **Alternative: Strapi Redirects** (Individual URLs)

For specific important URLs that you know are linked widely:

1. Go to Strapi → **Redirects** (create this content type if you don't have it)
2. Add redirects manually:

| Source Path | Destination Path | Status Code |
|------------|------------------|-------------|
| `/wp-content/uploads/2024-Calendar_compressed.pdf` | `/downloads/2024-calendar.pdf` | 301 |
| `/wp-content/uploads/Tennis-Brochure.pdf` | `/downloads/tennis-brochure.pdf` | 301 |

**Pros:**
- ✅ Uses your existing redirect system
- ✅ Trackable in Strapi
- ✅ Easy to manage

**Cons:**
- ❌ Manual entry for each URL
- ❌ Not scalable for hundreds of files

---

## ✅ **Quick Fix: Copy Important Files to Public Folder**

For a small number of critical files:

1. Create folder: `public/wp-content/uploads/`
2. Copy important files maintaining the exact structure:

```
public/
  wp-content/
    uploads/
      2024-Calendar_compressed.pdf
      Tennis-Brochure.pdf
      images/
        hero.jpg
```

3. These files will be accessible at the exact same URLs!

**Pros:**
- ✅ Instant - no redirect needed
- ✅ URLs stay exactly the same
- ✅ Zero configuration

**Cons:**
- ❌ Clutters your public folder
- ❌ Duplicates files if also stored elsewhere
- ❌ Not scalable for large media libraries

---

## 📊 **Recommended Strategy**

### **For Most Sites:**

1. **Short Term (Launch):**
   - Copy critical PDFs/files to `public/wp-content/uploads/`
   - This keeps important links working immediately

2. **Medium Term (First Month):**
   - Set up Cloudflare R2 bucket with all WordPress media
   - Deploy Worker to proxy requests
   - Remove files from public folder

3. **Long Term:**
   - Audit what's actually being requested (404 tracking!)
   - Keep frequently accessed files in R2
   - Delete unused files
   - Consider migrating important docs to new URLs with 301 redirects

### **For Your Calendar PDF Specifically:**

**Option 1 - Keep Same URL (Recommended):**
```bash
mkdir -p public/wp-content/uploads
cp /path/to/2024-Calendar_compressed.pdf public/wp-content/uploads/
```

URL stays: `https://activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf`

**Option 2 - New URL with Redirect:**
```bash
cp /path/to/2024-Calendar_compressed.pdf public/downloads/2024-calendar.pdf
```

Then add Cloudflare Page Rule:
- From: `/wp-content/uploads/2024-Calendar_compressed.pdf`
- To: `/downloads/2024-calendar.pdf` (301)

---

## 🔍 **Finding All WordPress URLs**

### **Check What's Actually Linked:**

1. **Google Search Console:**
   - Go to **Links** section
   - See which pages are getting backlinks
   - Identify any `/wp-content/` URLs

2. **Google Site Search:**
   - Search: `site:activeaway.com/wp-content/`
   - See what Google has indexed

3. **Screaming Frog SEO Spider:**
   - Crawl your old WordPress site
   - Export all `/wp-content/uploads/` URLs

4. **WordPress Database:**
   ```sql
   SELECT DISTINCT meta_value 
   FROM wp_postmeta 
   WHERE meta_value LIKE '%wp-content/uploads%';
   ```

---

## 📈 **SEO Best Practices**

1. **Use 301 Redirects (Permanent)** - Not 302 (Temporary)
   - 301 passes ~90-99% of link equity
   - Tells search engines the move is permanent

2. **Update Internal Links**
   - Don't rely on redirects for internal links
   - Update your own content to use new URLs

3. **Submit Updated Sitemap**
   - After setting up redirects, submit updated sitemap to Google
   - This helps Google discover new URLs faster

4. **Monitor 404 Errors**
   - Use your new 404 tracking system!
   - See which old URLs are still being requested
   - Add redirects for high-traffic 404s

5. **Keep Redirects Permanent**
   - Don't remove redirects after a few months
   - Keep them indefinitely (disk space is cheap)

---

## 🚨 **Common Mistakes to Avoid**

1. ❌ **Deleting old WordPress without backup**
   - Keep a backup of `/wp-content/uploads/` forever
   
2. ❌ **Using JavaScript redirects**
   - Search engines don't follow these well
   - Use server-side 301 redirects

3. ❌ **Forgetting about emails**
   - Old marketing emails may have links
   - Can't update these retroactively

4. ❌ **Not testing redirects**
   - Test each important URL before launch
   - Check that redirects work correctly

---

## ✅ **Pre-Launch Checklist**

- [ ] Audit Google Search Console for backlinks to `/wp-content/`
- [ ] Download complete WordPress media library backup
- [ ] Identify top 20 most important files
- [ ] Choose strategy (proxy, redirect, or copy files)
- [ ] Implement chosen strategy
- [ ] Test 5-10 old URLs to verify they work
- [ ] Set up 404 tracking (already done!)
- [ ] Monitor 404s for first week after launch
- [ ] Add redirects for any missed URLs

---

## 🎯 **Quick Start for Your Calendar PDF**

Since you mentioned the calendar PDF specifically, here's the fastest solution:

```bash
# Create the directory structure
cd /Users/joshuathompson/active-away-astro
mkdir -p public/wp-content/uploads

# Copy your calendar PDF (update path to actual file location)
cp /path/to/2024-Calendar_compressed.pdf public/wp-content/uploads/

# Done! The URL will work at:
# https://activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf
```

No redirects needed, URL stays exactly the same, SEO preserved!

---

## 📞 **Need Help?**

If you need help:
1. Finding all WordPress URLs
2. Setting up R2 storage
3. Creating Cloudflare Workers
4. Bulk redirects

Let me know which approach you want to take and I can help implement it!

---

## Summary

**For maintaining `/wp-content/uploads/` URLs:**

✅ **Best for 1-10 files:** Copy to `public/wp-content/uploads/`  
✅ **Best for 10-100 files:** Cloudflare Page Rules + move to `/downloads/`  
✅ **Best for 100+ files:** Cloudflare R2 + Worker proxy  
✅ **Best for known important URLs:** Strapi redirects

**All approaches preserve SEO and prevent broken links!**



