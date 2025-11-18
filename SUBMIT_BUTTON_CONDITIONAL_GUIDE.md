# Submit Button Conditional Display Guide

## Overview

You can now conditionally show/hide the submit button based on field values!

---

## Strapi Schema Changes

Added 4 new fields to the Forms schema:

| Field | Type | Description |
|-------|------|-------------|
| `submitButtonConditional` | Boolean | Enable conditional submit button |
| `submitButtonConditionalField` | Text | Name of field to watch |
| `submitButtonConditionalOperator` | Enum | Comparison operator |
| `submitButtonConditionalValue` | Text | Value to compare against |

**After adding these fields, restart Strapi.**

---

## How to Use in Strapi

### Email Consent Form Example

For a form that should only show the submit button when `cfname` has a value:

1. **Open your form in Strapi**
2. **Scroll to the bottom** (below formFields)
3. **Set these fields:**
   - **Submit Button Conditional:** `true` ✅
   - **Submit Button Conditional Field:** `cfname`
   - **Submit Button Conditional Operator:** `not_empty`
   - **Submit Button Conditional Value:** (leave blank)

4. **Save and Publish**

**Result:**
- If URL has `?cfname=James` → Submit button shows ✅
- If URL has no `cfname` or it's empty → Submit button hidden ❌

---

## Available Operators

Same as field conditionals:

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` / `equal` | Exact match | status equals "approved" |
| `not_equals` | Not equal | status not equals "pending" |
| `contain` / `contains` | Contains text | bookingid contains "-" |
| `not_contain` | Doesn't contain | bookingid not contains "INVALID" |
| `not_empty` | Has any value | cfname not empty |
| `empty` | Has no value | optional_field empty |
| `greater` | Length greater than | name length > 5 |
| `less` | Length less than | code length < 10 |

---

## Common Use Cases

### 1. Email Consent Form
**Show button only with valid booking reference:**

```
Submit Button Conditional: true
Field: cfname
Operator: not_empty
Value: (blank)
```

### 2. Multi-Step Form
**Show button only after selecting event type:**

```
Submit Button Conditional: true
Field: whichevent
Operator: not_equals
Value: Please Select
```

### 3. Booking-Based Form
**Show button only with valid booking ID:**

```
Submit Button Conditional: true
Field: bookingid
Operator: contain
Value: -
```

### 4. Agreement Form
**Show button only after accepting terms:**

```
Submit Button Conditional: true
Field: consent_checkbox
Operator: not_empty
Value: (blank)
```

---

## Visual Behavior

### When Button is Hidden:
- Button completely hidden (not just disabled)
- Turnstile also hidden
- User sees form fields but can't submit
- Good for showing "form not available" message

### When Button is Visible:
- Normal submit button appearance
- Turnstile shows above button
- User can complete and submit

---

## Email Consent Form Setup

**Form Fields JSON:** See `EMAIL_CONSENT_FORM_JSON.json`

**Strapi Configuration:**
- Title: `Email Consent`
- Slug: `email-consent`
- Form Heading: (leave blank - no heading needed)
- Form Subtitle: (leave blank)
- Form Fields: Paste JSON from file
- **Submit Button Conditional:** `true` ✅
- **Submit Button Conditional Field:** `cfname`
- **Submit Button Conditional Operator:** `not_empty`
- **Submit Button Conditional Value:** (blank)
- Webhook URL: Your webhook
- Webhook Format: `labels`

**URL Example:**
```
/forms/email-consent?uniq1=ABC&uniq2=XYZ&school=St%20Andrews&dest=Cyprus&sdate=2025-06-15&enddate=2025-06-22&cfname=James
```

**Result:**
- All hidden fields populated
- Submit button shows (because cfname="James")
- User clicks button → webhook receives all data

---

## Combined with Field Conditionals

You can use **both** field conditionals AND submit button conditionals:

**Example:**
- Fields conditional on `bookingid` contains "-"
- Submit button conditional on `bookingid` contains "-"

**Result:**
- Invalid booking ID → No fields, no button
- Valid booking ID → Fields + button show

---

## Troubleshooting

### Submit button always visible

**Check:**
- Is `submitButtonConditional` set to `true`?
- Is the field name correct?
- Is the operator correct?
- Restart dev server after changing Strapi

### Submit button always hidden

**Check:**
- Condition might be inverted
- Field might not be populated yet
- Check browser console for errors
- Verify query parameter names match

---

## Summary

The submit button now supports the same conditional logic as fields:

- ✅ Show/hide based on any field
- ✅ All operators supported
- ✅ Works with hidden fields and query params
- ✅ Perfect for multi-step or validation-based forms

Configure in Strapi form settings (not in formFields JSON)!

