# 🚀 Quick Start: Import Navigation Menu Data

This guide shows you how to quickly populate your navigation menu in Strapi with all the Active Away destinations and links.

---

## ⚡ Quick Instructions

### 1. Navigate to Strapi Directory
```bash
cd /Users/joshuathompson/strapi/strapi
```

### 2. Run the Import Script
```bash
node scripts/import-navigation-menu.js
```

### 3. Done! 🎉

The script will automatically:
- ✅ Add 8 "Dates Find Your Next" links
- ✅ Add 3 "About" menu items (Meet Active Away, Jamie Murray, Dragons' Den)
- ✅ Add 7 destination categories with 42 total destinations
- ✅ Publish everything so it's live immediately

---

## 📊 What Gets Imported

### Dates Menu (8 items)
- Tennis Holiday, UK Tennis Clinic, Padel Holiday, Pickleball Holiday, Play & Watch Event, School Tennis Tour, Ski Holiday, View All Destinations

### About Menu (3 items)
- Meet Active Away, Jamie Murray, Dragons' Den

### Destinations (7 categories, 42 destinations)
- **Tennis Holidays** (16) - Cyprus, Corfu, Crete, Dubai, Greece, Kos, Mallorca, Portugal, Turkey, USA, UK
- **Tennis Clinics** (11) - All David Lloyd locations + St George's Hill LTC
- **Junior Tennis Camps** (2) - UK locations
- **Pickleball** (2) - Crete, Portugal
- **Play & Watch** (1) - Barcelona Open
- **School Tennis Tours** (8) - Cyprus, Greece, Mallorca, Portugal, Spain, Turkey
- **Ski Holidays** (2) - Italy locations

---

## 🖼️ Next Steps: Add Images

After importing, you need to manually add images for the 3 About menu items:

1. Open Strapi Admin: http://localhost:1337/admin
2. Go to: **Content Manager → Navigation Menu**
3. Scroll to: **About Mega Menu Items**
4. For each item, click the **+** button to upload an image:
   - **Meet Active Away** - Company/team photo (600×400px)
   - **Jamie Murray** - Photo of Jamie Murray (600×400px)
   - **Dragons' Den** - Dragons' Den related image (600×400px)
5. Click **Save** and **Publish**

---

## 🔄 Re-running the Script

Safe to run multiple times! It will update existing data rather than duplicate it.

---

## 📖 Full Documentation

For detailed information, see:
- `/Users/joshuathompson/strapi/strapi/NAVIGATION_MENU_IMPORT.md`

---

## 🎯 Expected Output

```
🚀 Starting navigation menu data import...

📝 Creating new navigation menu...
✅ Navigation menu created successfully!

📊 Summary:
   • Dates Find Your Next: 8 items
   • About Mega Menu Items: 3 items
   • Destination Categories: 7 categories
     - Tennis Holidays: 16 destinations
     - Tennis Clinics: 11 destinations
     - Junior Tennis Camps: 2 destinations
     - Pickleball: 2 destinations
     - Play & Watch: 1 destination
     - School Tennis Tours: 8 destinations
     - Ski Holidays: 2 destinations
   • Total Destinations: 42

🎉 Import complete! Navigation menu is now published and ready to use.
```

---

That's it! Your navigation menu is now fully populated. 🚀

