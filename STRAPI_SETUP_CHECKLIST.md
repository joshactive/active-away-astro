# 📋 Strapi Setup Checklist - Navigation Menu

Follow these steps to get your navigation menu working with Strapi.

---

## ✅ Step 1: Restart Strapi

Strapi needs to restart to recognize the new component files.

```bash
cd /Users/joshuathompson/strapi/strapi
npm run develop
```

Wait for Strapi to fully start (you'll see "Server started" message).

---

## ✅ Step 2: Verify Components Are Loaded

1. Open Strapi Admin: `http://localhost:1337/admin`
2. Go to **Content-Types Builder**
3. Check under **Components** → You should see:
   - `navigation.menu-item` ✅
   - `navigation.text-link` ✅ (NEW)
   - `navigation.mega-menu-item` ✅
   - `navigation.destination-category` ✅ (NEW)
   - `navigation.destination-item` ✅ (NEW)

---

## ✅ Step 3: Verify Single Type Exists

1. In **Content-Types Builder**
2. Look under **Single Types**
3. Find **Navigation Menu** ✅
4. Click on it to verify all fields:

### Main Fields:
- [ ] `menuItems` (Component: navigation.menu-item, repeatable)

### Dates Menu:
- [ ] `datesFindYourNext` (Component: navigation.text-link, repeatable)
- [ ] `datesUsefulLinks` (Component: navigation.text-link, repeatable)

### Rackets Menu:
- [ ] `racketsMegaMenuItems` (Component: navigation.mega-menu-item, repeatable)

### About Us Menu:
- [ ] `aboutMegaMenuItems` (Component: navigation.mega-menu-item, repeatable)
- [ ] `aboutMegaMenuTitle` (String)
- [ ] `aboutMegaMenuCTA` (String)
- [ ] `aboutMegaMenuCTAUrl` (String)

### Destinations Menu:
- [ ] `destinationsCategories` (Component: navigation.destination-category, repeatable)
- [ ] `destinationsMegaMenuTitle` (String)
- [ ] `destinationsMegaMenuCTA` (String)
- [ ] `destinationsMegaMenuCTAUrl` (String)

---

## ✅ Step 4: Configure Main Menu Items

1. Go to **Content Manager → Single Types → Navigation Menu**
2. Click **Configure** if empty
3. Add **Menu Items** (6 items recommended):

### Example Configuration:

| Label | Href | hasMegaMenu | megaMenuId | isActive |
|-------|------|-------------|------------|----------|
| Home | #home | false | (empty) | true |
| Dates | #dates | true | dates | false |
| Rackets | #rackets | true | rackets | false |
| About Us | #about | true | about | false |
| Destinations | #destinations | true | destinations | false |
| Blog | #blogs | false | (empty) | false |

---

## ✅ Step 5: Configure Dates Menu

### Left Column (datesFindYourNext):
Add 8 text links:
1. Tennis Holiday → #tennis-holiday
2. UK Tennis Clinic → #uk-tennis-clinic
3. Padel Holiday → #padel-holiday
4. Pickleball Holiday → #pickleball-holiday
5. Play & Watch Event → #play-watch-event
6. School Tennis Tour → #school-tennis-tour
7. Ski Holiday → #ski-holiday
8. View All Destinations → #all-destinations

### Right Column (datesUsefulLinks):
Add 9 text links:
1. Active Away Itineraries → #itineraries
2. Airport Transfers → #airport-transfers
3. Book Now → #book-now
4. FAQs → #faqs
5. Flights → #flights
6. Membership → #membership
7. Self Rating Guide → #self-rating-guide
8. The Booking Process → #booking-process
9. View All Dates → #all-dates

---

## ✅ Step 6: Configure Rackets Menu

Add **9 image cards** (racketsMegaMenuItems):

| Title | Href | Image | Gradient |
|-------|------|-------|----------|
| Adult Tennis Holidays | #adult-tennis | Upload image | from-blue-500 to-blue-600 |
| Family Tennis Holidays | #family-tennis | Upload image | from-green-500 to-green-600 |
| Tennis Clinics | #tennis-clinics | Upload image | from-purple-500 to-purple-600 |
| Padel | #padel | Upload image | from-cyan-500 to-cyan-600 |
| Pickleball | #pickleball | Upload image | from-lime-500 to-lime-600 |
| Junior Tennis Camps | #junior-camps | Upload image | from-orange-500 to-orange-600 |
| Play & Watch | #play-watch | Upload image | from-red-500 to-red-600 |
| School Tennis Tours | #school-tours | Upload image | from-indigo-500 to-indigo-600 |
| Ski Holidays | #ski-holidays | Upload image | from-sky-500 to-sky-600 |

**Note**: Upload high-quality images (recommended 400×300px or similar aspect ratio).

---

## ✅ Step 7: Configure About Us Menu

Add **3-6 image cards** (aboutMegaMenuItems):

Example items:
1. **Our Story**
   - Description: "Learn about our journey..."
   - Href: #our-story
   - Image: Upload
   - Gradient: from-blue-500 to-indigo-600

2. **Meet The Team**
   - Description: "Get to know our experts..."
   - Href: #team
   - Image: Upload
   - Gradient: from-purple-500 to-pink-600

3. **Contact Us**
   - Description: "Get in touch with us..."
   - Href: #contact
   - Image: Upload
   - Gradient: from-green-500 to-teal-600

### CTA Fields:
- `aboutMegaMenuTitle`: "Learn more about Active Away"
- `aboutMegaMenuCTA`: "Get in Touch"
- `aboutMegaMenuCTAUrl`: "#contact"

---

## ✅ Step 8: Configure Destinations Menu

Add **8 categories** (destinationsCategories), each with multiple destinations:

### Category 1: Tennis Holidays
Add 20 destinations:
- Algarve Tennis Week → #algarve
- Costa Brava Tennis Camp → #costa-brava
- French Riviera Tennis → #french-riviera
- [... 17 more ...]

### Category 2: Tennis Clinics
Add 5-10 destinations:
- Advanced Clinic Spain → #clinic-spain
- [... more ...]

### Category 3: Junior Tennis Camps
Add destinations...

### Category 4: Padel
Add destinations...

### Category 5: Pickleball
Add destinations...

### Category 6: Play & Watch
Add 4 destinations:
- French Open Experience → #french-open
- Wimbledon Tour Package → #wimbledon
- US Open Experience → #us-open
- Australian Open Package → #australian-open

### Category 7: School Tennis Tours
Add destinations...

### Category 8: Ski Holidays
Add destinations...

### CTA Fields:
- `destinationsMegaMenuTitle`: "Find your perfect destination"
- `destinationsMegaMenuCTA`: "View All Destinations"
- `destinationsMegaMenuCTAUrl`: "#all-destinations"

---

## ✅ Step 9: Save and Publish

**IMPORTANT**: After configuring all fields:
1. Click **Save** (top right)
2. Click **Publish** (top right)

If you don't publish, the frontend won't see the data!

---

## ✅ Step 10: Test Frontend Integration

1. **Rebuild Astro** (if not using dev mode):
```bash
cd /Users/joshuathompson/active-away-astro
npm run build
```

2. **Start Dev Server** (or check production):
```bash
npm run dev
```

3. **Open Browser**: http://localhost:4321

4. **Check Navigation**:
   - [ ] Main menu items appear
   - [ ] Hover over "Dates" → Two-column menu appears
   - [ ] Hover over "Rackets" → 9-image grid appears
   - [ ] Hover over "About Us" → Image cards appear
   - [ ] Hover over "Destinations" → Tabbed interface appears
   - [ ] Click between destination tabs → Content switches
   - [ ] All links work correctly
   - [ ] Images load properly

---

## ✅ Step 11: Test Mobile Menu

1. **Resize browser** to < 1280px width
2. **Check**:
   - [ ] Hamburger menu icon appears
   - [ ] Click icon → Full-screen mobile menu opens
   - [ ] All menu items visible
   - [ ] Can scroll through items
   - [ ] Close button works

---

## 🐛 Troubleshooting

### Problem: Components not showing in Strapi
**Solution**: Make sure you restarted Strapi after adding component files

### Problem: "Component not found" error
**Solution**: 
- Check component file names match exactly
- Verify JSON syntax is valid
- Restart Strapi

### Problem: Menu not appearing on frontend
**Solution**:
- Verify content is **Published** in Strapi
- Check browser console for API errors
- Verify Strapi is running
- Check STRAPI_URL in .env file

### Problem: Images not loading
**Solution**:
- Upload images directly in Strapi
- Check image permissions
- Verify image formats (jpg, png, webp)

### Problem: Destinations showing wrong number of columns
**Solution**:
- This is automatic based on item count
- Add/remove items to adjust
- 1 column: ≤8 items
- 2 columns: 9-16 items
- 3 columns: 17-24 items
- 4 columns: 25+ items

---

## 📚 Need Help?

Refer to these guides:
- `NAVIGATION_MENU_STRAPI_GUIDE.md` - Detailed setup instructions
- `NAVIGATION_SETUP_COMPLETE.md` - Overview of what was implemented

---

## ✨ All Done!

Once you complete this checklist, your navigation menu is fully operational and managed through Strapi CMS! 🎉

You can update menu items, links, images, and content anytime without touching code.

