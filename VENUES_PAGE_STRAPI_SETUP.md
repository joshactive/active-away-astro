# Venues Page - Strapi Setup Guide

This guide will help you set up the Strapi single type for the Venues page with all the necessary fields.

## Step 1: Create the Single Type in Strapi

1. **Go to Strapi Admin Panel**
   - Navigate to `http://localhost:1337/admin`
   - Login with your admin credentials

2. **Create Single Type**
   - Click on "Content-Type Builder" in the left sidebar
   - Click "+ Create new single type"
   - Name: `venues-page`
   - Display Name: `Venues Page`
   - Click "Continue"

## Step 2: Add Fields to Venues Page

### Hero Section Fields

1. **Hero Background Image**
   - Field name: `heroBackgroundImage`
   - Type: Media (Single)
   - Advanced Settings:
     - Required: Yes
   - Click "Finish"

2. **Hero Title**
   - Field name: `heroTitle`
   - Type: Text (Short text)
   - Default value: `Explore All Venues`
   - Advanced Settings:
     - Required: Yes
   - Click "Finish"

3. **Hero Subtitle**
   - Field name: `heroSubtitle`
   - Type: Text (Long text)
   - Default value: `Discover our complete collection of tennis, padel, pickleball, and ski holidays across the world. Filter by type, location, and price to find your perfect getaway.`
   - Advanced Settings:
     - Required: Yes
   - Click "Finish"

4. **Hero Kicker Text**
   - Field name: `heroKicker`
   - Type: Text (Short text)
   - Default value: `ALL DESTINATIONS`
   - Advanced Settings:
     - Required: No
   - Click "Finish"

### Meta Information

5. **Page Title (SEO)**
   - Field name: `pageTitle`
   - Type: Text (Short text)
   - Default value: `All Venues - Active Away`
   - Advanced Settings:
     - Required: Yes
   - Click "Finish"

6. **Meta Description (SEO)**
   - Field name: `metaDescription`
   - Type: Text (Long text)
   - Default value: `Explore all our tennis, padel, pickleball, and ski holiday destinations. Find your perfect vacation with expert hosts and exceptional service.`
   - Advanced Settings:
     - Required: Yes
     - Max length: 160
   - Click "Finish"

### Optional Content Fields (Future Enhancement)

7. **Featured Section Title**
   - Field name: `featuredSectionTitle`
   - Type: Text (Short text)
   - Advanced Settings:
     - Required: No
   - Click "Finish"

8. **Featured Section Description**
   - Field name: `featuredSectionDescription`
   - Type: Text (Long text)
   - Advanced Settings:
     - Required: No
   - Click "Finish"

## Step 3: Save & Configure

1. Click **"Save"** in the top right
2. Wait for Strapi to restart (this may take 30-60 seconds)

## Step 4: Add Content

1. Go to "Content Manager" in left sidebar
2. Click on "Venues Page" under "Single Types"
3. Fill in all the fields:
   - Upload a hero background image (landscape, min 1920x1080px recommended)
   - Enter the hero title
   - Enter the hero subtitle
   - Enter the kicker text
   - Set page title and meta description
4. Click **"Save"** then **"Publish"**

## Step 5: Set Permissions

1. Go to "Settings" → "Roles" → "Public"
2. Scroll down to "Venues-page"
3. Check the box for **"find"**
4. Click **"Save"**

## Recommended Hero Image Settings

- **Dimensions:** 1920x1080px or larger
- **Aspect Ratio:** 16:9 or wider
- **Format:** JPEG or WebP
- **File Size:** < 500KB (after optimization)
- **Subject:** Tennis/padel courts, resort views, or sports action shots
- **Tips:** 
  - Image should work with dark overlay
  - Keep important content in center
  - Avoid busy backgrounds that compete with text

## Field Structure Overview

```
venues-page (Single Type)
├── heroBackgroundImage (Media)
├── heroTitle (Text)
├── heroSubtitle (Text)
├── heroKicker (Text)
├── pageTitle (Text)
├── metaDescription (Text)
├── featuredSectionTitle (Text) - Optional
└── featuredSectionDescription (Text) - Optional
```

## Testing the API

Once set up, you can test the API endpoint:

```bash
# Get venues page data
curl http://localhost:1337/api/venues-page?populate=*
```

Expected response structure:
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "heroTitle": "Explore All Venues",
      "heroSubtitle": "Discover our complete collection...",
      "heroKicker": "ALL DESTINATIONS",
      "pageTitle": "All Venues - Active Away",
      "metaDescription": "Explore all our tennis...",
      "heroBackgroundImage": {
        "data": {
          "id": 123,
          "attributes": {
            "url": "https://...",
            "alternativeText": "...",
            "width": 1920,
            "height": 1080
          }
        }
      }
    }
  }
}
```

## Next Steps

After setting up the Strapi single type:

1. Add content in Strapi admin
2. The frontend code will automatically fetch and display this content
3. Update content anytime through Strapi admin - changes will reflect immediately

## Troubleshooting

**Issue:** Can't see the venues-page in Content Manager
- **Solution:** Make sure you saved the content type and Strapi restarted successfully

**Issue:** Getting 403 Forbidden when fetching
- **Solution:** Check that "find" permission is enabled for Public role

**Issue:** heroBackgroundImage is null
- **Solution:** Make sure to use `populate=*` or `populate=heroBackgroundImage` in the API call

**Issue:** Image URL is relative, not absolute
- **Solution:** The code automatically handles this conversion - check the getStrapiImageData() function

