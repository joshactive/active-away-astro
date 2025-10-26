# Cloudflare Images Integration

## 🚀 Dynamic Image Loading System

এই সিস্টেমটি Cloudflare Images API ব্যবহার করে dynamic image loading এবং optimization প্রদান করে।

## 📁 File Structure

```
src/
├── utils/
│   └── cloudflareImages.js    # Main utility functions
├── components/
│   └── Hero.astro            # Example implementation
public/
├── images/                   # Local fallback images
│   └── hero/
│       ├── hero-bg.jpg
│       └── logo.png
└── test-cloudflare.js        # Test script
```

## 🔧 Configuration

### Account Hash
```javascript
const CLOUDFLARE_ACCOUNT_HASH = '5da451ea4290f2abb8eefa1ccf322041';
```

### Image Mapping
```javascript
const IMAGE_MAPPING = {
  'hero/hero-bg.jpg': '03bade93-3cf6-49b0-047f-a9eb556aa200',
  'hero/logo.png': 'eedabea1-97ba-419d-35b4-98a08f3d0300',
  // Add more mappings as needed
};
```

## 📖 Usage

### Basic Usage
```javascript
import { getCloudflareImageUrl } from '../utils/cloudflareImages.js';

// Get optimized image URL
const imageUrl = getCloudflareImageUrl('hero/hero-bg.jpg', {
  width: 1920,
  height: 1080,
  quality: 90,
  format: 'auto'
});
```

### With Fallback
```javascript
const imageData = getCloudflareImageUrl('hero/hero-bg.jpg', {
  width: 1920,
  quality: 90,
  fallback: true
});

const imageUrl = typeof imageData === 'object' && imageData.hasCloudflare 
  ? imageData.cloudflare 
  : imageData.fallback;
```

### Responsive Images
```javascript
import { generateSrcSet } from '../utils/cloudflareImages.js';

const srcset = generateSrcSet('hero/hero-bg.jpg', [
  { width: 480, quality: 75 },
  { width: 768, quality: 80 },
  { width: 1200, quality: 85 },
  { width: 1920, quality: 90 }
]);
```

## 🎯 Features

### ✅ Image Optimization
- **Automatic format selection** (WebP, AVIF, JPEG, PNG)
- **Quality optimization** (1-100)
- **Size optimization** (width/height)
- **Fit options** (cover, contain, fill, inside, outside)

### ✅ Responsive Images
- **Multiple breakpoints** support
- **Srcset generation** for different screen sizes
- **Lazy loading** support

### ✅ Fallback System
- **Local image fallback** if Cloudflare fails
- **Error handling** with onerror attributes
- **Graceful degradation**

### ✅ Performance
- **CDN delivery** through Cloudflare
- **Global edge caching**
- **Automatic compression**

## 🔄 Adding New Images

### Step 1: Upload to Cloudflare
1. Upload image to Cloudflare Images dashboard
2. Copy the image ID

### Step 2: Update Mapping
```javascript
// In src/utils/cloudflareImages.js
const IMAGE_MAPPING = {
  'hero/hero-bg.jpg': '03bade93-3cf6-49b0-047f-a9eb556aa200',
  'hero/logo.png': 'eedabea1-97ba-419d-35b4-98a08f3d0300',
  'events/event-1.jpg': 'new-cloudflare-id-here', // Add new mapping
};
```

### Step 3: Use in Component
```astro
---
import { getCloudflareImageUrl } from '../utils/cloudflareImages.js';

const eventImageUrl = getCloudflareImageUrl('events/event-1.jpg', {
  width: 400,
  quality: 85
});
---

<img src={eventImageUrl} alt="Event" />
```

## 🧪 Testing

### Browser Console Test
```javascript
// Load test script
const script = document.createElement('script');
script.src = '/test-cloudflare.js';
document.head.appendChild(script);
```

### Manual Test
1. Open browser developer tools
2. Check Network tab for image requests
3. Verify Cloudflare URLs are being used
4. Test fallback by blocking Cloudflare requests

## 🚨 Error Handling

### Common Issues
1. **Image not found**: Check image mapping
2. **CORS errors**: Verify Cloudflare settings
3. **Slow loading**: Check image optimization settings

### Debug Mode
```javascript
// Enable debug logging
console.log('Cloudflare Images Debug Mode');
```

## 📊 Performance Benefits

- **50-80% smaller file sizes** with WebP/AVIF
- **Global CDN delivery** for faster loading
- **Automatic optimization** based on device
- **Lazy loading** for better performance

## 🔮 Future Enhancements

- [ ] Automatic image upload to Cloudflare
- [ ] Image transformation API
- [ ] Analytics integration
- [ ] A/B testing for image formats
- [ ] Progressive loading
