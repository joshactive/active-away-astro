# Pre-Orders Single Page - Strapi Setup Guide

This guide explains how to configure the Strapi `pre-orders` collection type to support the new single page functionality.

## Overview

The pre-orders single pages (`/pre-orders/[slug]`) display:
- Hero section with custom background image
- Downloadable menu PDFs
- Dynamic form with configurable fields
- Form submission to webhook (Zapier/Make)

## Strapi Schema Configuration

### 1. Add Fields to Pre-Orders Collection Type

Navigate to **Content-Type Builder** → **Pre-Orders** and add the following fields:

#### Hero Section Fields

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `heroTitle` | Text | No | Hero section title (falls back to `title` if empty) |
| `heroSubtitle` | Long Text | No | Hero section subtitle (falls back to `excerpt` if empty) |
| `heroKicker` | Text | No | Small text above title (e.g., "EXCLUSIVE OPPORTUNITY") |
| `heroBackgroundImage` | Media (Single) | No | Hero background image |

#### Menu Files

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `menuFiles` | Media (Multiple) | No | Upload multiple PDF menus (e.g., Anaya Menu, Fresco Menu, etc.) |

#### Form Configuration

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `formWebhookUrl` | Text (Long) | No | Webhook URL for form submissions (Zapier/Make webhook URL) |
| `formFields` | JSON | No | Form field configuration (see example below) |

#### SEO

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `seo` | Component (Repeatable: No) | No | Use the shared SEO component with metaTitle, metaDescription, metaImage, keywords, canonicalURL |

## 2. Form Fields JSON Structure

The `formFields` field should contain a JSON object with the following structure:

```json
{
  "fields": [
    {
      "name": "firstName",
      "label": "First Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g Michael"
    },
    {
      "name": "surname",
      "label": "Surname",
      "type": "text",
      "required": true,
      "placeholder": "e.g Cole"
    },
    {
      "name": "email",
      "label": "Email",
      "type": "email",
      "required": true,
      "placeholder": "e.g michaelcole@gmail.com"
    },
    {
      "name": "dateOfAttendance",
      "label": "Date of Attendance",
      "type": "date",
      "required": true
    },
    {
      "name": "restaurant",
      "label": "Restaurant",
      "type": "select",
      "required": true,
      "options": [
        "Anaya Restaurant",
        "Fresco Restaurant",
        "Kos Restaurant",
        "Oliva Restaurant",
        "Ouzo Restaurant",
        "Provence Restaurant",
        "Seasons Restaurant"
      ]
    },
    {
      "name": "starter",
      "label": "Starter",
      "type": "text",
      "required": false,
      "placeholder": "e.g Spicy Garlic & Paprika Shrimp"
    },
    {
      "name": "mainCourse",
      "label": "Main Course",
      "type": "text",
      "required": false,
      "placeholder": "e.g Medium Rare Steak"
    },
    {
      "name": "dessert",
      "label": "Dessert",
      "type": "text",
      "required": false,
      "placeholder": "e.g Chocolate Brownie"
    },
    {
      "name": "dietaryRequirements",
      "label": "Dietary Requirements",
      "type": "textarea",
      "required": false,
      "placeholder": "e.g None"
    },
    {
      "name": "otherInformation",
      "label": "Other Information",
      "type": "textarea",
      "required": false,
      "placeholder": "Any special requests"
    }
  ]
}
```

### Supported Field Types

- `text` - Single line text input
- `email` - Email input with validation
- `date` - Date picker
- `textarea` - Multi-line text area
- `select` - Dropdown menu (requires `options` array)

### Field Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Unique field identifier (camelCase) |
| `label` | string | Yes | Display label for the field |
| `type` | string | Yes | Field type (text, email, date, textarea, select) |
| `required` | boolean | Yes | Whether the field is required |
| `placeholder` | string | No | Placeholder text for the input |
| `options` | array | For select | Array of options for select fields |

## 3. Setting Up a Pre-Order

### Step 1: Create/Edit Pre-Order Entry

1. Go to **Content Manager** → **Pre-Orders**
2. Create a new entry or edit an existing one
3. Fill in the basic fields (`title`, `slug`, `excerpt`, `description`)

### Step 2: Configure Hero Section

1. Set `heroTitle` (e.g., "IKOS ARIA PRE-ORDER")
2. Set `heroSubtitle` (e.g., "Secure your spot for an exclusive dining experience")
3. Set `heroKicker` (e.g., "EXCLUSIVE OPPORTUNITY")
4. Upload `heroBackgroundImage` (recommended: 1920x1080px)

### Step 3: Upload Menu Files

1. Click **Add files** in the `menuFiles` field
2. Upload PDF menus (e.g., Anaya Menu.pdf, Fresco Menu.pdf)
3. Each file will appear as a downloadable link on the page

### Step 4: Configure Form

1. Get your Zapier or Make.com webhook URL
2. Paste it into `formWebhookUrl`
3. Copy the JSON example above into `formFields`
4. Customize the fields and options as needed

### Step 5: Configure SEO (Optional)

1. Expand the `seo` component
2. Set `metaTitle`, `metaDescription`, `keywords`
3. Upload `metaImage` for social sharing
4. Set `canonicalURL` (e.g., `https://activeaway.com/pre-orders/ikos-aria`)

### Step 6: Publish

1. Click **Save**
2. Click **Publish**
3. The page will be available at `/pre-orders/[your-slug]`

## 4. Webhook Setup (Zapier/Make)

### Create a Webhook in Zapier

1. Create a new Zap
2. Choose **Webhooks by Zapier** as the trigger
3. Select **Catch Hook**
4. Copy the webhook URL
5. Paste it into the `formWebhookUrl` field in Strapi

### Create a Webhook in Make

1. Create a new scenario
2. Add **Webhooks** → **Custom Webhook**
3. Copy the webhook URL
4. Paste it into the `formWebhookUrl` field in Strapi

### Webhook Payload Structure

The webhook will receive the following JSON payload:

```json
{
  "preOrderTitle": "IKOS ARIA PRE-ORDER",
  "submittedAt": "2025-01-15T10:30:00.000Z",
  "source": "Active Away Website - Pre-Order Form",
  "formData": {
    "firstName": "Michael",
    "surname": "Cole",
    "email": "michaelcole@gmail.com",
    "dateOfAttendance": "2025-02-15",
    "restaurant": "Anaya Restaurant",
    "starter": "Spicy Garlic & Paprika Shrimp",
    "mainCourse": "Medium Rare Steak",
    "dessert": "Chocolate Brownie",
    "dietaryRequirements": "None",
    "otherInformation": "Window seat please"
  }
}
```

## 5. Example Pre-Order Entry

Here's a complete example for reference:

**Basic Info:**
- Title: `IKOS ARIA PRE-ORDER`
- Slug: `ikos-aria-pre-order`
- Excerpt: `Secure your spot for an exclusive dining experience at Ikos Aria`
- Description: `Be the first to experience our exceptional dining venues...`

**Hero Section:**
- heroTitle: `IKOS ARIA PRE-ORDER`
- heroSubtitle: `Secure your spot for an exclusive dining experience`
- heroKicker: `EXCLUSIVE OPPORTUNITY`
- heroBackgroundImage: [Upload beach resort image]

**Menu Files:**
- Anaya Menu.pdf
- Fresco Menu.pdf
- Kos Menu.pdf
- Oliva Menu.pdf
- Ouzo Menu.pdf
- Provence Menu.pdf
- Seasons Menu.pdf

**Form Configuration:**
- formWebhookUrl: `https://hooks.zapier.com/hooks/catch/...`
- formFields: [Copy JSON from above]

**SEO:**
- metaTitle: `IKOS ARIA Pre-Order - Active Away`
- metaDescription: `Secure your dining reservations for Ikos Aria...`
- keywords: `ikos aria, pre-order, dining, tennis holiday`
- canonicalURL: `https://activeaway.com/pre-orders/ikos-aria-pre-order`

## 6. Testing

1. Navigate to `/pre-orders` to see your pre-order in the listing
2. Click on the card to visit `/pre-orders/[slug]`
3. Check the hero section displays correctly
4. Download a menu PDF to verify links work
5. Fill out and submit the form
6. Verify the webhook receives the data in Zapier/Make

## 7. Troubleshooting

### Menu files not showing
- Ensure files are published in Strapi Media Library
- Check that `menuFiles` field is populated
- Verify files have proper URLs

### Form not submitting
- Check browser console for errors
- Verify `formWebhookUrl` is correct and active
- Test webhook URL directly with a tool like Postman

### Page returns 404
- Ensure pre-order is published in Strapi
- Check the `slug` field matches the URL
- Rebuild the site (`npm run build`)

### Form fields not rendering
- Validate JSON syntax in `formFields`
- Ensure `fields` array exists in JSON
- Check field types are supported

## 8. Future Enhancements

Potential improvements for future versions:

- Add image gallery for venue photos
- Include pricing information
- Add availability calendar
- Support multiple languages
- Email notifications to admins on form submission
- Confirmation email to users

## Support

For questions or issues, contact the development team or refer to the main documentation.

