# Forms Webhook Format Guide

## Overview

You can now control whether form submissions send field **labels** or field **names** to your webhook.

---

## Add Field to Strapi

### 1. Open Content-Type Builder

1. Go to **Strapi Admin** → **Content-Type Builder**
2. Click on **Forms** collection
3. Click **Add another field**

### 2. Create the webhookFormat Field

**Field Type:** Enumeration

**Name:** `webhookFormat`

**Values:**
- `labels`
- `names`

**Advanced Settings:**
- Default value: `labels`
- Required: No

**Save** and **Restart** Strapi when prompted.

---

## How It Works

### Option 1: Labels Format (WordPress-style)

**Strapi Setting:** `webhookFormat: "labels"` (default)

**Webhook Receives:**
```json
{
  "Your Information": "",
  "First Name": "Joshua",
  "Last Name": "Thompson",
  "Email": "josh@activeaway.com",
  "Clinic Venue": "David Lloyd Chorley",
  "Clinic Host": "George",
  "Would you recommend us?": "10",
  "Booking Process 1-10": "8",
  "Booking Process Comments": "Easy process",
  "form_id": "clinic-feedback",
  "form_name": "Clinic Feedback",
  "timestamp": "2025-11-18T10:27:10.003Z",
  "source": "Active Away Website - Form"
}
```

**Use when:**
- Migrating from WordPress JetForms
- Your automation expects human-readable field labels
- You need section headers included as empty values
- Compatibility with existing Zapier/Make workflows

---

### Option 2: Names Format (Clean)

**Strapi Setting:** `webhookFormat: "names"`

**Webhook Receives:**
```json
{
  "yourname": "Joshua",
  "surname": "Thompson",
  "email": "josh@activeaway.com",
  "resortname": "David Lloyd Chorley",
  "holidayhost": "George",
  "recommendnumber": "10",
  "bookingprocess": "8",
  "bookingprocesscomments": "Easy process",
  "formSlug": "clinic-feedback",
  "formTitle": "Clinic Feedback",
  "timestamp": "2025-11-18T10:27:10.003Z",
  "source": "Active Away Website - Form"
}
```

**Use when:**
- Building new integrations
- You prefer clean, code-friendly field names
- Sections don't need to be included
- Working with databases or APIs that prefer lowercase keys

---

## Configuration in Strapi

### For WordPress-Compatible Forms (Labels)

1. Open your form in Strapi
2. Set **Webhook Format** to `labels`
3. Save and publish

**Result:** Webhook receives field labels as keys (e.g., "First Name", "Clinic Venue")

---

### For Clean Modern Forms (Names)

1. Open your form in Strapi
2. Set **Webhook Format** to `names`
3. Save and publish

**Result:** Webhook receives field names as keys (e.g., "yourname", "resortname")

---

## Field Comparison

| Aspect | Labels Format | Names Format |
|--------|---------------|--------------|
| **Keys** | Human-readable labels | Clean field names |
| **Sections** | Included as empty strings | Not included |
| **Example** | `"First Name": "John"` | `"yourname": "John"` |
| **Case** | Mixed case with spaces | Lowercase, no spaces |
| **Compatibility** | WordPress JetForms | Modern APIs/DBs |
| **Form metadata** | `form_id`, `form_name` | `formSlug`, `formTitle` |

---

## Migration Guide

### From WordPress to Strapi

If you're migrating from WordPress JetForms and need compatibility:

1. Set `webhookFormat: "labels"`
2. Keep your existing Zapier/Make workflows unchanged
3. Use the field labels from WordPress in your Strapi form JSON

### Starting Fresh

If you're building new forms from scratch:

1. Set `webhookFormat: "names"`
2. Use clean, lowercase field names (e.g., `first_name`, `email`)
3. Build your webhook handler to use these clean names

---

## Default Behavior

**If `webhookFormat` is not set:** Defaults to `"labels"`

This ensures backward compatibility with existing forms.

---

## Example Forms

### Feedback Form (Labels Format)

**Strapi:**
- Webhook Format: `labels`

**JSON:** See `FEEDBACK_FORM_JSON.json`

**Webhook receives:** Field labels as keys

---

### Clinic Feedback (Labels Format)

**Strapi:**
- Webhook Format: `labels`

**JSON:** See `CLINIC_FEEDBACK_FORM_JSON.json`

**Webhook receives:** Field labels as keys with sections

---

## Troubleshooting

### My webhook is receiving field names instead of labels

**Solution:** In Strapi, edit your form and set `webhookFormat` to `"labels"`

### My webhook is receiving labels but I want field names

**Solution:** In Strapi, edit your form and set `webhookFormat` to `"names"`

### Sections are showing as empty values

**Expected behavior** in labels format. Sections are included as empty strings to maintain field order.

**To remove them:** Switch to `webhookFormat: "names"` - sections won't be included.

---

## Best Practices

### ✅ Use Labels Format When:
- Migrating from WordPress
- Your team reads the webhook data manually
- Existing integrations expect labels
- Order of fields matters (sections maintain structure)

### ✅ Use Names Format When:
- Building new integrations
- Storing in databases
- Working with APIs
- You prefer clean, programmatic field names
- You don't need section separators

---

## API Response

Both formats include standard metadata:

```json
{
  "timestamp": "2025-11-18T10:27:10.003Z",
  "source": "Active Away Website - Form"
}
```

**Labels format adds:**
- `form_id`: Form slug
- `form_name`: Form title

**Names format adds:**
- `formSlug`: Form slug
- `formTitle`: Form title

---

## Summary

The `webhookFormat` field gives you full control over your webhook payload structure:

- **`labels`** = WordPress-compatible, human-readable
- **`names`** = Modern, clean, code-friendly

Choose the format that best fits your integration needs!

