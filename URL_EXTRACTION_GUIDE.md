# URL Extraction from Strapi - Guide

This guide explains how to extract all URLs from your Strapi CMS for validation, SEO audits, and URL management.

## Available Scripts

### 1. List URLs by Content Type (Recommended)

**Script:** `scripts/list-urls-by-type.js`

This script fetches all URLs for a specific content type from Strapi.

#### Usage:

```bash
# List all tennis holiday URLs
node scripts/list-urls-by-type.js tennis-holiday

# List all junior tennis camp URLs  
node scripts/list-urls-by-type.js junior-tennis-camp

# List all ski holiday URLs
node scripts/list-urls-by-type.js ski-holiday

# List all padel tennis holiday URLs
node scripts/list-urls-by-type.js padel-tennis-holiday

# Show help
node scripts/list-urls-by-type.js --help
```

#### Available Content Types:

- `tennis-holiday` - Tennis holiday pages
- `tennis-clinic` - Tennis clinic pages
- `junior-tennis-camp` - Junior tennis camp pages
- `school-tennis-tour` - School tennis tour pages
- `ski-holiday` - Ski holiday pages
- `padel-tennis-holiday` - Padel tennis holiday pages
- `pickleball-holiday` - Pickleball holiday pages
- `play-watch` - Play & Watch pages
- `tennis-academy` - Tennis academy pages
- `form` - Form pages
- `faq-category` - FAQ category pages
- `pre-order` - Pre-order pages
- `group-organiser` - Group organiser pages
- `blog` - Blog posts
- `pages` - Single/static pages

#### Example Output:

```
🔍 Fetching URLs for: tennis-holiday

Found 28 URLs:

================================================================================
/tennis-holiday/adult-tennis-break-5-hilton-vilamoura
/tennis-holiday/adult-tennis-holiday-4-beach-club
/tennis-holiday/adult-tennis-holiday-4-daphnila-bay
/tennis-holiday/adult-tennis-holiday-5-aphrodite-hills
...
================================================================================

✅ Total: 28 URLs
```

### 2. Extract All URLs (Comprehensive)

**Script:** `scripts/extract-strapi-urls.js`

This script fetches ALL URLs from Strapi and organizes them by category.

#### Usage:

```bash
# Default format (organized by category)
node scripts/extract-strapi-urls.js

# Output as JSON
node scripts/extract-strapi-urls.js --format=json

# Simple list (one URL per line)
node scripts/extract-strapi-urls.js --format=list

# Filter by specific group
node scripts/extract-strapi-urls.js --group=tennis-holiday
```

#### Output Formats:

1. **Text (Default)** - Organized by category with counts
2. **JSON** - Structured JSON for programmatic use
3. **List** - Simple list, one URL per line (great for copying)

## Common Use Cases

### 1. Validate All Tennis Holiday URLs

```bash
node scripts/list-urls-by-type.js tennis-holiday > tennis-holiday-urls.txt
```

This creates a text file with all tennis holiday URLs that you can:
- Compare against your WordPress migration
- Verify in browser tests
- Share with your team
- Use for SEO audits

### 2. Get URLs for Multiple Content Types

```bash
# Tennis holidays
node scripts/list-urls-by-type.js tennis-holiday > urls/tennis-holidays.txt

# Junior camps
node scripts/list-urls-by-type.js junior-tennis-camp > urls/junior-camps.txt

# Ski holidays
node scripts/list-urls-by-type.js ski-holiday > urls/ski-holidays.txt
```

### 3. Export as JSON for Processing

```bash
node scripts/extract-strapi-urls.js --format=json > all-urls.json
```

Then you can process this JSON file with other tools or scripts.

### 4. Quick URL Count Check

```bash
node scripts/list-urls-by-type.js tennis-holiday | grep "Total:"
```

## Permissions Note

Some content types may return 403 Forbidden errors when running these scripts locally. This is because:

1. They require authentication in Strapi
2. They have restricted public API access

The scripts will still work for publicly accessible content types like:
- ✅ tennis-holiday
- ✅ junior-tennis-camp
- ✅ ski-holiday
- ✅ padel-tennis-holiday
- ✅ play-watch
- ✅ blog

## Comparing with Your URL List

You can use `diff` to compare extracted URLs with your expected list:

```bash
# Extract current URLs from Strapi
node scripts/list-urls-by-type.js tennis-holiday | grep "^/" > current-urls.txt

# Create expected-urls.txt with your list
# Then compare:
diff expected-urls.txt current-urls.txt
```

## Integration with Testing

You can integrate this with your browser testing:

```bash
# Extract all tennis holiday URLs
node scripts/list-urls-by-type.js tennis-holiday --format=list > test-urls.txt

# Then use in a test script to validate each URL
```

## Tips

1. **Save outputs** - Pipe results to text files for reference
2. **JSON format** - Use JSON format when you need to process URLs programmatically
3. **Redirect stderr** - Use `2>&1` to capture all output including errors
4. **Filter results** - Use `grep`, `sort`, `uniq` to process output

## Example: Complete URL Audit

```bash
#!/bin/bash

# Create output directory
mkdir -p url-audit

# Extract URLs for all main content types
echo "Extracting URLs from Strapi..."

node scripts/list-urls-by-type.js tennis-holiday > url-audit/tennis-holidays.txt
node scripts/list-urls-by-type.js junior-tennis-camp > url-audit/junior-camps.txt
node scripts/list-urls-by-type.js ski-holiday > url-audit/ski-holidays.txt
node scripts/list-urls-by-type.js padel-tennis-holiday > url-audit/padel-holidays.txt

echo "✅ URL audit complete! Check url-audit/ directory"
```

## Troubleshooting

### "Cannot find module" error
Make sure you're running the script from the project root:
```bash
cd /Users/joshuathompson/active-away-astro
node scripts/list-urls-by-type.js tennis-holiday
```

### "403 Forbidden" errors
This is normal for some content types that require authentication. Focus on the publicly accessible types.

### No URLs returned
Check that:
1. Strapi is running and accessible
2. The content type name is correct
3. There are published entries in Strapi for that content type

## Summary

These scripts provide an easy way to:
- ✅ Extract all URLs from Strapi
- ✅ Validate your URL structure
- ✅ Compare with expected URLs
- ✅ Audit SEO and URL patterns
- ✅ Generate URL lists for testing

For most use cases, `list-urls-by-type.js` is the best choice as it's simple and focused.







