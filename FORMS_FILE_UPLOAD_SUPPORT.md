## File Upload Support in Dynamic Forms

- Use `type: "file"` on any form field to render the uploader.
- Optional `accept` property follows standard HTML syntax (e.g. `.pdf`, `image/*` or `application/pdf,image/png`).
- Optional `multiple: true` lets users upload more than one file for that field.
- Optional `maxFileSizeMB` (number) enforces a per-file size limit; if omitted you can set `formData.defaultMaxFileSizeMB`.
- Each upload is automatically saved to the Cloudflare R2 bucket via `/api/upload-file.json`.
- The field’s value in the webhook payload becomes a JSON array of `{ url, fileName, fileSize, fileType }` objects (or a single object when `multiple` is false).

Example field definition:

```json
{
  "type": "file",
  "name": "cv",
  "label": "Upload CV",
  "accept": ".pdf,.doc,.docx",
  "maxFileSizeMB": 15,
  "multiple": false,
  "required": true
}
```

