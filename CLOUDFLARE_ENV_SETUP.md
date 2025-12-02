# Cloudflare Pages Environment Variables Setup

Your API calls to Instagram and Google Reviews aren't working on Cloudflare Pages because the environment variables aren't configured in the deployment environment.

---

## 🔑 Required Environment Variables

### **1. Google Reviews API**
```
GOOGLE_PLACES_API_KEY=your_google_api_key_here
GOOGLE_PLACE_ID=ChIJ6aLvHHgPdkgR1oHhIDyNQtU
```

**Required for:** `/api/google-reviews.json`
- Fetches Google reviews from your Google Business Profile
- Without this, the Stories of Hope section won't show real reviews

### **2. Instagram API**
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

**Required for:** Instagram section
- Connects to PostgreSQL database to fetch Instagram access token
- Without this, Instagram posts won't display
- The token is stored in the database and updated via Make.com automation

### **3. Newsletter & Logging (Optional but Recommended)**
```
NEWSLETTER_WEBHOOK_URL=your_webhook_url_here
LOGGING_WEBHOOK_URL=https://hook.eu1.make.com/eda84uk3f57l499so98ao76feec0j7dz
TURNSTILE_SECRET_KEY=your_turnstile_secret_here
PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
```

**Required for:** 
- Newsletter signup form in footer (`NEWSLETTER_WEBHOOK_URL`)
- 404 Error Logging (`LOGGING_WEBHOOK_URL`) - **NEW**
- Cloudflare Turnstile verification (`TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY`)

### **4. Strapi CMS**
```
STRAPI_URL=https://your-strapi-instance.com
STRAPI_TOKEN=your_strapi_api_token_here
```

**Required for:** Dynamic content from Strapi CMS
- All page content, images, and data come from Strapi
- Without this, fallback content will be used

---

## 📝 How to Add Environment Variables to Cloudflare Pages

### **Step 1: Navigate to Cloudflare Pages Dashboard**

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** in the left sidebar
3. Select your **active-away-astro** project

### **Step 2: Access Environment Variables**

1. Click on **Settings** tab
2. Scroll down to **Environment Variables** section
3. Click **Add variable** or **Edit variables**

### **Step 3: Add Each Variable**

For each environment variable:

1. **Variable name:** Enter the exact name (e.g., `GOOGLE_PLACES_API_KEY`)
2. **Value:** Enter the corresponding value
3. **Environment:** Select where it should be available:
   - ✅ **Production** (for your live site)
   - ✅ **Preview** (for preview deployments)
   
4. Click **Save**

### **Step 4: Add Public Variables**

⚠️ **Important:** Variables starting with `PUBLIC_` need special handling:

For `PUBLIC_TURNSTILE_SITE_KEY`:
- Name: `PUBLIC_TURNSTILE_SITE_KEY`
- Value: Your Turnstile site key
- Make sure it's available in both Production and Preview

### **Step 5: Redeploy Your Site**

After adding environment variables:

1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest deployment
   
   OR
   
3. Push a new commit to trigger a fresh deployment

**Note:** Environment variables are only available after a new deployment. Existing deployments won't have access to newly added variables.

---

## 🧪 Testing Your Environment Variables

### **Test Google Reviews:**
```bash
# Visit this URL after deployment
https://your-site.pages.dev/api/google-reviews.json
```

**Expected Response:**
```json
{
  "reviews": [...],
  "placeInfo": {
    "name": "Active Away",
    "rating": 5,
    "totalReviews": 917
  }
}
```

**Error Response (if missing key):**
```json
{
  "error": "API key not configured"
}
```

### **Test Instagram:**
The Instagram section will either:
- ✅ Show real Instagram posts (if `DATABASE_URL` is configured)
- ❌ Show nothing or fallback content (if not configured)

### **Test Newsletter:**
```bash
# Visit this URL to test the endpoint
https://your-site.pages.dev/api/newsletter-signup.json
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Newsletter API endpoint is working",
  "timestamp": "2025-10-28T..."
}
```

---

## 🔍 Where to Get These Values

### **Google Places API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Places API (New)**
3. Create credentials → API Key
4. Restrict the key to Places API for security

### **Google Place ID:**
- Already configured: `ChIJ6aLvHHgPdkgR1oHhIDyNQtU`
- To find a different one: Use [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)

### **Database URL:**
- This is your PostgreSQL connection string
- Format: `postgresql://username:password@host:port/database?sslmode=require`
- If using Railway/Heroku/Supabase, copy from their dashboard

### **Turnstile Keys:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Turnstile**
3. Create a new site or use existing
4. Copy both Site Key (public) and Secret Key (private)

### **Strapi URL & Token:**
- `STRAPI_URL`: Your Strapi instance URL
- `STRAPI_TOKEN`: API token from Strapi Settings → API Tokens

---

## 🚨 Common Issues & Solutions

### **Issue 1: "API key not configured" error**
**Solution:** 
- Ensure `GOOGLE_PLACES_API_KEY` is added to Cloudflare Pages
- Redeploy after adding the variable
- Check the variable name is exactly correct (case-sensitive)

### **Issue 2: Instagram posts not showing**
**Solution:**
- Add `DATABASE_URL` to Cloudflare Pages
- Verify the PostgreSQL database is accessible
- Check that the `instagram_tokens` table exists with a valid token

### **Issue 3: Newsletter form doesn't work**
**Solution:**
- Add `NEWSLETTER_WEBHOOK_URL` and Turnstile keys
- Ensure `PUBLIC_TURNSTILE_SITE_KEY` is prefixed with `PUBLIC_`
- Redeploy after adding variables

### **Issue 4: Variables work locally but not on Cloudflare**
**Solution:**
- Local `.env` files don't automatically sync to Cloudflare
- You must manually add each variable in Cloudflare Pages dashboard
- Redeploy after adding variables

### **Issue 5: "Unexpected end of JSON input" or empty responses**
**Solution:**
- Check Cloudflare Pages build logs for errors
- Verify API routes are being built (using `output: 'server'` mode)
- Ensure `@astrojs/cloudflare` adapter is installed

---

## ✅ Verification Checklist

After adding environment variables and redeploying:

- [ ] Google Reviews section shows real reviews
- [ ] Instagram section displays posts
- [ ] Newsletter signup form submits successfully
- [ ] No "API key not configured" errors in browser console
- [ ] `/api/google-reviews.json` returns valid JSON
- [ ] `/api/newsletter-signup.json` returns status "ok"

---

## 📖 Related Documentation

- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)

---

## 🆘 Need Help?

If you're still experiencing issues:

1. Check Cloudflare Pages build logs
2. Check browser console for API errors
3. Verify all environment variables are set correctly
4. Ensure you've redeployed after adding variables
5. Test API endpoints directly in browser

**Last Updated:** October 28, 2025

