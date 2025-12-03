# Introduction to Strapi for Active Away Team

## What is Strapi?

Strapi is our **content management system (CMS)** where we manage everything that shows on the front end of our website. Think of it as the control panel for our website content.

**You can log in to Strapi here:** https://strapi-production-b96d.up.railway.app/admin

---

## What Can You Do in Strapi?

With Strapi, you can:

✅ **Add and edit** tennis holidays, padel holidays, and pickleball holiday pages  
✅ **Manage** blog posts and articles  
✅ **Update** FAQs and help content  
✅ **Create** new forms for customer inquiries  
✅ **Upload** and organize images and PDFs  
✅ **Edit** navigation menus  
✅ **Publish** or unpublish content at any time  

**Important:** You don't need to know any code to use Strapi. It's designed to be user-friendly!

---

## Understanding Strapi Basics

### 1. Content Types

Content is organized into different **types**. Here are the main ones we use:

| Content Type | What It's For | Example |
|--------------|---------------|---------|
| **Tennis Holiday** | Our tennis holiday packages | "Algarve Tennis Week" |
| **Padel Holiday** | Padel-specific holidays | "Costa Brava Padel Camp" |
| **Pickleball Holiday** | Pickleball packages | "Florida Pickleball Retreat" |
| **Blog** | Blog posts and articles | "Top 10 Tennis Destinations" |
| **FAQ Category** | Frequently asked questions | "Booking Process FAQs" |
| **Forms** | Contact and inquiry forms | "Transfer Info Form" |
| **Navigation Menu** | Main website navigation | Top menu with links |

### 2. Collection Types vs Single Types

**Collection Types** (Multiple Items)
- You can create many entries
- Examples: Blog posts, Tennis holidays, FAQs
- Each entry has its own page on the website

**Single Types** (One Item Only)
- Only one entry exists
- Examples: Navigation Menu, Home Page settings
- You edit the existing entry rather than creating new ones

### 3. Draft vs Published

All content has two states:

- **📝 Draft** - Saved but NOT visible on the website
- **✅ Published** - Live and visible to customers

**Golden Rule:** Always click **Save** first, then click **Publish** when you're ready for it to go live!

---

## How to Add New Content

### Example: Adding a New Tennis Holiday

1. **Log in** to Strapi
2. Click **Content Manager** in the left sidebar
3. Find **Tennis Holiday** (or whichever type you need)
4. Click the **+ Create new entry** button
5. Fill in the fields:
   - **Title:** "Costa del Sol Tennis Week"
   - **Slug:** Will auto-generate (e.g., `costa-del-sol-tennis-week`)
   - **Description:** Add details about the holiday
   - **Price:** "From £1,295"
   - **Upload images** using the Media Library
6. Click **Save** (top right)
7. Review your content
8. Click **Publish** when ready

---

## How to Edit Existing Content

1. **Content Manager** → Select the content type
2. **Click** on the item you want to edit
3. **Make your changes**
4. **Save** your changes
5. **Publish** to update the live website

**Tip:** If you want to make changes without them going live immediately, just Save (don't Publish). The website will continue showing the old version until you Publish.

---

## Working with Images

### Uploading Images

1. In any content entry, find the **image field**
2. Click **Add new assets**
3. **Drag and drop** or **browse** to upload
4. Select the image you want to use
5. Click **Finish**

### Image Best Practices

✅ **Use high-quality images** (at least 1200px wide)  
✅ **Name files clearly** (e.g., `algarve-tennis-court.jpg` not `IMG_1234.jpg`)  
✅ **Add Alt Text** - Describe the image for accessibility and SEO  
✅ **Keep file sizes reasonable** - Compress large images before uploading  

**Where to add Alt Text:**
1. Click on any uploaded image in the Media Library
2. Find the **Alternative Text** field
3. Add a clear description (e.g., "Tennis players on clay court in Algarve")

---

## Understanding the Interface

### Left Sidebar Navigation

| Icon/Section | What It Does |
|--------------|--------------|
| **Content Manager** | Add, edit, and manage all your content |
| **Media Library** | View and organize all uploaded images/files |
| **Content-Type Builder** | ⚠️ Advanced - Don't use unless trained |
| **Settings** | ⚠️ Advanced - For administrators only |

### Top Right Buttons

- **Save** - Saves your work (still in draft)
- **Publish** - Makes content live on the website
- **Unpublish** - Removes content from the website (but keeps it in Strapi)

---

## Important Safety Tips

### ⚠️ Things to BE CAREFUL About

1. **Don't delete content** unless you're absolutely sure
   - Deleted items are **gone forever**
   - When in doubt, **Unpublish** instead

2. **Don't touch Content-Type Builder**
   - This changes the structure of the entire system
   - Only developers should use this

3. **Check your changes before publishing**
   - Use the **Save** button to save drafts
   - Review everything carefully
   - Only **Publish** when you're confident

4. **Be careful with URLs (Slugs)**
   - Changing a slug changes the webpage URL
   - This can break existing links
   - If you must change a slug, notify the development team

### ✅ Things You CAN Do Safely

✅ Edit text, descriptions, and content  
✅ Upload and replace images  
✅ Create new blog posts, holidays, FAQs  
✅ Save drafts without publishing  
✅ Unpublish content if needed  
✅ Add new entries to existing content types  

---

## Common Tasks Quick Reference

### Publishing a New Blog Post

1. **Content Manager** → **Blog**
2. **+ Create new entry**
3. Fill in: Title, Content, Category, Featured Image
4. Add SEO description and keywords
5. **Save** → **Publish**

### Updating a Holiday Price

1. **Content Manager** → **Tennis Holiday** (or relevant type)
2. Find and click on the holiday
3. Update the **Price** field
4. **Save** → **Publish**

### Adding an Image to an Existing Entry

1. Open the content entry
2. Find the image field
3. Click **Add new assets** or **Browse assets**
4. Upload new or select existing
5. **Save** → **Publish**

### Unpublishing Content Temporarily

1. Open the content entry
2. Click **Unpublish** (top right)
3. Content is now hidden from the website but still in Strapi

---

## Understanding Publishing Workflow

```
Create/Edit Content
       ↓
   Click SAVE (Content is now Draft)
       ↓
   Review Your Work
       ↓
   Click PUBLISH (Content goes live)
       ↓
   Website Updates Automatically
```

**Important:** The website rebuilds every 30 minutes, so your changes might take up to 30 minutes to appear on the live site (depending on your setup).

---

## Frequently Asked Questions

### Q: I saved my changes but don't see them on the website?

**A:** Did you click **Publish**? Saving alone keeps content in Draft state.

### Q: Can I undo a change?

**A:** Strapi doesn't have undo. However:
- If you haven't published yet, just refresh the page to lose unsaved changes
- If you published by mistake, you can edit it again and re-publish

### Q: What happens if I make a mistake?

**A:** Don't panic! Most things can be fixed:
- Edit the content and publish again
- Unpublish it temporarily
- Contact the development team for help

### Q: How do I know if content is published?

**A:** Look for the **Published** badge at the top of the entry. If it says **Draft**, it's not live yet.

### Q: Can multiple people edit at the same time?

**A:** Yes, but be careful! If two people edit the same entry, the last person to save will overwrite the other's changes. Communicate with your team about who's editing what.

### Q: Where do deleted items go?

**A:** Nowhere - they're permanently deleted! Always double-check before deleting.

---

## Who to Contact for Help

### For Content Questions:
- **Your Team Lead** - General content queries
- **Marketing Team** - Content strategy and messaging

### For Technical Issues:
- **Development Team** - If something isn't working
- **System Administrator** - If you're locked out or need permissions

### For Training:
- **Ask for a walk-through** - It's easier than it sounds!
- **This guide** - Keep it handy as a reference

---

## Quick Tips for Success

1. **Save frequently** - Don't lose your work!
2. **Preview before publishing** - Check everything twice
3. **Use descriptive titles** - Makes finding content easier later
4. **Fill in all fields** - Especially SEO fields for better search rankings
5. **Organize your media** - Use clear file names in the Media Library
6. **When in doubt, ask** - Better to ask than to make a mistake!

---

## Getting Started Checklist

- [ ] Log in to Strapi successfully
- [ ] Explore the Content Manager
- [ ] Browse existing content to see how it's structured
- [ ] Look at the Media Library
- [ ] Try creating a Draft blog post (don't publish yet)
- [ ] Practice uploading an image
- [ ] Ask a colleague or manager for a walk-through
- [ ] Bookmark this guide for future reference

---

## Remember

**Strapi is powerful but user-friendly.** You don't need to be technical to use it effectively. Start with small edits, build your confidence, and soon you'll be managing content like a pro!

**The golden rule:** Save first, check twice, publish once!

---

**Last Updated:** December 2025  
**Questions?** Contact your team lead or the development team.

