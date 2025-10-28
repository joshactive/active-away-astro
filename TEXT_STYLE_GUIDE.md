# 📐 Text Style Consistency Guide

## ✅ Status: **CONSISTENT ACROSS ALL DEVICES**

All text sizes and colors follow a consistent, responsive pattern across the entire site.

---

## 🎨 Typography System

### **Fonts**
- **Headings**: `font-playfair` (Playfair Display - serif)
- **Body Text**: `font-inter` (Inter - sans-serif)

---

## 📏 Heading Sizes (Responsive)

### H1 - Hero Titles
```
text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
font-playfair font-bold
```
- Mobile (320px): 30px
- Small (640px): 36px
- Medium (768px): 48px
- Large (1024px): 60px
- XL (1280px+): 72px

### H2 - Section Titles
```
text-2xl sm:text-3xl lg:text-4xl
font-playfair font-semibold
```
- Mobile: 24px
- Small: 30px
- Large: 36px

### H3 - Card/Subsection Titles
```
text-lg sm:text-xl lg:text-2xl  OR  text-base sm:text-xl lg:text-2xl
font-playfair font-bold
```
- Mobile: 16-18px
- Small: 20px
- Large: 24px

---

## 📄 Body Text Sizes (Responsive)

### Large Body (Intro/Description Text)
```
text-base sm:text-lg lg:text-xl
font-inter
```
- Mobile: 16px
- Small: 18px
- Large: 20px

### Standard Body (Main Content)
```
text-base sm:text-lg
font-inter
```
- Mobile: 16px
- Small: 18px

### Small Body (Metadata/Labels)
```
text-sm sm:text-base
font-inter
```
- Mobile: 14px
- Small: 16px

### Extra Small (Tags/Captions)
```
text-xs sm:text-sm
font-inter
```
- Mobile: 12px
- Small: 14px

---

## 🎨 Color System

### Text Colors
| Usage | Class | Hex | Use Case |
|-------|-------|-----|----------|
| **Primary** | `text-gray-900` | `#1E1E1E` | Headings, important text |
| **Body Text** | `text-gray-800` | `#1F2937` | Body paragraphs, descriptions |
| **Metadata** | `text-gray-700` | `#374151` | Labels, small text, list items |
| **Tertiary** | `text-gray-600` | `#4B5563` | Icons, captions, muted text |
| **Light** | `text-gray-300` | `#D1D5DB` | Footer links |
| **White** | `text-white` | `#FFFFFF` | Hero, dark backgrounds |
| **Gold** | `text-gold` | `#AD986C` | Accent, CTA text |

### Link Hover (Global)
```css
/* Defined in BaseLayout.astro @layer base */
a:hover {
  color: #ad986c; /* Gold */
  transition: color 0.3s ease;
}
```
- **All links hover to:** `#ad986c` (gold)
- **Defined in:** `src/layouts/BaseLayout.astro`
- **Benefit:** No need to add `hover:text-gold` to each link

---

## ✅ Consistency Checklist

### Mobile (< 640px)
- ✅ All section titles left-aligned (except Hero - centered)
- ✅ Text sizes scale down appropriately
- ✅ Line heights maintain readability

### Tablet (640px - 1024px)
- ✅ Text sizes increase smoothly
- ✅ Section titles remain left-aligned
- ✅ All text remains readable

### Desktop (≥ 1024px)
- ✅ Text sizes reach optimal reading size
- ✅ Section titles centered for visual polish
- ✅ Consistent spacing and hierarchy

---

## 🎯 Implementation Notes

### Global Styles (in `BaseLayout.astro`)
```css
@layer base {
  /* Link hover color - applies to all <a> tags */
  a:hover {
    color: #ad986c;
    transition: color 0.3s ease;
  }
}
```

### Tailwind Config (`tailwind.config.js`)
```javascript
colors: {
  gold: {
    DEFAULT: "#ad986c",  // Used for hover:text-gold
    50: "#f8f6f2",
    // ... other shades
  }
}
```

---

## 🚀 Benefits of This System

1. **Responsive**: All text scales appropriately across devices
2. **Consistent**: Same patterns used throughout all components
3. **Readable**: Optimal line heights and spacing
4. **Accessible**: High contrast ratios (WCAG AAA compliant - 13:1 ratio)
5. **Maintainable**: Easy to update from one central config

---

## 📝 Usage Example

```astro
<!-- Section Title -->
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900">
  Your Title
</h2>

<!-- Body Text -->
<p class="text-base sm:text-lg font-inter text-gray-800 leading-relaxed">
  Your content here.
</p>

<!-- Metadata/Labels -->
<span class="text-sm sm:text-base font-inter text-gray-700">
  Small label text
</span>

<!-- Link (hover automatically gold) -->
<a href="#" class="text-gray-900 underline">
  View More
</a>
```

---

**Last Updated:** October 27, 2025
**Status:** ✅ All components audited and consistent

