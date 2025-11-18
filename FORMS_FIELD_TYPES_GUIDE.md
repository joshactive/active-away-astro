# Forms Field Types Guide

This guide explains all available field types and features for Strapi forms.

## Table of Contents
- [Field Types](#field-types)
- [Field Properties](#field-properties)
- [Section Headings](#section-headings)
- [Helper Text & Descriptions](#helper-text--descriptions)
- [Complete Examples](#complete-examples)

---

## Field Types

### 1. Text Input
Single-line text input field.

```json
{
  "name": "first_name",
  "label": "First Name",
  "type": "text",
  "required": true,
  "placeholder": "e.g. John",
  "description": "Enter your first name as it appears on your ID"
}
```

### 2. Email Input
Email field with built-in validation.

```json
{
  "name": "email",
  "label": "Email Address",
  "type": "email",
  "required": true,
  "placeholder": "you@example.com",
  "description": "We'll send confirmation to this address"
}
```

### 3. Telephone Input
Phone number field with country code selector.

```json
{
  "name": "phone",
  "label": "Phone Number",
  "type": "tel",
  "required": false,
  "placeholder": "7965 7277",
  "pattern": "[0-9]{8,15}",
  "description": "Include area code if applicable"
}
```

### 4. Textarea
Multi-line text input.

```json
{
  "name": "comments",
  "label": "Additional Comments",
  "type": "textarea",
  "required": false,
  "placeholder": "Tell us more...",
  "minLength": 10,
  "maxLength": 500,
  "description": "Maximum 500 characters"
}
```

### 5. Select Dropdown
Dropdown menu with predefined options.

```json
{
  "name": "rating",
  "label": "Overall Rating",
  "type": "select",
  "required": true,
  "placeholder": "Please Select",
  "description": "1 = Lowest / 10 = Highest",
  "options": [
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "1"
  ]
}
```

### 6. Checkbox (NEW!)
Single or multiple checkbox options.

**Single Checkbox (e.g., consent):**
```json
{
  "name": "consent",
  "label": "",
  "type": "checkbox",
  "required": true,
  "options": [
    "I consent to my information being processed and agree to the privacy policy"
  ]
}
```

**Multiple Checkboxes:**
```json
{
  "name": "interests",
  "label": "What are you interested in?",
  "type": "checkbox",
  "required": false,
  "description": "Select all that apply",
  "options": [
    "Tennis Coaching",
    "Racket Restringing",
    "Group Sessions",
    "Private Lessons",
    "Tournaments"
  ]
}
```

### 7. Date Input
Date picker field.

```json
{
  "name": "arrival_date",
  "label": "Arrival Date",
  "type": "date",
  "required": true,
  "description": "When do you plan to arrive?"
}
```

### 8. Number Input
Numeric input field.

```json
{
  "name": "age",
  "label": "Age",
  "type": "number",
  "required": true,
  "min": 18,
  "max": 100,
  "placeholder": "e.g. 25"
}
```

### 9. Section Heading (NEW!)
Visual separator to organize forms into sections. Does NOT collect data.

```json
{
  "type": "section",
  "label": "Your Information",
  "description": "Please provide your contact details so we can get in touch"
}
```

**Note:** Section fields don't need a `name` property since they don't collect data.

---

## Field Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes (except sections) | Unique field identifier for form submission |
| `label` | string | Yes | Label text displayed to user |
| `type` | string | Yes | Field type (see types above) |
| `required` | boolean | No | Whether field is mandatory (default: false) |
| `placeholder` | string | No | Placeholder text shown in empty fields |
| `description` | string | No | Helper text shown below field |
| `options` | array | For select/checkbox | Array of available options |
| `minLength` | number | No | Minimum character length |
| `maxLength` | number | No | Maximum character length |
| `min` | number | No | Minimum value (for number/date fields) |
| `max` | number | No | Maximum value (for number/date fields) |
| `pattern` | string | No | Regex pattern for validation |

---

## Section Headings

Use section headings to organize long forms into logical groups:

```json
[
  {
    "type": "section",
    "label": "Personal Information",
    "description": "Tell us about yourself"
  },
  {
    "name": "first_name",
    "label": "First Name",
    "type": "text",
    "required": true
  },
  {
    "name": "last_name",
    "label": "Last Name",
    "type": "text",
    "required": true
  },
  {
    "type": "section",
    "label": "Contact Details"
  },
  {
    "name": "email",
    "label": "Email",
    "type": "email",
    "required": true
  }
]
```

**Styling:**
- Sections span full width (even in two-column layouts)
- Include visual separator line
- Larger, serif font for section titles
- Optional description text in gray

---

## Helper Text & Descriptions

Add `description` to any field to provide context or instructions:

```json
{
  "name": "court_rating",
  "label": "Court Rating",
  "type": "select",
  "description": "Rate from 1 (poor) to 10 (excellent)",
  "options": ["10", "9", "8", "7", "6", "5", "4", "3", "2", "1"]
}
```

The description appears:
- Below the label for regular fields
- Below checkboxes for checkbox fields
- Below the section title for sections

---

## Complete Examples

### Example 1: Simple Contact Form

```json
[
  {
    "name": "name",
    "label": "Full Name",
    "type": "text",
    "required": true,
    "placeholder": "John Smith"
  },
  {
    "name": "email",
    "label": "Email Address",
    "type": "email",
    "required": true,
    "placeholder": "john@example.com"
  },
  {
    "name": "message",
    "label": "Message",
    "type": "textarea",
    "required": true,
    "placeholder": "How can we help you?",
    "minLength": 10
  },
  {
    "name": "consent",
    "type": "checkbox",
    "required": true,
    "options": [
      "I agree to be contacted regarding my enquiry"
    ]
  }
]
```

### Example 2: Feedback Form with Sections

```json
[
  {
    "type": "section",
    "label": "Your Information",
    "description": "Optional - Leave blank if you'd prefer to remain anonymous"
  },
  {
    "name": "first_name",
    "label": "First Name",
    "type": "text",
    "required": false
  },
  {
    "name": "email",
    "label": "Email",
    "type": "email",
    "required": false
  },
  {
    "type": "section",
    "label": "Tennis Courts Feedback"
  },
  {
    "name": "court_rating",
    "label": "Court Rating (1-10)",
    "type": "select",
    "required": true,
    "description": "1 = Lowest / 10 = Highest",
    "placeholder": "Please Select",
    "options": ["10", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0"]
  },
  {
    "name": "court_comments",
    "label": "Court Comments",
    "type": "textarea",
    "required": false,
    "placeholder": "What did you think about the courts?"
  },
  {
    "type": "section",
    "label": "Consent"
  },
  {
    "name": "consent",
    "type": "checkbox",
    "required": true,
    "options": [
      "I consent to my feedback being processed"
    ]
  }
]
```

---

## Form Submission Data

### How Data is Sent

When a form is submitted, the data is sent to your webhook in this format:

```json
{
  "formTitle": "Feedback Form",
  "submittedAt": "2025-11-18T10:30:00.000Z",
  "source": "Active Away Website",
  "formData": {
    "first_name": "John",
    "email": "john@example.com",
    "court_rating": "9",
    "court_comments": "Great facilities!",
    "consent": "I consent to my feedback being processed"
  }
}
```

### Checkbox Data

- **Single checkbox**: Sends the option text if checked, or nothing if unchecked
- **Multiple checkboxes**: Sends an array of selected values

Example with multiple checkboxes:
```json
{
  "interests": [
    "Tennis Coaching",
    "Private Lessons",
    "Tournaments"
  ]
}
```

---

## Tips & Best Practices

### 1. Use Sections for Long Forms
Break forms with 5+ fields into logical sections for better UX.

### 2. Add Descriptions for Clarity
Use `description` to clarify rating scales, character limits, or special instructions.

### 3. Mark Required Fields
Always set `required: true` for essential fields. They'll show a red asterisk (*).

### 4. Use Appropriate Field Types
- Use `email` type for emails (built-in validation)
- Use `tel` type for phone numbers (includes country code selector)
- Use `select` for 3+ predefined options
- Use `textarea` for comments/long text

### 5. Set Placeholders
Help users understand what format you expect with good placeholder examples.

### 6. Use Two-Column Layout
For forms with many fields, set `formLayout: "two-column"` in Strapi. Sections and textareas will automatically span full width.

---

## Updating Existing Forms

To add these new features to existing forms:

1. Go to Content Manager → Forms in Strapi
2. Edit the form you want to update
3. Update the `formFields` JSON with the new field types
4. Save and publish

The frontend will automatically support the new field types!

