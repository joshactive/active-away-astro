# Key Information Section

## ✅ Component Created

A new section for displaying key information cards in a 3x2 grid layout.

---

## 📦 Files Created

**Strapi Components:**
1. `/Users/joshuathompson/strapi/strapi/src/components/sections/info-card.json`
2. `/Users/joshuathompson/strapi/strapi/src/components/sections/key-information.json`

**Astro Component:**
- `/Users/joshuathompson/active-away-astro/src/components/KeyInformationTailwind.astro`

**Updated Files:**
- Product Page schema
- Strapi utils (`strapi.js`)
- Product page template (`[slug].astro`)

---

## 🎨 Layout

**Desktop:** 3 columns x 2 rows
**Tablet:** 2 columns
**Mobile:** 1 column

Each card has:
- Gold rounded square icon background
- White icon (SVG)
- Gold heading
- Grey description text

---

## 🚀 How to Use in Strapi

After **restarting Strapi**, fill in the **keyInformation** section:

### Example: Adult Tennis Holidays

**Eyebrow:** `KEY INFORMATION`
**Heading:** `About our Adult Tennis Holidays`

**Info Cards** (add 6 items):

1. **Group Make Up**
   - Icon: `users`
   - Heading: `Group Make Up`
   - Description: `All of our Adult Tennis Holidays are a mixture of Singles, Couples & Small Groups. Group Sizes range from 8-50.`

2. **1:6 Ratio**
   - Icon: `ratio`
   - Heading: `1:6 Ratio`
   - Description: `Our morning tennis coaching sessions are always a maximum of 1 Coach to 1 Court to 6 Players on our Adult Tennis Holidays.`

3. **Package Travel Protected**
   - Icon: `shield`
   - Heading: `Package Travel Protected`
   - Description: `Your booking is fully package travel protected with Active Away. In the unlikely event of insolvency, you would be reimbursed.`

4. **Airport Transfers**
   - Icon: `plane`
   - Heading: `Airport Transfers`
   - Description: `We can take care of Airport Transfers for you! You can choose any flight and our team will be there to take care of you.`

5. **Flights**
   - Icon: `flight`
   - Heading: `Flights`
   - Description: `Are not included in our Adult Tennis Holidays, but we provide a simple link to help you find the perfect flight for you.`

6. **Fixed Dates**
   - Icon: `calendar`
   - Heading: `Fixed Dates`
   - Description: `Our trips are 'fixed dates' – meaning our itinerary starts and ends of specific dates. You can add extra nights to your trip, and we can offer 5 night trips.`

---

## 🎨 Available Icons

Choose from these built-in icons:
- `users` - Group/people icon
- `ratio` - Bar chart/ratio icon
- `shield` - Shield/protection icon
- `plane` - Airplane/transfer icon
- `flight` - Flight/plane icon
- `calendar` - Calendar/dates icon
- `heart` - Heart icon
- `star` - Star icon
- `trophy` - Trophy/award icon
- `check` - Checkmark icon
- `custom` - Use customIconSvg field for your own SVG

---

## 🎯 Styling

- **Background**: White (`bg-white`)
- **Icon Background**: Gold (`#ad986c`)
- **Icon Color**: White
- **Heading**: Gold (`#ad986c`)
- **Description**: Grey text
- **Hover**: Icons scale up slightly
- **Shadow**: Subtle shadow on icon squares

---

## 📍 Page Order

The Key Information section appears:
1. Hero
2. Quote
3. Jamie Murray
4. Two Column Content (Hosting/Tennis Standards)
5. **← Key Information** ← New section!
6. Schedule
7. Discount
8. Testimonials
9. Destinations
10. FAQ
11. Partners

---

## ✨ Features

- ✅ Fully responsive (1/2/3 column grid)
- ✅ Icon library included
- ✅ Hover animations
- ✅ Gold accent colors matching brand
- ✅ Custom icon support via SVG

---

## 🔄 Next Steps

1. **Restart Strapi** to see the new fields
2. **Fill in keyInformation** in your Product Page
3. **Add 6 info cards** with the content above
4. **Rebuild** your Astro site
5. **View** the section below the two-column content

The section will automatically appear once you add at least one info card!

