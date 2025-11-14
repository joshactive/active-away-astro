# Product Hero Layout Options

## ✅ Updates Complete

The Product Hero component now supports **3 different layout types**:

### 1. Fullscreen Background (Original)
- Full-width background image
- Centered text overlay
- Optional CTA button

### 2. Split-Screen with Image (NEW)
- Left: Content (kicker, heading, subheading, button)
- Right: Static image
- Side-by-side layout on desktop, stacked on mobile

### 3. Split-Screen with Video (NEW)
- Left: Content (kicker, heading, subheading, button)
- Right: YouTube video embed
- Click-to-play video functionality
- Automatic thumbnail loading

---

## 🎨 How to Use in Strapi

### Step 1: Restart Strapi

The schema has been updated, so restart Strapi to see the new fields:

```bash
cd /Users/joshuathompson/strapi/strapi
npm run develop
```

### Step 2: Edit Your Product Page Hero

In your Product Page entry, expand the **hero** component and you'll see new fields:

#### New Fields:

1. **Media Type** (Dropdown)
   - `fullscreen-background` - Original layout with full background image
   - `split-screen-image` - Split layout with image on right
   - `split-screen-video` - Split layout with video on right

2. **Button Text** (Text)
   - Example: `View Destinations`

3. **Button Link** (Text)
   - Example: `/venues` or `#destinations`

4. **Video URL** (Text)
   - YouTube URL (any format works):
     - `https://www.youtube.com/watch?v=VIDEO_ID`
     - `https://youtu.be/VIDEO_ID`
     - `https://www.youtube.com/embed/VIDEO_ID`

5. **Right Side Image** (Media)
   - Image to show on the right side (for split-screen-image layout)

---

## 📋 Configuration Examples

### Example 1: Split-Screen with Video (Like Reference)

```
Media Type: split-screen-video
Kicker: ADULT ONLY TENNIS HOLIDAYS
Heading: Tennis Holidays for Adults
Subheading: Unique Racket Experiences that unite like-minded individuals, through impeccable service delivered by truly knowledgeable hosts in excellent locations.
Button Text: View Destinations
Button Link: /venues
Video URL: https://www.youtube.com/watch?v=YOUR_VIDEO_ID
```

### Example 2: Split-Screen with Image

```
Media Type: split-screen-image
Kicker: ADULT ONLY TENNIS HOLIDAYS
Heading: Tennis Holidays for Adults
Subheading: Your description here...
Button Text: Learn More
Button Link: #about
Right Side Image: [Upload your image]
```

### Example 3: Fullscreen Background (Original)

```
Media Type: fullscreen-background
Kicker: ADULT ONLY TENNIS HOLIDAYS
Heading: Tennis Holidays for Adults
Subheading: Your description here...
Background Image: [Upload your image]
Button Text: Get Started (optional)
Button Link: /contact (optional)
```

---

## 🎯 Layout Behavior

### Desktop (lg and above):
- **Split-Screen**: Two columns, 50/50 split
- **Fullscreen**: Full-width background with centered overlay

### Mobile:
- **Split-Screen**: Stacked vertically (content on top, media below)
- **Fullscreen**: Same as desktop but smaller height

---

## 🎬 Video Features

- **Lazy Loading**: Video only loads when clicked (saves bandwidth)
- **YouTube Thumbnail**: Automatically fetches high-quality thumbnail
- **Play Button**: Large, centered play button overlay
- **Autoplay**: Video starts automatically when clicked
- **Responsive**: Works on all devices

---

## 🎨 Styling

The split-screen layout uses:
- **Background**: Navy blue (#0D1C4E)
- **Text**: White
- **Button**: Outlined white border, hover effect
- **Typography**: Same Playfair Display + Inter fonts

---

## 🚀 After Setting Up

1. **Save** your Product Page in Strapi
2. **Publish** the entry
3. **Rebuild** your Astro site:
   ```bash
   cd /Users/joshuathompson/active-away-astro
   npm run build
   ```
4. **Preview**: Visit your product page

---

## ✨ Tips

- **Video URLs**: Any YouTube URL format works - the component automatically extracts the video ID
- **Images**: For right-side images, use landscape orientation (16:9 or similar)
- **Button**: The button is optional - leave `buttonText` empty to hide it
- **Mobile**: Test on mobile - the layout stacks nicely on smaller screens

---

## 🔧 Technical Details

**Component**: `ProductHeroTailwind.astro`
**Schema**: `sections.product-hero`

The component automatically detects the `mediaType` and renders the appropriate layout. No additional configuration needed in the Astro code!

