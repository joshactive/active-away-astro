# WordPress PDF Migration - Test Status Report

## ✅ Completed Steps

### 1. SFTP Connection & Discovery ✅
- **Connected to:** 192.248.159.53 (WordPress server)
- **Location found:** `/public_html/wp-content/uploads/`
- **PDFs discovered:** 100+ PDF files including:
  - `2024-Calendar_compressed.pdf` (5.8 MB)
  - `0.-Airport-Sign.pdf` (26 KB)
  - Many welcome packs, brochures, and event PDFs

### 2. Test PDFs Downloaded ✅
- **Downloaded to:** `/Users/joshuathompson/active-away-astro/temp-wp-pdfs/`
- **Files:**
  - `2024-Calendar_compressed.pdf` - 5.5 MB
  - `0.-Airport-Sign.pdf` - 26 KB

### 3. Uploaded to R2 ✅
- **Upload successful** to Cloudflare R2 bucket `active-away`
- **R2 Path:** `wp-content/uploads/[filename].pdf`
- **Public URLs (WORKING):**
  - https://files.activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf ✅
  - https://files.activeaway.com/wp-content/uploads/0.-Airport-Sign.pdf ✅

### 4. Cloudflare Worker Created ✅
- **Worker name:** `active-away-wp-content-serve`
- **Location:** `cloudflare-workers/wp-content-serve/`
- **Deployed to:** https://active-away-wp-content-serve.josh-5da.workers.dev
- **Status:** Deployed, but **not yet active on activeaway.com**

## 🔄 Next Steps (Requires Your Approval)

### Option 1: Enable Worker on Production Domain (Recommended)

This makes the PDFs accessible at the original WordPress URLs:
- `https://activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf`

**How to enable:**

1. Edit `cloudflare-workers/wp-content-serve/wrangler.toml`
2. Uncomment the production route:
```toml
routes = [
  { pattern = "activeaway.com/wp-content/uploads/*", zone_name = "activeaway.com" }
]
```
3. Deploy: `cd cloudflare-workers/wp-content-serve && npx wrangler deploy`

**Safety:**
- Worker ONLY handles `/wp-content/uploads/*` paths
- All other site functionality remains unchanged
- Easy to rollback if needed

### Option 2: Use Cloudflare Page Rule (Simpler Alternative)

Instead of a worker, use a 301 redirect:

1. Go to Cloudflare Dashboard → Rules → Page Rules
2. Create rule:
   - URL: `activeaway.com/wp-content/uploads/*`
   - Setting: Forwarding URL (301 - Permanent Redirect)
   - Destination: `https://files.activeaway.com/wp-content/uploads/$1`

**Pros:**
- Simpler (no worker needed)
- Still SEO-friendly (301 redirects pass link equity)
- Can delete worker if using this

**Cons:**
- URL changes (redirect visible in browser)
- Slightly slower than direct serving

## 📊 Current Status Summary

| Component | Status | Next Action |
|-----------|--------|-------------|
| SFTP Access | ✅ Working | None needed |
| Test PDFs Downloaded | ✅ Complete | Can delete temp files |
| R2 Upload | ✅ Working | Upload remaining PDFs |
| Worker Created | ✅ Deployed | Add route to activate |
| Production URL | ⏸️ Pending | Choose Option 1 or 2 |

## 🧪 Testing Before Full Migration

Once you enable the worker (Option 1) or page rule (Option 2), test these URLs:

**Should work:**
- https://activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf
- https://activeaway.com/wp-content/uploads/0.-Airport-Sign.pdf

**Should still work (no interference):**
- https://activeaway.com/ (homepage)
- https://activeaway.com/events (events page)
- https://activeaway.com/forms/contact (forms)
- All existing functionality

## 📁 Files Created

### Worker Files
- `cloudflare-workers/wp-content-serve/src/index.js` - Worker code
- `cloudflare-workers/wp-content-serve/wrangler.toml` - Worker config
- `cloudflare-workers/wp-content-serve/README.md` - Documentation

### Temporary Files (Can be deleted after migration)
- `temp-wp-pdfs/` - Downloaded test PDFs
- `temp-*.exp` - SFTP connection scripts
- `temp-*.js` - Upload scripts
- `temp-*.txt` - SFTP output logs

## 🚀 Full Migration Steps (After Testing)

Once the test works:

1. **Download all PDFs from WordPress:**
   ```bash
   # Create script to recursively download all PDFs
   # Maintain folder structure
   ```

2. **Upload all PDFs to R2:**
   ```bash
   # Use the temp-upload-to-r2.js script as template
   # Upload with wp-content/uploads/ prefix
   ```

3. **Monitor 404s:**
   - Use the 404 tracking system you have
   - Download any PDFs that get requested but weren't migrated

## 🔒 Safety Guarantees

- ✅ Existing r2-upload worker untouched
- ✅ Existing API routes untouched  
- ✅ Worker scoped to `/wp-content/uploads/*` only
- ✅ Test PDFs confirmed working in R2
- ✅ Easy rollback (delete worker route)

## ⚠️ Important Notes

1. **Don't delete WordPress yet** - Keep as backup until confirmed working
2. **Worker deployment is safe** - Only affects one URL pattern
3. **R2 URLs work now** - Can use files.activeaway.com URLs immediately
4. **Full migration can wait** - Test with 2 PDFs first, then migrate rest

## 📞 Questions?

Let me know:
1. Do you want to enable the worker (Option 1) or use a page rule (Option 2)?
2. Should I proceed with downloading and uploading all PDFs?
3. Any specific PDFs that are highest priority?

---

**Ready to proceed when you are!** The infrastructure is in place and tested. ✅


