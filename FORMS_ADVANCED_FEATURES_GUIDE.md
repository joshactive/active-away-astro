# Forms Advanced Features Guide

## Overview

Your form system now supports advanced features for complex use cases:

1. ✅ **Hidden Fields** - Store data without showing it to users
2. ✅ **Query Parameter Population** - Pre-fill fields from URL parameters
3. ✅ **Conditional Display** - Show/hide fields based on other field values
4. ⚠️ **Repeater Fields** - Not yet implemented (requires manual workaround)

---

## 1. Hidden Fields

Hidden fields store values without displaying them to users.

### Field Configuration

```json
{
  "name": "bookingid",
  "label": "Booking ID",
  "type": "hidden",
  "required": false,
  "value": "12345"
}
```

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Field name for form submission |
| `label` | string | Yes | Internal label (not shown to user) |
| `type` | string | Yes | Must be `"hidden"` |
| `value` | string | No | Default value |
| `queryParam` | string | No | URL parameter to populate from |

### Example Use Cases

- Booking IDs
- Tracking codes
- Form versions
- Source identifiers

---

## 2. Query Parameter Population

Pre-fill form fields from URL query parameters.

### Field Configuration

```json
{
  "name": "first_name",
  "label": "First Name",
  "type": "text",
  "required": true,
  "queryParam": "fname"
}
```

### How It Works

**URL:**
```
https://activeaway.com/forms/consent?fname=John&lname=Smith&email=john@example.com&bookingid=AA-12345
```

**Form Fields:**
- Field with `queryParam: "fname"` → pre-filled with "John"
- Field with `queryParam: "lname"` → pre-filled with "Smith"
- Field with `queryParam: "email"` → pre-filled with "john@example.com"
- Hidden field with `queryParam: "bookingid"` → populated with "AA-12345"

### Supported Field Types

- `text`
- `email`
- `tel`
- `hidden`
- `date`
- `number`

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `queryParam` | string | No | URL parameter name to read from |

### Example

```json
[
  {
    "name": "email",
    "label": "Email Address",
    "type": "email",
    "required": true,
    "queryParam": "email"
  },
  {
    "name": "phone",
    "label": "Phone Number",
    "type": "tel",
    "required": true,
    "queryParam": "phone"
  },
  {
    "name": "tracking_code",
    "type": "hidden",
    "queryParam": "utm_source"
  }
]
```

---

## 3. Conditional Display

Show or hide fields/sections based on other field values.

### Field Configuration

```json
{
  "type": "section",
  "label": "Emergency Contact",
  "conditional": true,
  "conditionalField": "bookingid",
  "conditionalOperator": "contain",
  "conditionalValue": "-"
}
```

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `conditional` | boolean | No | Enable conditional display |
| `conditionalField` | string | If conditional | Name of field to watch |
| `conditionalOperator` | string | If conditional | Comparison operator |
| `conditionalValue` | string | If conditional | Value to compare against |

### Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `contain` / `contains` | Field value contains string | bookingid contains "-" |
| `not_contain` | Field value doesn't contain string | bookingid doesn't contain "-" |
| `equals` | Field value exactly matches | status equals "active" |
| `not_equals` | Field value doesn't match | status not equals "inactive" |
| `greater` | Field length > value | name length > 5 |
| `less` | Field length < value | code length < 10 |

### Example Use Cases

#### 1. Show Form Only With Valid Booking ID

```json
[
  {
    "name": "bookingid",
    "type": "hidden",
    "queryParam": "bookingid"
  },
  {
    "type": "section",
    "label": "Consent Form",
    "conditional": true,
    "conditionalField": "bookingid",
    "conditionalOperator": "contain",
    "conditionalValue": "-"
  },
  {
    "name": "child_name",
    "label": "Child's Name",
    "type": "text",
    "required": true,
    "conditional": true,
    "conditionalField": "bookingid",
    "conditionalOperator": "contain",
    "conditionalValue": "-"
  },
  {
    "type": "section",
    "label": "Invalid Link",
    "description": "This form requires a valid booking ID",
    "conditional": true,
    "conditionalField": "bookingid",
    "conditionalOperator": "not_contain",
    "conditionalValue": "-"
  }
]
```

#### 2. Show Additional Fields Based on Selection

```json
[
  {
    "name": "has_allergies",
    "label": "Does your child have allergies?",
    "type": "select",
    "required": true,
    "options": ["Yes", "No"]
  },
  {
    "name": "allergy_details",
    "label": "Please specify allergies",
    "type": "textarea",
    "required": true,
    "conditional": true,
    "conditionalField": "has_allergies",
    "conditionalOperator": "equals",
    "conditionalValue": "Yes"
  }
]
```

### Behavior

- Fields are hidden by default if `conditional: true`
- Fields are shown when condition is met
- Required validation is disabled for hidden fields
- Required validation is re-enabled when fields are shown
- Conditions are checked on:
  - Page load
  - Field input
  - Field change

---

## 4. Repeater Fields (Not Yet Implemented)

⚠️ **Status:** Requires future development

### What They Are

Repeater fields allow users to add multiple instances of the same field group (e.g., "Add a Child" button to add multiple children's information).

### Current Workaround

For forms requiring multiple entries:

**Option 1:** Submit form multiple times
- Add note: "For multiple children, please submit this form once per child"
- User submits form multiple times

**Option 2:** Fixed number of entries
- Include fields for Child 1, Child 2, Child 3, etc.
- User fills only what's needed

**Option 3:** Comma-separated values
- Single text field: "Children's names (comma-separated)"
- User enters: "James, Emma, Oliver"

### Future Implementation

When implemented, repeater syntax will be:

```json
{
  "type": "repeater",
  "name": "children",
  "label": "Children",
  "addButtonText": "+ Add A Child",
  "minItems": 1,
  "maxItems": 10,
  "fields": [
    {
      "name": "child_first_name",
      "label": "Child First Name",
      "type": "text",
      "required": true
    },
    {
      "name": "child_surname",
      "label": "Child Surname",
      "type": "text",
      "required": true
    }
  ]
}
```

---

## Complete Example: Junior Camp Consent Form

See `JUNIOR_CAMP_CONSENT_FORM_JSON.json` for a complete example using:

- ✅ Hidden fields (`bookingid`)
- ✅ Query parameter population (fname, lname, email, phone)
- ✅ Conditional sections (show form only if booking ID contains "-")
- ✅ Conditional fields (all fields conditional on booking ID)
- ⚠️ Note about repeater fields (simplified to single child)

### How to Use

1. **Create form in Strapi**
2. **Paste JSON** from `JUNIOR_CAMP_CONSENT_FORM_JSON.json`
3. **Set webhook URL**
4. **Set webhook format** to `labels` or `names`
5. **Share URL** like:
   ```
   https://activeaway.com/forms/junior-camp-consent?bookingid=AA-12345&fname=Sarah&lname=Johnson&email=sarah@example.com&phone=7965123456
   ```

### Expected Behavior

**With valid booking ID** (`bookingid` contains "-"):
- Form displays all fields
- Fields pre-populated from query parameters
- User can complete and submit

**Without valid booking ID** (`bookingid` doesn't contain "-"):
- Shows message: "This form is not available..."
- Form fields are hidden

---

## Testing Conditional Logic

### Test URL Format

```
/forms/your-form-slug?field1=value1&field2=value2
```

### Example Tests

**Test 1: Valid booking ID**
```
/forms/junior-camp-consent?bookingid=AA-12345&fname=John
```
Expected: Form shows, first name = "John"

**Test 2: Invalid booking ID**
```
/forms/junior-camp-consent?bookingid=12345
```
Expected: Error message shows, form hidden

**Test 3: No booking ID**
```
/forms/junior-camp-consent
```
Expected: Error message shows, form hidden

---

## Browser Console Logs

When the page loads, you'll see:

```
✅ Form fields populated from query parameters
✅ Conditional field logic initialized
```

Watch the console while testing to debug conditional logic.

---

## Summary

| Feature | Status | Use Cases |
|---------|--------|-----------|
| Hidden Fields | ✅ Ready | Booking IDs, tracking codes |
| Query Params | ✅ Ready | Pre-filling user data |
| Conditionals | ✅ Ready | Show/hide based on conditions |
| Repeaters | ⚠️ Future | Multiple children, addresses |

For repeater functionality, use one of the workarounds until it's implemented.

