// API endpoint to upload files to Cloudflare R2
export const prerender = false;

// Security configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  // Text
  'text/plain',
  'text/csv'
];

const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.txt', '.csv'
];

export const POST = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ 
        error: 'File too large',
        maxSize: `${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        yourFileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ 
        error: 'File type not allowed',
        allowedTypes: 'PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, WEBP, TXT, CSV'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return new Response(JSON.stringify({ 
        error: 'File extension not allowed',
        allowedExtensions: ALLOWED_EXTENSIONS.join(', ')
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for suspicious file names
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return new Response(JSON.stringify({ error: 'Invalid file name' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Resolve environment variables (supports Cloudflare runtime and import.meta)
    const runtimeEnv = locals?.runtime?.env || {};
    const globalEnv = (globalThis && (globalThis.__env || globalThis.ENV)) || {};
    const R2_UPLOAD_URL =
      runtimeEnv.R2_UPLOAD_URL ||
      globalEnv.R2_UPLOAD_URL ||
      (import.meta.env && import.meta.env.R2_UPLOAD_URL) ||
      'https://r2-upload.activeaway.workers.dev';
    const UPLOAD_TOKEN =
      runtimeEnv.UPLOAD_TOKEN ||
      globalEnv.UPLOAD_TOKEN ||
      (import.meta.env && import.meta.env.UPLOAD_TOKEN) ||
      '';

    const IS_DEV = runtimeEnv.DEV ?? globalEnv.DEV ?? (import.meta.env && import.meta.env.DEV);

    if (!UPLOAD_TOKEN) {
      if (IS_DEV) console.error('❌ [upload-file] UPLOAD_TOKEN not configured');
      return new Response(JSON.stringify({ error: 'Upload not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate secure unique file name
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    // More aggressive sanitization
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    const sanitizedBaseName = baseName
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100); // Limit length
    const sanitizedName = `${sanitizedBaseName}${fileExtension}`;
    const fileKey = `form-uploads/${new Date().toISOString().split('T')[0]}/${timestamp}-${randomStr}-${sanitizedName}`;

    // Upload to R2
    const uploadResponse = await fetch(`${R2_UPLOAD_URL}/${fileKey}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${UPLOAD_TOKEN}`,
        'Content-Type': file.type,
        'x-upload-metadata': JSON.stringify({
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          source: 'form-submission'
        })
      },
      body: file
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      if (IS_DEV) console.error('❌ [upload-file] R2 upload failed:', errorText);
      return new Response(JSON.stringify({ error: 'Upload failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const uploadResult = await uploadResponse.json();
    
    // Build the public URL (served via files.activeaway.com)
    const publicBase =
      (runtimeEnv.R2_PUBLIC_BASE_URL && runtimeEnv.R2_PUBLIC_BASE_URL.trim()) ||
      (globalEnv.R2_PUBLIC_BASE_URL && globalEnv.R2_PUBLIC_BASE_URL.trim()) ||
      (import.meta.env.R2_PUBLIC_BASE_URL && import.meta.env.R2_PUBLIC_BASE_URL.trim()) ||
      'https://files.activeaway.com';
    const publicUrl = `${publicBase.replace(/\/+$/, '')}/${fileKey}`;
    
    if (IS_DEV) console.log('✅ [upload-file] File uploaded:', fileKey);
    
    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      key: fileKey,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const runtimeEnv = locals?.runtime?.env || {};
    const globalEnv = (globalThis && (globalThis.__env || globalThis.ENV)) || {};
    const IS_DEV = runtimeEnv.DEV ?? globalEnv.DEV ?? (import.meta.env && import.meta.env.DEV);
    
    if (IS_DEV) console.error('❌ [upload-file] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: IS_DEV && error instanceof Error ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
