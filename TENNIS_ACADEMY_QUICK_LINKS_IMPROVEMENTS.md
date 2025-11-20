# Tennis Academy Quick Links Improvements

## Overview
Enhanced the Tennis Academy Quick Links section to handle different numbers of cards more gracefully and added a "read more" functionality for truncated text.

## Changes Made

### 1. Improved Grid Layout
The grid now handles different numbers of cards more elegantly:

- **1 card**: Centered single column (max-width: md)
- **2 cards**: 1 column on mobile, 2 columns on sm+ (max-width: 3xl)
- **3 cards**: 1 column on mobile, 2 on sm+, 3 on lg+
- **4 cards**: 1 column on mobile, 2 on sm+, 4 on lg+
- **5 cards**: 1 column on mobile, 2 on sm+, 3 on lg+, 5 on xl+ (NEW)
- **6+ cards**: Default to 3 columns on large screens

### Grid Classes Applied:
```html
<div class={`grid gap-6 ${
  academyData.quickLinks.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
  academyData.quickLinks.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto' :
  academyData.quickLinks.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
  academyData.quickLinks.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
  academyData.quickLinks.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' :
  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
}`}>
```

### 2. Read More Functionality
Added intelligent "read more" / "read less" toggle for truncated descriptions:

#### Features:
- **Automatic detection**: Checks if text is actually truncated before showing button
- **Toggle behavior**: Click to expand/collapse text
- **Visual feedback**: Button text changes between "Read more" and "Read less"
- **Prevents navigation**: Stops the card link click when toggling
- **Font-aware**: Re-checks after fonts load to ensure accurate detection

#### Implementation:
```javascript
// Check if text is clamped (truncated)
const lineHeight = parseInt(window.getComputedStyle(description).lineHeight);
const maxHeight = lineHeight * 3; // 3 lines

if (description.scrollHeight > maxHeight) {
  readMoreBtn.classList.remove('hidden');
  
  readMoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (description.classList.contains('line-clamp-3')) {
      description.classList.remove('line-clamp-3');
      readMoreBtn.textContent = 'Read less';
    } else {
      description.classList.add('line-clamp-3');
      readMoreBtn.textContent = 'Read more';
    }
  });
}
```

## Benefits

### Better Card Layouts
- 5 cards now display beautifully in a 5-column layout on extra-large screens
- Better use of screen space across all device sizes
- More professional appearance for varying content amounts

### Enhanced UX
- Users can expand truncated text without leaving the page
- Only shows "read more" button when text is actually truncated
- Smooth toggle between expanded and collapsed states
- Doesn't interfere with the main card link functionality

## Testing Recommendations

1. Test with 1-7 cards to ensure all layouts work correctly
2. Verify "read more" appears only when text is truncated
3. Check that clicking "read more" doesn't trigger card navigation
4. Test on different screen sizes (mobile, tablet, desktop, xl desktop)
5. Verify behavior after fonts load

## File Modified
- `/src/components/TennisAcademyDetail.astro`

## Notes
- The read more button uses the gold color (#ad986c) to match the brand
- Font-aware checking ensures accuracy across different font loading scenarios
- The grid gracefully degrades on smaller screens

