# Key Takeaways Page - Strapi Setup Guide

## Overview
This guide will help you create the `key-takeaways-page` single type in Strapi with hero section, SEO fields, and dynamic sections for videos and PDF downloads.

---

## Step 1: Create Components

### Component 1: Key Takeaway Item

1. Go to **Content-Type Builder** in Strapi
2. Under **Components**, create a new category: `key-takeaways`
3. Create new component: `item`
4. Display name: `Key Takeaway Item`

**Add these fields:**

| Field Name | Type | Settings | Notes |
|------------|------|----------|-------|
| `type` | Enumeration | Required | Values: `video`, `pdf-download` |
| `title` | Text (Short) | Required | e.g., "Baseline Brilliance" |
| `description` | Text (Long) | Optional | Item description |
| `youtubeUrl` | Text (Short) | Optional | YouTube video URL (for video type) |
| `pdfFile` | Media (Single) | Optional | PDF file upload (for pdf-download type) |
| `pdfLabel` | Text (Short) | Optional | Override label for PDF link |

### Component 2: Key Takeaways Section

1. In **Content-Type Builder** → **Components** → `key-takeaways`
2. Create new component: `section`
3. Display name: `Key Takeaways Section`

**Add these fields:**

| Field Name | Type | Settings | Notes |
|------------|------|----------|-------|
| `categoryLabel` | Text (Short) | Optional | e.g., "UK EVENTS", "OVERSEAS" |
| `sectionTitle` | Text (Short) | Required | e.g., "Clinics", "Tennis Holidays" |
| `description` | Rich Text | Optional | Section description (supports markdown) |
| `items` | Component | Repeatable | Select `key-takeaways.item` |

---

## Step 2: Create Single Type

1. Go to **Content-Type Builder**
2. Click **Create new single type**
3. Name: `key-takeaways-page`
4. Display name: `Key Takeaways Page`
5. Click **Continue**

---

## Step 3: Add Fields to Single Type

### Page Hero (Component)

1. Click **Add another field**
2. Select **Component**
3. Name: `pageHero`
4. Display name: `Page Hero`
5. Select **Use an existing component**: `sections.page-hero`
6. Type: **Single component**
7. **Required**: ✅ Yes
8. Click **Finish**

### Sections (Component - Repeatable)

1. Click **Add another field**
2. Select **Component**
3. Name: `sections`
4. Display name: `Sections`
5. Select **Use an existing component**: `key-takeaways.section`
6. Type: **Repeatable component**
7. Click **Finish**

### SEO (Component)

1. Click **Add another field**
2. Select **Component**
3. Name: `seo`
4. Display name: `SEO`
5. Select **Use an existing component**: `shared.seo`
6. Type: **Single component**
7. Click **Finish**

### Sitemap (Component)

1. Click **Add another field**
2. Select **Component**
3. Name: `sitemap`
4. Display name: `Sitemap`
5. Select **Use an existing component**: `shared.sitemap`
6. Type: **Single component**
7. Click **Finish**

---

## Step 4: Save and Restart Strapi

1. Click **Save** (top right)
2. Restart Strapi server:
   ```bash
   cd /Users/joshuathompson/strapi/strapi
   npm run develop
   ```

---

## Step 5: Set Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click **Public**
3. Scroll to **Key-takeaways-page**
4. Enable:
   - ✅ `find`
5. Click **Save**

---

## Step 6: Add Content

1. Go to **Content Manager**
2. Click **Key Takeaways Page** (Single Type)
3. Fill in the fields:

### Page Hero

- **Kicker**: `KEY TAKEAWAYS`
- **Heading**: `Key Takeaways`
- **Subtitle**: `Download your key takeaways from recent clinics and holidays with Active Away.`
- **Background Image**: Upload a tennis/sports image
- **Show Breadcrumbs**: ✅ true

### Sections

Create sections for different event types:

#### Example Section 1: UK Events - Clinics

- **Category Label**: `UK EVENTS`
- **Section Title**: `Clinics`
- **Description**: `Download your key takeaways from your recent clinic with Active Away.`
- **Items**:
  1. **Video Item**:
     - Type: `video`
     - Title: `Baseline Brilliance`
     - Description: `How to find your rhythm and timing from the back of the court.`
     - YouTube URL: `https://www.youtube.com/watch?v=VIDEO_ID`
  
  2. **PDF Item**:
     - Type: `pdf-download`
     - Title: `Tennis Clinics - Saturday (Day 1 of 2)`
     - Description: `Download your key takeaways PDF`
     - PDF File: Upload PDF file
     - PDF Label: (optional) `Download PDF`

#### Example Section 2: Overseas - Tennis Holidays

- **Category Label**: `OVERSEAS`
- **Section Title**: `Tennis Holidays`
- **Description**: `Watch the key takeaways videos from all the sessions on your Tennis Holiday!`
- **Items**:
  1. **Video Item**:
     - Type: `video`
     - Title: `Triple Threat`
     - Description: `Being able to perfect the first 3 shots!`
     - YouTube URL: `https://www.youtube.com/watch?v=VIDEO_ID`
  
  2. **Video Item**:
     - Type: `video`
     - Title: `Dynamic Doubles`
     - Description: `Different formations you can use in your game!`
     - YouTube URL: `https://www.youtube.com/watch?v=VIDEO_ID`

#### Example Section 3: Padel Holidays

- **Category Label**: `OVERSEAS`
- **Section Title**: `Padel Holidays`
- **Description**: `Download a PDF with all of the key takeaways from your Padel Holiday!`
- **Items**:
  1. **PDF Item**:
     - Type: `pdf-download`
     - Title: `Padel Holidays - Key Takeaways`
     - Description: `Complete guide from your padel holiday`
     - PDF File: Upload PDF file

### SEO

- **Meta Title**: `Key Takeaways - Active Away`
- **Meta Description**: `Download your key takeaways from recent clinics and holidays with Active Away. Watch videos and download PDF guides.`
- **Keywords**: `tennis key takeaways, clinic videos, tennis holidays, padel holidays, pickleball`
- **Canonical URL**: `https://activeaway.com/keytakeaways`

---

## Step 7: Publish

Click **Save** and **Publish** (top right)

---

## Step 8: Verify API Response

Test the API endpoint:
```
https://your-strapi-url.com/api/key-takeaways-page?populate[pageHero][populate]=*&populate[sections][populate][items][populate]=*&populate[seo][populate]=*
```

---

## Example JSON Structure

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "pageHero": {
        "kicker": "KEY TAKEAWAYS",
        "heading": "Key Takeaways",
        "subtitle": "Download your key takeaways from recent clinics and holidays with Active Away.",
        "backgroundImage": {
          "data": {
            "attributes": {
              "url": "/uploads/hero_image.jpg",
              "alternativeText": "Active Away Key Takeaways"
            }
          }
        },
        "showBreadcrumbs": true
      },
      "sections": [
        {
          "id": 1,
          "categoryLabel": "UK EVENTS",
          "sectionTitle": "Clinics",
          "description": "Download your key takeaways from your recent clinic with Active Away.",
          "items": [
            {
              "id": 1,
              "type": "video",
              "title": "Baseline Brilliance",
              "description": "How to find your rhythm and timing from the back of the court.",
              "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
              "pdfFile": null,
              "pdfLabel": null
            },
            {
              "id": 2,
              "type": "pdf-download",
              "title": "Tennis Clinics - Saturday (Day 1 of 2)",
              "description": null,
              "youtubeUrl": null,
              "pdfFile": {
                "data": {
                  "attributes": {
                    "url": "/uploads/clinic_takeaways.pdf",
                    "name": "clinic_takeaways.pdf"
                  }
                }
              },
              "pdfLabel": "Key Takeaways"
            }
          ]
        },
        {
          "id": 2,
          "categoryLabel": "OVERSEAS",
          "sectionTitle": "Tennis Holidays",
          "description": "Watch the key takeaways videos from all the sessions on your Tennis Holiday!",
          "items": [
            {
              "id": 3,
              "type": "video",
              "title": "Triple Threat",
              "description": "Being able to perfect the first 3 shots!",
              "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
              "pdfFile": null,
              "pdfLabel": null
            }
          ]
        }
      ],
      "seo": {
        "metaTitle": "Key Takeaways - Active Away",
        "metaDescription": "Download your key takeaways from recent clinics and holidays with Active Away.",
        "keywords": "tennis key takeaways, clinic videos",
        "canonicalURL": "https://activeaway.com/keytakeaways"
      }
    }
  }
}
```

---

## Content Tips

### YouTube URLs
The system accepts any YouTube URL format:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### PDF Files
- Recommended file size: Under 10MB for fast loading
- File format: PDF only
- Upload directly through Strapi's media library

### Section Organization
- Use **categoryLabel** for top-level groupings (UK EVENTS, OVERSEAS)
- Use **sectionTitle** for specific event types (Clinics, Tennis Holidays, Padel Holidays)
- Mix video and PDF items within the same section as needed

### Video Grid Layout
- Videos display in a 2-column grid on desktop
- Videos display in a 1-column grid on mobile
- Each video shows YouTube thumbnail with play button overlay
- Click to load full video player

### PDF Download Layout
- PDFs display as a vertical list
- Each item shows PDF icon, title, and download icon
- Clicking downloads the PDF file
- Hover effect highlights the item

---

## Page URL

The page will be accessible at:
```
https://activeaway.com/keytakeaways
```

---

## Notes

- Videos use YouTube's privacy-enhanced mode (`youtube-nocookie.com`)
- Videos load on-click to improve page performance
- PDFs are served directly from Strapi's media library
- All content is managed through Strapi CMS
- Page uses static rendering for optimal performance

