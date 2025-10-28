# Browser Errors - Debugging Guide

## ✅ Build is Working!
The build completed successfully, so the configuration is correct.

## Common Browser Errors After Switching to Server Mode

### 1. **Dev Server Issues**
After changing the configuration, you need to:
```bash
# Stop your current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. **What to Check in Browser Console (F12)**

Open Developer Tools and look for errors. Common ones include:

#### **TypeError: Cannot read properties of undefined**
- This usually means a component is trying to access data that's not loaded
- Check the Network tab to see if API calls are failing

#### **404 Not Found on API routes**
- Make sure the dev server restarted after config changes
- Check that the URL is correct: `/api/newsletter-signup.json`

#### **CORS Errors**
- Shouldn't happen with same-origin requests
- If you see this, there's a proxy/server configuration issue

### 3. **What to Check in Terminal (Server Logs)**

Look for these in your terminal where `npm run dev` is running:

#### **Good Signs:**
```
✓ Server running at http://localhost:4321/
✓ Using adapter: @astrojs/cloudflare
```

#### **Bad Signs:**
```
Error: Cannot find module '@astrojs/cloudflare'
```
- If you see this, run: `npm install`

### 4. **Test the API Endpoint**

Open your browser and visit:
```
http://localhost:4321/api/newsletter-signup.json
```

**Expected result:**
```json
{
  "status": "ok",
  "message": "Newsletter API endpoint is working",
  "timestamp": "2025-10-28T..."
}
```

**If you get 404:**
- Dev server needs to be restarted
- Config changes didn't take effect

### 5. **Test the Newsletter Form**

1. Open: `http://localhost:4321`
2. Scroll to footer
3. Open browser console (F12)
4. Fill in name and email
5. Click Submit
6. Look for these console logs:
   - 📤 Submitting newsletter form: {...}
   - 📥 Response status: ...
   - 📦 Response data: {...}

## Still Having Issues?

Please share:
1. **Exact error message** from browser console
2. **Server terminal output** when you try to submit
3. **Network tab** - what status code does the API request get?

## Quick Fix Checklist

- [ ] Dev server restarted after config changes
- [ ] `npm install` ran successfully
- [ ] `.env` file has `NEWSLETTER_WEBHOOK_URL` set
- [ ] No errors in terminal when dev server starts
- [ ] API endpoint test (Step 4) returns JSON
- [ ] Browser console shows no errors on page load

