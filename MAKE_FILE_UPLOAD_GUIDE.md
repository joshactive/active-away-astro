# 📤 File Upload Guide - Make.com to Cloudflare R2 & Strapi

This guide covers two approaches for uploading files via Make.com:
1. **Direct to Cloudflare R2** (using HTTP module)
2. **Via Strapi CMS** (recommended - easier and more maintainable)

---

## 🌟 Option 1: Upload via Strapi (Recommended)

This is the **easiest and most maintainable** approach. Strapi handles file storage, and you can configure it to use Cloudflare R2 or Cloudflare Images as the storage provider.

### Why Use Strapi?

- ✅ **Built-in file management** - No need to handle AWS signatures
- ✅ **Automatic metadata** - Alt text, captions, file info stored automatically
- ✅ **Content relationships** - Link files to content types
- ✅ **Media library** - Browse and manage all uploaded files
- ✅ **Access control** - Built-in permissions and API tokens
- ✅ **Already integrated** - Your site already uses Strapi

### Step 1: Configure Strapi Upload Provider (One-time setup)

You can configure Strapi to upload directly to Cloudflare R2 or Images:

#### Option A: Cloudflare Images Provider (Best for images)

```bash
cd /Users/joshuathompson/strapi/strapi
npm install @strapi/provider-upload-cloudflare
```

Then in `config/plugins.js`:

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudflare',
      providerOptions: {
        accountId: env('CLOUDFLARE_ACCOUNT_ID'),
        apiToken: env('CLOUDFLARE_API_TOKEN'),
      },
    },
  },
});
```

#### Option B: AWS S3 Provider (Works with R2)

```bash
cd /Users/joshuathompson/strapi/strapi
npm install @strapi/provider-upload-aws-s3
```

Then in `config/plugins.js`:

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('R2_ACCESS_KEY_ID'),
        secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
        region: 'auto',
        endpoint: `https://${env('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
        params: {
          Bucket: env('R2_BUCKET_NAME'),
        },
      },
    },
  },
});
```

### Step 2: Get Strapi Upload API Token

1. Go to Strapi Admin: `http://localhost:1337/admin` (or your production URL)
2. Navigate to **Settings** → **API Tokens**
3. Click **Create new API Token**
4. Configuration:
   - **Name**: "Make.com File Upload"
   - **Token type**: "Custom"
   - **Token duration**: "Unlimited"
   - **Permissions**: 
     - `upload.files` → `create` ✅
     - `upload.files` → `update` ✅
     - Any other content types you need
5. Click **Save** and copy the token

### Step 3: Upload Files via Make.com

#### Make.com Scenario:

```plaintext
[Trigger] → [HTTP: Make a Request]
```

#### HTTP Module Configuration:

**URL:**
```
https://your-strapi-domain.com/api/upload
```
or locally:
```
http://localhost:1337/api/upload
```

**Method:** `POST`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_STRAPI_API_TOKEN"
}
```

**Body Type:** `Multipart/form-data`

**Fields:**
```
files: [Your file data from previous module]
```

**Optional fields:**
```
fileInfo: {
  "name": "my-file.jpg",
  "caption": "File uploaded from Make.com",
  "alternativeText": "Description for accessibility"
}
```

#### Example Make.com Modules:

```plaintext
1. [Webhook] → Receive file
   Output: file URL or file data

2. [HTTP: Get a file] → Download file if URL provided
   URL: {{1.fileUrl}}
   Output: file binary data

3. [HTTP: Make a Request] → Upload to Strapi
   URL: https://your-strapi.com/api/upload
   Method: POST
   Headers:
     - Authorization: Bearer YOUR_TOKEN
   Body Type: Multipart/form-data
   Fields:
     - files: {{2.data}}
     - fileInfo: {"name": "{{2.filename}}", "alternativeText": "Uploaded file"}

4. [Parse Response] → Extract file data
   Output: file ID, URL, formats, etc.
```

#### Response Structure:

```json
[
  {
    "id": 1,
    "name": "my-file.jpg",
    "alternativeText": "Description",
    "caption": null,
    "width": 1920,
    "height": 1080,
    "formats": {
      "thumbnail": {...},
      "small": {...},
      "medium": {...},
      "large": {...}
    },
    "hash": "my_file_a1b2c3d4e5",
    "ext": ".jpg",
    "mime": "image/jpeg",
    "size": 245.67,
    "url": "/uploads/my_file_a1b2c3d4e5.jpg",
    "provider": "cloudflare",
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z"
  }
]
```

### Step 4: Link File to Content (Optional)

If you want to attach the file to a specific content entry:

**URL:**
```
PUT https://your-strapi.com/api/blog-posts/{{entryId}}
```

**Body:**
```json
{
  "data": {
    "featuredImage": {{uploadedFileId}}
  }
}
```

### Complete Example Scenario:

```plaintext
1. [Google Drive: Watch Files] → Trigger when new file added
2. [Google Drive: Download File] → Get file data
3. [HTTP: Upload to Strapi] → Upload file
4. [JSON: Parse] → Extract file URL and ID
5. [Webhook Response] → Send back file URL
```

---

## 🔧 Option 2: Direct Upload to Cloudflare R2 (HTTP Module)

Use this if you don't want to go through Strapi.

### Prerequisites:

1. **R2 Bucket** created in Cloudflare
2. **R2 API Token** with Read & Write permissions
3. **Account ID** from Cloudflare R2 dashboard

### Step 1: Get R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **R2** in sidebar
3. Click **Manage R2 API Tokens**
4. Create new token:
   - **Permissions**: Object Read & Write
   - **Bucket**: Your bucket or "All buckets"
5. Save:
   - Access Key ID
   - Secret Access Key
   - Account ID (from R2 overview page)
   - Bucket Name

### Step 2: Create AWS Signature v4 Function in Make.com

Unfortunately, Make.com doesn't have built-in AWS signature generation, so you need to:

#### Option A: Use Make.com's AWS S3 Module

**Module**: AWS S3 → Upload a File

**Connection Setup:**
- **AWS Access Key ID**: Your R2 Access Key
- **AWS Secret Access Key**: Your R2 Secret Access Key  
- **Region**: `auto`
- **Custom Endpoint**: `https://[ACCOUNT_ID].r2.cloudflarestorage.com`

**Module Settings:**
- **Bucket Name**: `your-bucket-name`
- **Key**: `uploads/{{formatDate(now; "YYYY-MM-DD")}}/{{1.filename}}`
- **File Data**: `{{1.data}}`
- **ACL**: `public-read` (for publicly accessible files)
- **Content-Type**: `{{1.mimeType}}` or specific type like `image/jpeg`

#### Option B: Use Pre-signed URL (More Complex)

This requires generating a pre-signed URL, which is complex without AWS SDK. Better to use Option A.

### Step 3: Complete Make.com Scenario

```plaintext
1. [Trigger] → Your trigger (Webhook, Google Drive, Email, etc.)

2. [Router] → (Optional) Split by file type
   - Route 1: Images → Optimize before upload
   - Route 2: PDFs → Direct upload
   - Route 3: Other → Validate and upload

3. [AWS S3: Upload File] 
   Connection: R2 (configured above)
   Bucket: your-bucket-name
   Key: uploads/{{formatDate(now; "YYYY-MM")}}/{{uuid}}-{{1.filename}}
   Data: {{1.data}}
   ACL: public-read

4. [Set Variable] → Save file URL
   Variable: fileUrl
   Value: https://[BUCKET].[ACCOUNT_ID].r2.cloudflarestorage.com/{{3.key}}

5. [Response/Action] → Use the file URL
   - Send to webhook
   - Update database
   - Send email notification
```

### Step 4: Test the Upload

**Test File URL Format:**
```
https://[BUCKET_NAME].[ACCOUNT_ID].r2.cloudflarestorage.com/[FILE_PATH]
```

Example:
```
https://my-bucket.abc123def456.r2.cloudflarestorage.com/uploads/2025-11/my-file.jpg
```

---

## 🎯 Comparison: Strapi vs Direct R2

| Feature | Via Strapi | Direct R2 |
|---------|-----------|-----------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ Simple API call | ⭐⭐⭐ Requires AWS module |
| **File Management** | ✅ Built-in media library | ❌ Manual management |
| **Metadata** | ✅ Alt text, captions, etc. | ❌ None |
| **Image Transformations** | ✅ Auto-generated sizes | ❌ Manual |
| **Content Linking** | ✅ Easy to link to posts | ❌ Manual tracking |
| **Access Control** | ✅ API tokens & permissions | ⚠️ Bucket-level only |
| **Already Integrated** | ✅ Your site uses Strapi | ❌ New integration |
| **Best For** | Images, documents for CMS | Large files, raw storage |

---

## 📝 Recommended Workflow

### For Content Images (Blog, Products, etc.)

```plaintext
[Trigger] → [Upload to Strapi] → [Link to Content Entry]
```

**Why:** Automatic image optimization, metadata management, content relationships

### For User Uploads / Form Attachments

```plaintext
[Form Submission] → [Upload to Strapi] → [Store File ID in Database]
```

**Why:** Easy file management, built-in validation, media library access

### For Large Files / Backups

```plaintext
[Trigger] → [Direct Upload to R2] → [Store URL in Database]
```

**Why:** Lower overhead, no Strapi processing, cost-effective for large files

---

## 🔒 Security Best Practices

### For Strapi Uploads:

1. **Use custom API tokens** - Don't reuse admin tokens
2. **Limit permissions** - Only grant `upload.files.create`
3. **Add file validation** - Configure allowed file types in Strapi
4. **Set file size limits** - Prevent large uploads
5. **Use HTTPS** - Always use secure connections

### For R2 Direct Uploads:

1. **Use restricted API tokens** - Limit to specific bucket
2. **Validate before upload** - Check file type/size in Make.com
3. **Use unique filenames** - Prevent overwrites: `{{uuid}}-{{filename}}`
4. **Set bucket CORS** - Restrict access domains
5. **Monitor usage** - Set up billing alerts

---

## 🧪 Testing Your Setup

### Test Strapi Upload (via curl):

```bash
curl -X POST \
  'http://localhost:1337/api/upload' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'files=@/path/to/file.jpg' \
  -F 'fileInfo={"name":"test-image.jpg","alternativeText":"Test"}'
```

### Test R2 Upload via Make.com:

1. Create simple scenario with Webhook trigger
2. Add AWS S3 upload module
3. Run scenario once manually
4. Check file appears in R2 bucket
5. Verify file URL is accessible

---

## 💡 Pro Tips

### For Strapi:

- **Use file relationships** - Link files to content types
- **Leverage media library** - Browse/reuse uploaded files
- **Set up image optimization** - Strapi auto-generates thumbnails
- **Add custom fields** - Extend upload model for metadata
- **Use webhooks** - Trigger actions on file upload

### For Make.com:

- **Generate unique filenames** - Use `{{uuid}}` or `{{timestamp}}`
- **Organize with folders** - Use date-based paths: `uploads/2025-11/`
- **Add error handling** - Retry failed uploads
- **Validate file types** - Use routers to check extensions
- **Log uploads** - Send notifications on success/failure

### For Both:

- **Test locally first** - Use Strapi dev server
- **Monitor storage usage** - Set up alerts
- **Backup regularly** - Keep copies of important files
- **Use descriptive names** - Makes debugging easier
- **Document your workflow** - For future maintenance

---

## 🚨 Troubleshooting

### Strapi: 403 Forbidden

**Cause:** Invalid or missing API token  
**Solution:** 
- Check token is correct
- Verify token has `upload.files.create` permission
- Ensure token hasn't expired

### Strapi: 413 Payload Too Large

**Cause:** File exceeds size limit  
**Solution:**
- Check Strapi's upload size limit
- Compress file before upload
- Configure max file size in Strapi

### R2: Access Denied

**Cause:** Invalid AWS credentials or permissions  
**Solution:**
- Verify Access Key and Secret Key
- Check token has write permissions
- Confirm bucket name is correct

### Make.com: Connection timeout

**Cause:** File too large or slow network  
**Solution:**
- Increase timeout in Make.com
- Reduce file size
- Use chunked upload (if available)

---

## 📚 Additional Resources

- [Strapi Upload Plugin Docs](https://docs.strapi.io/dev-docs/plugins/upload)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Make.com AWS S3 Module](https://www.make.com/en/help/app/aws-s3)
- [Strapi Upload API Reference](https://docs.strapi.io/dev-docs/api/rest/upload)

---

## 🎉 You're All Set!

**Recommended approach:** Start with **Strapi uploads** - it's easier, more maintainable, and already integrated with your site.

If you need help with specific Make.com scenario, let me know what trigger you're using and what type of files you're uploading!





