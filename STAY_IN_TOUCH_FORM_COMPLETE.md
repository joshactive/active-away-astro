# Stay in Touch Form - Implementation Complete

## Overview

This form allows contacts to update their information and interests with Active Away. It's designed to work with Infusionsoft/Keap CRM and pre-populates data from URL query parameters.

---

## Files Created/Modified

### 1. Form JSON Configuration
**File:** `STAY_IN_TOUCH_FORM_JSON.json`

### 2. Form Component Enhancement
**File:** `src/components/DynamicFormTailwind.astro`

**Enhancement:** Added support for label/value pairs in select options

---

## Form Features

### Hidden Fields
- `post_id` - Standard WordPress compatibility field
- `InfusionsoftID` - Populated from `ifid` query parameter

### Personal Information (All Required)
- First Name → `fname` query param
- Surname → `surname` query param
- Email → `email` query param
- Mobile Phone → `phone` query param

### Interest Selection (All Required)

All interest fields use Yes/No dropdowns that display "Yes" and "No" to users but send `1` (Yes) or `0` (No) to the webhook:

| Field Label | Field Name | Query Param | Webhook Values |
|------------|------------|-------------|----------------|
| Adult Tennis | adult_tennis | ath | 1 or 0 |
| Junior Tennis | JuniorTennis | jt | 1 or 0 |
| Adult Padel | AdultPadel | ap | 1 or 0 |
| Junior Padel | JuniorPadel | JP | 1 or 0 |
| Adult Pickleball | AdultPickleball | APick | 1 or 0 |
| Junior Pickleball | JuniorPickleball | JPick | 1 or 0 |
| Bespoke Holidays | bspoke | bspoke | 1 or 0 |
| Golf Holidays | GolfHolidays | golf | 1 or 0 |
| Walking Holidays | WalkingHolidays | Walk | 1 or 0 |
| Adult Ski/Snowboarding | adult_ski_snowboarding | aski | 1 or 0 |
| Family Ski/Snowboarding | FamilySkiSnowboarding | famski | 1 or 0 |

### Consent Checkbox (Required)
- "I consent to receiving updates from Active Away"

---

## Example URL

```
https://activeaway.com/update-contact-information/?ifid=~Contact.Id~&fname=[[contact.first_name]]&surname=[[contact.last_name]]&email=[[contact.email1.address]]&phone=[[contact.phone1.number]]&ath=[[contact.custom_fields.AdultTennisHolidays]]&jt=[[contact.custom_fields.JuniorTennis]]&ap=[[contact.custom_fields.AdultPadel]]&JP=[[contact.custom_fields.JuniorPadel]]&APick=[[contact.custom_fields.AdultPickleball]]&JPick=[[contact.custom_fields.JuniorPickleball]]&bspoke=[[contact.custom_fields.BespokeHolidays]]&golf=[[contact.custom_fields.GolfHolidays]]&Walk=[[contact.custom_fields.WalkingHolidays]]&aski=[[contact.custom_fields.AdultSkiSnowboarding]]&famski=[[contact.custom_fields.FamilySkiSnowboarding]]
```

---

## Webhook Payload Example

When submitted, the webhook receives:

```json
{
  "Your Information": "",
  "First Name": "John",
  "Surname": "Smith",
  "Email": "john.smith@example.com",
  "Mobile Phone": "+44 7700 900000",
  "Please select what you are interested in": "",
  "Adult Tennis": "1",
  "Junior Tennis": "0",
  "Adult Padel": "1",
  "Junior Padel": "0",
  "Adult Pickleball": "0",
  "Junior Pickleball": "0",
  "Bespoke Holidays (e.g Beach Holiday)": "1",
  "Golf Holidays": "0",
  "Walking Holidays": "0",
  "Adult Ski/Snowboarding": "1",
  "Family Ski/Snowboarding": "0",
  "Consent": "",
  "consent": "I consent to receiving updates from Active Away",
  "form_id": "stay-in-touch",
  "form_name": "Stay in Touch",
  "timestamp": "2025-11-22T10:30:00.000Z",
  "source": "Active Away Website - Form"
}
```

**Note:** Section headers appear as empty strings when `webhookFormat: "labels"` is used in Strapi.

---

## New Feature: Label/Value Select Options

### What Changed

The `DynamicFormTailwind.astro` component now supports two formats for select field options:

#### Old Format (String Array)
```json
{
  "options": ["Option 1", "Option 2", "Option 3"]
}
```
- Display: Shows the string
- Webhook: Sends the same string

#### New Format (Object Array) ✨
```json
{
  "options": [
    { "label": "Yes", "value": "1" },
    { "label": "No", "value": "0" }
  ]
}
```
- Display: Shows the `label` ("Yes" or "No")
- Webhook: Sends the `value` ("1" or "0")

### Benefits

1. **User-Friendly Display** - Users see "Yes" and "No"
2. **CRM-Friendly Values** - Infusionsoft receives `1` or `0` 
3. **Backward Compatible** - Old string array format still works
4. **WordPress Compatible** - Matches JetForms behavior

### Where It Works

The label/value format is supported in:
- ✅ Regular select fields
- ✅ Select fields within repeater fields
- ✅ All form types (labels or names webhook format)

---

## Strapi Setup

### 1. Create Form in Strapi

1. Go to **Content Manager** → **Forms**
2. Click **Create new entry**
3. Fill in:
   - **Title:** `Stay in Touch` or `Update Contact Information`
   - **Slug:** `stay-in-touch` or `update-contact-information`
   - **Webhook URL:** Your Infusionsoft/Make/Zapier webhook URL
   - **Webhook Format:** `labels` (for WordPress compatibility)
   - **Form Fields:** Copy/paste contents of `STAY_IN_TOUCH_FORM_JSON.json`
4. Click **Save** and **Publish**

### 2. Create Page Using Form

Create a page at `/update-contact-information` that uses the form, or add the form to an existing page using the `DynamicFormTailwind` component.

---

## Testing Checklist

### Pre-Population Test
- [ ] Visit URL with query parameters
- [ ] Verify all fields pre-populate correctly
- [ ] Verify dropdowns show "Yes" or "No" (not "1" or "0")
- [ ] Verify hidden fields are populated

### Submission Test
- [ ] Fill out all required fields
- [ ] Submit form
- [ ] Check webhook receives data
- [ ] Verify interest fields send `1` or `0` (not "Yes" or "No")
- [ ] Verify Infusionsoft contact is updated

### Validation Test
- [ ] Try submitting with empty required fields
- [ ] Verify error messages appear
- [ ] Verify form won't submit until all required fields are filled

---

## Integration Notes

### Infusionsoft Custom Fields

The form expects these custom fields in Infusionsoft:
- `AdultTennisHolidays`
- `JuniorTennis`
- `AdultPadel`
- `JuniorPadel`
- `AdultPickleball`
- `JuniorPickleball`
- `BespokeHolidays`
- `GolfHolidays`
- `WalkingHolidays`
- `AdultSkiSnowboarding`
- `FamilySkiSnowboarding`

### Query Parameter Mapping

When sending from Infusionsoft emails, use these merge fields:

```
?ifid=~Contact.Id~
&fname=[[contact.first_name]]
&surname=[[contact.last_name]]
&email=[[contact.email1.address]]
&phone=[[contact.phone1.number]]
&ath=[[contact.custom_fields.AdultTennisHolidays]]
&jt=[[contact.custom_fields.JuniorTennis]]
&ap=[[contact.custom_fields.AdultPadel]]
&JP=[[contact.custom_fields.JuniorPadel]]
&APick=[[contact.custom_fields.AdultPickleball]]
&JPick=[[contact.custom_fields.JuniorPickleball]]
&bspoke=[[contact.custom_fields.BespokeHolidays]]
&golf=[[contact.custom_fields.GolfHolidays]]
&Walk=[[contact.custom_fields.WalkingHolidays]]
&aski=[[contact.custom_fields.AdultSkiSnowboarding]]
&famski=[[contact.custom_fields.FamilySkiSnowboarding]]
```

---

## Summary

✅ **Form JSON created** with all required fields and query parameters  
✅ **Label/value support added** to form component  
✅ **All fields set to required** as requested  
✅ **Yes/No options** display user-friendly text but send `1`/`0` to webhook  
✅ **Full Infusionsoft integration** with query parameter pre-population  
✅ **WordPress compatibility** maintained  

The form is ready to be added to Strapi and deployed! 🎉

























