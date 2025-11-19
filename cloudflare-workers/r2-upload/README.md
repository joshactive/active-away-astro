# R2 Upload Worker

Cloudflare Worker that sits between Make.com (or any automation tool) and the `active-away` R2 bucket. It accepts authenticated `PUT` or `POST` requests, then streams the payload directly into R2 without exposing your bucket credentials.

## Features

- Bearer-token authentication (`UPLOAD_TOKEN` secret)
- Direct binary uploads via `PUT /folder/file.jpg`
- JSON uploads via `POST` with
  - `fileUrl`: Worker downloads the remote file before storing it
  - `base64`: Send inline base64 data
- Optional `x-file-name` header, `?key=` query, or path-based object keys
- Optional `x-upload-metadata` header (JSON) → stored as R2 custom metadata
- CORS-friendly responses for tools that issue preflight requests

## Structure

```
cloudflare-workers/r2-upload/
├── README.md
├── src/
│   └── index.js
└── wrangler.toml
```

## Setup

1. **Install Wrangler (if not already available)**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare**
   ```bash
   wrangler login
   ```

3. **Create or bind the R2 bucket**
   ```bash
   wrangler r2 bucket create active-away
   ```
   Adjust `bucket_name` inside `wrangler.toml` if you use a different bucket.

4. **Configure secrets**
   ```bash
   cd cloudflare-workers/r2-upload
   wrangler secret put UPLOAD_TOKEN
   ```
   Use a long random string. Share it only with Make.com and rotate it regularly.

5. **Deploy**
   ```bash
   wrangler deploy
   ```
   - To use a custom domain, uncomment and update the `routes` block in `wrangler.toml`.
   - Without routes, Wrangler will deploy to `<worker-name>.<subdomain>.workers.dev`.

## Request Examples

### Binary upload (Make.com HTTP module → `PUT`)

```
PUT https://active-away-r2-upload.workers.dev/uploads/sample.pdf
Authorization: Bearer <UPLOAD_TOKEN>
Content-Type: application/pdf

<binary body>
```

### Remote URL upload (`POST` JSON)

```http
POST https://active-away-r2-upload.workers.dev?key=gallery/hero.jpg
Authorization: Bearer <UPLOAD_TOKEN>
Content-Type: application/json
X-Upload-Metadata: {"source":"make","campaign":"spring"}

{
  "fileUrl": "https://example.com/hero.jpg"
}
```

### Base64 upload (`POST` JSON)

```http
POST https://active-away-r2-upload.workers.dev
Authorization: Bearer <UPLOAD_TOKEN>
Content-Type: application/json
X-File-Name: assets/brochure.pdf

{
  "base64": "<base64 data>",
  "contentType": "application/pdf"
}
```

## Integrating with Make.com

1. **HTTP module**
   - Method: `PUT` (for direct binary) or `POST` (JSON payload)
   - URL: Worker URL plus `/path/to/file` or `?key=path/to/file`
   - Headers:
     - `Authorization: Bearer <UPLOAD_TOKEN>`
     - `Content-Type`: matches your payload
     - Optional `X-File-Name` to avoid putting the key in the URL

2. **Binary uploads**
   - In Make.com, map the file/binary bundle to the HTTP module body.
   - Set `Content-Type` to the file’s MIME type (or leave blank to default to `application/octet-stream`).

3. **Remote fetch uploads**
   - Provide a JSON body with `{ "fileUrl": "https://..." }`.
   - Make ensures the module sends JSON; the worker downloads and streams it to R2.

## Security Notes

- Keep the `UPLOAD_TOKEN` secret; never commit it or share it in plaintext.
- Restrict Make.com scenario access and rotate the token periodically.
- If Make.com IPs are known/stable, you can add an allowlist check inside `src/index.js`.
- Consider enabling Cloudflare Logs to monitor upload attempts.

## Debugging

- `wrangler dev` runs the worker locally with a mock R2 bucket.
- Use `wrangler tail` to stream logs from production.
- When troubleshooting failed uploads:
  - Confirm the Authorization header is present.
  - Inspect the worker logs for detailed error messages.
  - Verify the object key is being resolved (path, query, or header).

