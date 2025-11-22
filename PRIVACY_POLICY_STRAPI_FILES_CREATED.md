# Privacy Policy Page - Strapi Schema Files Created ✅

## Files Created in Strapi

All necessary schema files have been created in your Strapi directory at `/Users/joshuathompson/strapi/strapi`.

### 1. Content Type: Privacy Policy Page

**Location:** `/src/api/privacy-policy-page/`

Created files:
- ✅ `content-types/privacy-policy-page/schema.json` - Content type definition
- ✅ `controllers/privacy-policy-page.js` - Controller
- ✅ `routes/privacy-policy-page.js` - Router
- ✅ `services/privacy-policy-page.js` - Service

**Fields:**
- `pageTitle` (Text) - Default: "Privacy Policy"
- `introText` (Rich Text) - Optional introduction
- `lastUpdated` (Date) - Last update date
- `heroBackgroundImage` (Media) - Hero background image
- `sections` (Component - Repeatable) - Privacy policy sections
- `seo` (Component) - SEO metadata

### 2. Component: Privacy Policy Section

**Location:** `/src/components/privacy-policy/section.json`

**Fields:**
- `sectionTitle` (Text) - Section title
- `sectionSlug` (UID) - Auto-generated from title
- `content` (Rich Text) - Section content
- `showForm` (Boolean) - Show embedded form (default: false)
- `formFields` (JSON) - Form field configuration
- `formWebhookUrl` (Text) - Webhook URL for form submission
- `formSuccessMessage` (Text) - Custom success message

---

## Next Steps

### 1. Restart Strapi

You need to restart your Strapi server to pick up the new content type:

```bash
cd /Users/joshuathompson/strapi/strapi
npm run develop
```

Or if using PM2:
```bash
pm2 restart strapi
```

### 2. Access Strapi Admin

Once Strapi restarts, log in to your Strapi admin panel:
- The new **Privacy Policy Page** content type will appear in the sidebar
- You can now create your first entry

### 3. Create Privacy Policy Entry

In Strapi Admin:

1. Click **Privacy Policy Page** in the sidebar
2. Click **"Create new entry"**
3. Fill in the basic fields:
   - **Page Title:** "Privacy Policy"
   - **Last Updated:** Today's date
   - **Hero Background Image:** Upload an image
   - **Intro Text:** Optional intro paragraph

4. Add sections by clicking **"Add a component"** under **sections**

---

## Example Sections to Add

### Section 1: Privacy Policy (Main Content)

```
Section Title: Privacy Policy
Section Slug: privacy-policy (auto-generated)
Content: [Add your main privacy policy text here]
Show Form: false
```

### Section 2: Right to Be Forgotten

```
Section Title: Right to Be Forgotten
Section Slug: right-to-be-forgotten (auto-generated)
Content: [Explain GDPR right to erasure]
Show Form: true
Form Webhook URL: https://hook.eu2.make.com/your-webhook-url
Form Fields: [See JSON below]
```

**Form Fields JSON:**
```json
[
  {
    "name": "full_name",
    "type": "text",
    "label": "Full Name",
    "placeholder": "e.g. John Smith",
    "required": true
  },
  {
    "name": "email",
    "type": "email",
    "label": "Email Address",
    "placeholder": "e.g. john@example.com",
    "required": true
  },
  {
    "name": "reason",
    "type": "textarea",
    "label": "Reason for Request (Optional)",
    "placeholder": "Please let us know why you're requesting data deletion...",
    "required": false
  }
]
```

### Section 3: Request Data Archive

```
Section Title: Request Data Archive
Section Slug: request-data-archive (auto-generated)
Content: [Explain data portability rights]
Show Form: true
Form Webhook URL: https://hook.eu2.make.com/your-webhook-url
Form Fields: [See JSON below]
```

**Form Fields JSON:**
```json
[
  {
    "name": "full_name",
    "type": "text",
    "label": "Full Name",
    "placeholder": "e.g. John Smith",
    "required": true
  },
  {
    "name": "email",
    "type": "email",
    "label": "Email Address",
    "placeholder": "e.g. john@example.com",
    "required": true
  },
  {
    "name": "verification",
    "type": "text",
    "label": "Account ID or Booking Reference",
    "placeholder": "For verification purposes",
    "required": true
  },
  {
    "name": "data_format",
    "type": "select",
    "label": "Preferred Format",
    "placeholder": "Please Select",
    "options": [
      "PDF",
      "CSV",
      "JSON"
    ],
    "required": true
  }
]
```

### Section 4: Update Your Information

```
Section Title: Update Your Information
Section Slug: update-your-information (auto-generated)
Content: [Explain how to update data]
Show Form: true
Form Webhook URL: https://hook.eu2.make.com/your-webhook-url
Form Fields: [See JSON below]
```

**Form Fields JSON:**
```json
[
  {
    "name": "full_name",
    "type": "text",
    "label": "Full Name",
    "placeholder": "e.g. John Smith",
    "required": true
  },
  {
    "name": "email",
    "type": "email",
    "label": "Current Email Address",
    "placeholder": "e.g. john@example.com",
    "required": true
  },
  {
    "name": "updates",
    "type": "textarea",
    "label": "What information needs updating?",
    "placeholder": "Please describe what information you'd like to update...",
    "required": true
  }
]
```

### Section 5: Cookie Policy

```
Section Title: Cookie Policy
Section Slug: cookie-policy (auto-generated)
Content: [Add your cookie policy text]
Show Form: false
```

### Section 6: Data Processing Agreement

```
Section Title: Data Processing Agreement
Section Slug: data-processing-agreement (auto-generated)
Content: [Add your DPA text]
Show Form: false
```

---

## Configure SEO

Don't forget to add SEO metadata:

1. Click **"Add a component"** under **seo**
2. Fill in:
   - **Meta Title:** "Privacy Policy | Active Away"
   - **Meta Description:** "Read our privacy policy to understand how Active Away collects, uses, and protects your personal data."
   - **Meta Robots:** Leave blank (will be indexed)
   - **Canonical URL:** "https://activeaway.com/privacy-policy"

---

## Publish the Page

1. Click **Save** to save your entry
2. Click **Publish** to make it live
3. The page will be available at `/privacy-policy`

---

## Webhook Configuration

For each form section, you'll need to:

1. Create a webhook in Make.com
2. Copy the webhook URL
3. Paste it into the **Form Webhook URL** field in Strapi
4. Configure the webhook to:
   - Send email notifications
   - Store data (optional)
   - Send confirmation email to user

---

## Files Location Summary

```
/Users/joshuathompson/strapi/strapi/src/
├── api/
│   └── privacy-policy-page/
│       ├── content-types/
│       │   └── privacy-policy-page/
│       │       └── schema.json
│       ├── controllers/
│       │   └── privacy-policy-page.js
│       ├── routes/
│       │   └── privacy-policy-page.js
│       └── services/
│           └── privacy-policy-page.js
└── components/
    └── privacy-policy/
        └── section.json
```

---

## Troubleshooting

**If the content type doesn't appear after restart:**

1. Check Strapi logs for any errors
2. Verify all JSON files are valid (no syntax errors)
3. Make sure Strapi has been fully restarted
4. Clear browser cache and refresh Strapi admin

**If sections don't show:**

- Make sure the component file exists at the correct path
- Check the component name matches in the schema: `"privacy-policy.section"`

---

**Status:** ✅ All Strapi schema files created and ready to use!

**Next:** Restart Strapi and create your privacy policy content!


