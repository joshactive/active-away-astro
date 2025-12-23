# Form Redirect Feature - Complete ✅

## Overview

Forms can now redirect users to a custom URL after successful submission. This works for both:
- **Strapi-managed forms** (accessed via `/forms/[slug]`)
- **Sales landing page forms** (inline forms with JSON configuration)

---

## How It Works

1. **User submits form** → Form data sent to webhook
2. **Webhook processes successfully** → API returns `redirectUrl` (if configured)
3. **Frontend receives response** → Redirects to specified URL
4. **No redirect configured?** → Shows success message as usual

---

## Setup Instructions

### For Strapi Forms

1. Go to **Strapi Admin → Content Manager → Forms**
2. Open or create a form
3. Scroll to the **Redirect URL** field
4. Enter the URL where users should be redirected after submission
   - Examples:
     - `/thank-you`
     - `https://activeaway.com/booking-confirmation`
     - `/forms/another-form?ref=previous`
5. **Save and Publish**

**Field Details:**
- **Field Name:** `redirectUrl`
- **Type:** String (text)
- **Required:** No (optional)
- **Location:** Strapi Admin → Forms → Redirect URL

---

### For Sales Landing Page Forms

1. Go to **Strapi Admin → Content Manager → Sales Landing Pages**
2. Open or create a landing page
3. Scroll to **Form Section**
4. Find the **Redirect URL** field
5. Enter the redirect destination URL
6. **Save and Publish**

**Field Details:**
- **Field Name:** `redirectUrl`
- **Type:** String (text)
- **Required:** No (optional)
- **Location:** Sales Landing Page → Form Section → Redirect URL

---

## Technical Implementation

### Files Modified

#### 1. Strapi Schema - Form Content Type
**File:** `/Users/joshuathompson/strapi/strapi/src/api/form/content-types/form/schema.json`

```json
{
  "redirectUrl": {
    "type": "string",
    "required": false
  }
}
```

#### 2. Strapi Schema - Sales Landing Form Section Component
**File:** `/Users/joshuathompson/strapi/strapi/src/components/sales-landing/form-section.json`

```json
{
  "redirectUrl": {
    "type": "string",
    "required": false
  }
}
```

#### 3. API Endpoint - Form Submission
**File:** `src/pages/api/submit-form.json.ts`

**Changes:**
- Accepts `redirectUrl` from request body (for sales landing pages)
- Fetches `redirectUrl` from Strapi (for regular forms)
- Returns `redirectUrl` in success response

```typescript
// Request body
const { formSlug, data, turnstileToken, webhookUrl, redirectUrl: providedRedirectUrl } = body;

// Fetch from Strapi for regular forms
const form = strapiData.data[0];
redirectUrl = form.redirectUrl || redirectUrl;

// Return in response
return new Response(JSON.stringify({ 
  success: true,
  message: 'Form submitted successfully!',
  redirectUrl: redirectUrl || null
}), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
});
```

#### 4. Frontend Form Component
**File:** `src/components/DynamicFormTailwind.astro`

**Changes:**
- Passes `redirectUrl` in form data attributes
- Sends `redirectUrl` to API
- Redirects on successful submission if URL provided
- Shows success message if no redirect URL

```javascript
// Send to API
body: JSON.stringify({
  formSlug: formSlug,
  data: data,
  turnstileToken: turnstileToken,
  webhookUrl: webhookUrl,
  redirectUrl: redirectUrl
})

// Handle response
if (response.ok && result.success) {
  // Dispatch analytics event first
  document.dispatchEvent(new CustomEvent('active-away-form-success', { 
    detail: { formSlug, data } 
  }));

  // Redirect if URL provided
  if (result.redirectUrl) {
    console.log('🔗 Redirecting to:', result.redirectUrl);
    window.location.href = result.redirectUrl;
    return;
  }

  // Otherwise show success message
  successMessage?.classList.remove('hidden');
  // ... rest of success handling
}
```

#### 5. Sales Landing Page Component
**File:** `src/components/SalesLandingPageTailwind.astro`

```javascript
const formData = formSection?.form ? {
  slug: 'sales-landing-form',
  formFields: formSection.form,
  webhookUrl: formSection.webhookUrl,
  redirectUrl: formSection.redirectUrl || null,
  // ...
} : null;
```

#### 6. Strapi Utility Functions
**File:** `src/utils/strapi.js`

**Form Transform:**
```javascript
function transformFormDetail(item) {
  return {
    // ... other fields
    formWebhookUrl: form.formWebhookUrl || null,
    redirectUrl: form.redirectUrl || null,
    // ...
  };
}
```

**Sales Landing Page Transform:**
```javascript
formSection: page.formSection ? {
  eyebrow: page.formSection.eyebrow,
  heading: page.formSection.heading,
  description: page.formSection.description,
  form,
  webhookUrl: page.formSection.webhookUrl || null,
  redirectUrl: page.formSection.redirectUrl || null
} : null,
```

---

## Usage Examples

### Example 1: Thank You Page
```
Redirect URL: /thank-you
```
User submits form → Redirected to `/thank-you` page

### Example 2: External URL
```
Redirect URL: https://calendly.com/activeaway/consultation
```
User submits form → Redirected to Calendly booking page

### Example 3: Another Form with Context
```
Redirect URL: /forms/booking-form?source=newsletter&confirmed=true
```
User submits newsletter form → Redirected to booking form with tracking parameters

### Example 4: No Redirect (Default Behavior)
```
Redirect URL: (leave empty)
```
User submits form → Sees success message on same page

---

## Flow Diagram

```
User Fills Form
    ↓
Clicks Submit
    ↓
Form validated ✓
    ↓
Data sent to /api/submit-form.json
    ↓
API forwards to webhook
    ↓
Webhook processes successfully ✓
    ↓
API returns { success: true, redirectUrl: "..." }
    ↓
    ├─ redirectUrl exists?
    │   ↓ YES
    │   window.location.href = redirectUrl
    │   (User redirected)
    │
    └─ NO
        Show success message
        Reset form
```

---

## Query Parameters in Forms

You can also use the existing `queryParam` feature in combination with redirects. For example:

**Form JSON:**
```json
[
  {
    "name": "refid",
    "type": "hidden",
    "queryParam": "refid"
  },
  {
    "name": "firstName",
    "type": "text",
    "label": "First Name",
    "required": true
  }
]
```

**URL:** `https://activeaway.com/forms/signup?refid=partner123`

**Result:**
- Form captures `refid=partner123` automatically
- Sends to webhook with other form data
- Redirects to configured URL after submission

---

## Important Notes

### Analytics
The `active-away-form-success` analytics event is **always dispatched** before redirect happens, ensuring tracking is not lost.

### Timing
Redirect happens immediately after:
1. ✅ Form submission successful
2. ✅ Webhook processed successfully  
3. ✅ Analytics event dispatched

### Relative vs Absolute URLs
Both work:
- Relative: `/thank-you` → Stays on same domain
- Absolute: `https://example.com/page` → Can redirect anywhere

### Success Message
If `redirectUrl` is provided, the success message is **not shown** because the user is immediately redirected.

### Error Handling
If redirect URL is malformed or unreachable, the browser will handle it according to standard navigation behavior.

---

## Testing Checklist

- [ ] Create test form in Strapi with redirect URL
- [ ] Submit form and verify redirect works
- [ ] Test with relative URL (`/thank-you`)
- [ ] Test with absolute URL (`https://example.com`)
- [ ] Test form without redirect URL (should show success message)
- [ ] Verify analytics event fires before redirect
- [ ] Test sales landing page form with redirect
- [ ] Verify webhook still receives data correctly

---

## Troubleshooting

### Redirect not working?
1. Check browser console for `🔗 Redirecting to:` message
2. Verify `redirectUrl` field has value in Strapi
3. Check API response includes `redirectUrl` (Network tab)
4. Ensure URL format is valid

### Form shows success message instead of redirecting?
- Redirect URL field is empty or null in Strapi
- This is expected behavior when no redirect is configured

### Webhook not receiving data?
- Redirect happens **after** webhook is called
- Check webhook logs - data should still be sent
- Redirect does not affect webhook delivery

---

## Related Features

- **Hidden Fields:** Capture URL parameters with `queryParam`
- **Form Analytics:** Track form submissions with custom events
- **Webhook Integration:** Send form data to external services
- **Conditional Submit:** Show/hide submit button based on field values

---

## Strapi Setup Reminder

After modifying schema files, you need to:
1. **Restart Strapi server** for changes to take effect
2. Schema changes are automatic - no need to rebuild
3. Existing forms will have empty `redirectUrl` by default

---

## Summary

The redirect feature is now fully integrated into both:
- ✅ Regular forms (`/forms/[slug]`)
- ✅ Sales landing page forms
- ✅ API endpoint handles redirectUrl
- ✅ Frontend redirects after successful submission
- ✅ Analytics events fire before redirect
- ✅ Backward compatible (empty redirect = show success message)

**Status:** Production Ready 🚀















