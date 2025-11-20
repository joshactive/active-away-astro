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
- **Prevents navigation**: Stops the card link click when toggling (card restructured with separate links)
- **Font-aware**: Re-checks after fonts load to ensure accurate detection
- **Smooth transitions**: Added CSS transitions for better UX

#### Card Structure Update:
Changed from having the entire card as a single link to having multiple clickable areas:
- Image is clickable
- Title is clickable
- "View Details" button is clickable
- "Read more" button works independently without triggering navigation

#### Implementation:
```javascript
const initReadMore = () => {
  const cards = document.querySelectorAll('.quick-link-card');
  
  cards.forEach((card) => {
    const description = card.querySelector(`[class*="quick-link-description-"]`);
    const readMoreBtn = card.querySelector(`[class*="read-more-btn-"]`);
    
    if (!description || !readMoreBtn) return;

    // Check if text is actually truncated
    const isTruncated = description.scrollHeight > description.clientHeight;
    
    if (isTruncated) {
      readMoreBtn.classList.remove('hidden');
      
      readMoreBtn.addEventListener('click', function(e) {
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
  });
};

// Run after delay to ensure styles are applied
setTimeout(initReadMore, 100);
if (document.fonts) {
  document.fonts.ready.then(() => setTimeout(initReadMore, 100));
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

