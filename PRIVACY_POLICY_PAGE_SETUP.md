# Privacy Policy Page - Strapi Setup Guide

This guide covers the setup needed in Strapi to power the Privacy Policy page at `/privacy-policy`.

## Overview

The Privacy Policy page is powered by Strapi with dynamic sections that can optionally contain embedded forms. This allows you to add GDPR-compliant forms like "Right to Be Forgotten", "Request Data Archive", etc.

---

## 1. Create Privacy Policy Page Content Type

1. Open **Content-Type Builder** in Strapi
2. Click **"Create new collection type"**
3. **Display Name:** `Privacy Policy Page`
4. **API ID (singular):** `privacy-policy-page`
5. Click **Continue**

### Add Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `pageTitle` | Text | Required, default: "Privacy Policy" |
| `introText` | Rich Text | Optional, shows at top of page |
| `lastUpdated` | Date | Shows "Last updated" date |
| `heroBackgroundImage` | Media (Single Image) | Hero background |
| `sections` | Component (Repeatable) | See section below |
| `seo` | Component (Single) | Use existing SEO component |

Click **Save** to create the content type.

---

## 2. Create Privacy Policy Section Component

1. In **Content-Type Builder**, go to **Components**
2. Click **"Create new component"**
3. **Category:** `privacy-policy`
4. **Component name:** `section`
5. **Icon:** Choose any icon (e.g., document)

### Add Component Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `sectionTitle` | Text | Required, e.g., "Privacy Policy", "Right to Be Forgotten" |
| `sectionSlug` | UID (based on sectionTitle) | Required, unique within page |
| `content` | Rich Text | The section content (markdown supported) |
| `showForm` | Boolean | Default: false, shows form if true |
| `formFields` | JSON | Form configuration (only used if showForm = true) |
| `formWebhookUrl` | Text | Webhook URL for form submission |
| `formSuccessMessage` | Text | Optional custom success message |

Click **Save** to create the component.

---

## 3. Create Privacy Policy Entry

1. Go to **Content Manager**
2. Click **Privacy Policy Page**
3. Click **"Create new entry"**
4. Fill in the fields:
   - **pageTitle:** "Privacy Policy"
   - **introText:** Optional introduction text
   - **lastUpdated:** Today's date
   - **heroBackgroundImage:** Upload or select an image
   - **SEO:** Add meta title, description, etc.

---

## 4. Add Privacy Policy Sections

Click **"Add a component"** under **sections** to add each section:

### Section 1: Privacy Policy (Main Content)

- **sectionTitle:** `Privacy Policy`
- **sectionSlug:** `privacy-policy` (auto-generated)
- **content:** Add your privacy policy content (markdown supported)
- **showForm:** `false` (no form needed)

### Section 2: Right to Be Forgotten

- **sectionTitle:** `Right to Be Forgotten`
- **sectionSlug:** `right-to-be-forgotten` (auto-generated)
- **content:** Explain the right to erasure under GDPR
- **showForm:** `true`
- **formWebhookUrl:** `https://hook.eu2.make.com/your-webhook-url`
- **formFields:** (See JSON below)

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

- **sectionTitle:** `Request Data Archive`
- **sectionSlug:** `request-data-archive` (auto-generated)
- **content:** Explain the right to data portability
- **showForm:** `true`
- **formWebhookUrl:** `https://hook.eu2.make.com/your-webhook-url`
- **formFields:** (See JSON below)

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

- **sectionTitle:** `Update Your Information`
- **sectionSlug:** `update-your-information` (auto-generated)
- **content:** Explain how users can update their data
- **showForm:** `true`
- **formWebhookUrl:** `https://hook.eu2.make.com/your-webhook-url`
- **formFields:** (See JSON below)

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

- **sectionTitle:** `Cookie Policy`
- **sectionSlug:** `cookie-policy` (auto-generated)
- **content:** Add your cookie policy content
- **showForm:** `false` (no form needed)

### Section 6: Data Processing Agreement

- **sectionTitle:** `Data Processing Agreement`
- **sectionSlug:** `data-processing-agreement` (auto-generated)
- **content:** Add your DPA content
- **showForm:** `false` (no form needed)

---

## 5. Publish the Page

1. Click **Save** to save your entry
2. Click **Publish** to make it live
3. The page will be available at `/privacy-policy`

---

## Form Configuration Notes

### Form Field Types

The following field types are supported in the `formFields` JSON:

- `text` - Single line text input
- `email` - Email input with validation
- `tel` - Phone number with country code selector
- `textarea` - Multi-line text area
- `select` - Dropdown with options
- `checkbox` - Checkboxes (single or multiple)
- `date` - Date picker
- `file` - File upload (automatically uploads to R2)
- `hidden` - Hidden field (can be populated from URL query params)

### Form Submission

All forms submit to the specified `formWebhookUrl` via Make.com (or your webhook service). The webhook receives:

```json
{
  "formSlug": "section-slug",
  "data": {
    "field_name": "value",
    ...
  },
  "turnstileToken": "cloudflare-turnstile-token"
}
```

### Custom Success Message

You can override the default success message by setting `formSuccessMessage`:

```
Thank you for your request. We will process your data deletion request within 30 days as required by GDPR.
```

---

## Webhook Setup in Make.com

For each form webhook:

1. Create a new scenario in Make.com
2. Add a **Webhook** trigger
3. Copy the webhook URL to Strapi's `formWebhookUrl` field
4. Add modules to:
   - Parse the incoming data
   - Send email notification
   - Store in database/Airtable/Google Sheets
   - Send confirmation email to user

---

## SEO Configuration

Don't forget to configure SEO settings:

- **Meta Title:** "Privacy Policy | Active Away"
- **Meta Description:** "Read our privacy policy to understand how Active Away collects, uses, and protects your personal data."
- **Meta Robots:** Leave blank (will be indexed)
- **Canonical URL:** "https://activeaway.com/privacy-policy"

---

## Testing Checklist

- [ ] Page loads correctly at `/privacy-policy`
- [ ] All sections appear in table of contents
- [ ] Accordions open/close correctly
- [ ] TOC links scroll to correct sections and open accordion
- [ ] Forms appear only when `showForm = true`
- [ ] Form submissions work correctly
- [ ] Success messages display after submission
- [ ] Page is responsive on mobile/tablet/desktop
- [ ] SEO meta tags are correct

---

## Need Help?

If you need to add more sections or modify existing ones:

1. Go to **Content Manager** → **Privacy Policy Page**
2. Edit the entry
3. Add/remove/reorder sections as needed
4. Save and publish

The page will automatically update!

