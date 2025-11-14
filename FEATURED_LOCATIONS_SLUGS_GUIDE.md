# How to Add Featured Location Slugs in Strapi

## 📍 What is featuredLocationSlugs?

The `featuredLocationSlugs` field allows you to specify which locations to show in the Destinations section of your product page, instead of showing all featured locations.

---

## 🔧 Field Type: JSON

The field is a **JSON field**, so you need to enter it as a JSON array.

---

## ✏️ How to Use in Strapi

### Option 1: Show All Featured Locations (Default)

**Leave the field EMPTY** or **null**

This will show all locations that have `featured: true` in the Featured Locations content type.

---

### Option 2: Show Specific Locations

Enter a **JSON array** of location slugs:

```json
["adult-tennis-holiday-5-sani-beach", "adult-tennis-holiday-5-aphrodite-hills", "adult-tennis-holiday-4-beach-club"]
```

### Example in Strapi:

1. Go to your **Product Page** entry
2. Expand the **destinations** component
3. In the **featuredLocationSlugs** field, enter:

```json
["adult-tennis-holiday-5-sani-beach", "adult-tennis-holiday-5-aphrodite-hills", "adult-tennis-holiday-4-beach-club"]
```

This will show only these 3 locations in the carousel.

---

## 📋 Finding Location Slugs

To find the slugs of your locations:

### Method 1: Check Strapi
1. Go to **Content Manager** → **Featured Location**
2. Open a location entry
3. Copy the **slug** field value

### Method 2: Check API
Visit: https://strapi-production-b96d.up.railway.app/api/featured-locations

You'll see all locations with their slugs.

### Method 3: Check Your Site
Visit any location page - the URL will be: `/tennis-holiday/[slug]`

---

## 📝 Valid JSON Format

### ✅ Correct Format:

```json
["slug-one", "slug-two", "slug-three"]
```

### ❌ Incorrect Formats:

```
slug-one, slug-two                  ❌ No commas without JSON array
['slug-one', 'slug-two']            ❌ Use double quotes, not single
["slug-one" "slug-two"]             ❌ Missing commas
```

---

## 🎯 Example Use Cases

### Show Only 5-Star Properties:
```json
["adult-tennis-holiday-5-sani-beach", "adult-tennis-holiday-5-aphrodite-hills", "adult-tennis-holiday-5-ikos-aria"]
```

### Show Only UK Locations:
```json
["adult-tennis-holiday-4-lensbury"]
```

### Show Mixed Destinations:
```json
["adult-tennis-holiday-5-sani-beach", "adult-tennis-holiday-4-beach-club", "adult-tennis-holiday-5-liberty-lykia"]
```

---

## 🔄 How It Works

1. If `featuredLocationSlugs` is **empty/null** → shows all featured locations
2. If `featuredLocationSlugs` has **values** → filters to show only those specific locations
3. The **order matters** - locations will appear in the order you list them

---

## 💡 Pro Tips

- **Maximum 3-4 locations** work best for the carousel (shows 3 per page on desktop)
- Use locations relevant to the product category (e.g., only tennis holidays on tennis page)
- Keep the array valid JSON (use a JSON validator if needed)
- You can update this anytime without touching code

---

## ✨ Current Behavior

Right now, since the field is **empty** in your product page, it shows **all** featured locations from Strapi that have `featured: true`.

To filter, just add the slugs as shown above!

