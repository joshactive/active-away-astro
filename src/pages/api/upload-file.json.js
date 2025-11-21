// API endpoint to upload files to Cloudflare R2
export const prerender = false;

export const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get environment variables
    const R2_UPLOAD_URL = import.meta.env.R2_UPLOAD_URL || 'https://r2-upload.activeaway.workers.dev';
    const UPLOAD_TOKEN = import.meta.env.UPLOAD_TOKEN || '';

    if (!UPLOAD_TOKEN) {
      console.error('❌ [upload-file] UPLOAD_TOKEN not configured');
      return new Response(JSON.stringify({ error: 'Upload not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique file name
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
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
      console.error('❌ [upload-file] R2 upload failed:', errorText);
      return new Response(JSON.stringify({ error: 'Upload failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const uploadResult = await uploadResponse.json();
    
    // Build the public URL (served via files.activeaway.com)
    const publicBase =
      (import.meta.env.R2_PUBLIC_BASE_URL && import.meta.env.R2_PUBLIC_BASE_URL.trim()) ||
      'https://files.activeaway.com';
    const publicUrl = `${publicBase.replace(/\/+$/, '')}/${fileKey}`;
    
    console.log('✅ [upload-file] File uploaded:', fileKey);
    
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
    console.error('❌ [upload-file] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

