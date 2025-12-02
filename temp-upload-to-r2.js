#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const UPLOAD_URL = 'https://active-away-r2-upload.josh-5da.workers.dev';
const UPLOAD_TOKEN = '83224072f2ed2a7a640a8bf6d342a28da334be0ca7b5184b9a123391c2140a08';

async function uploadFile(filePath, r2Key) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  
  console.log(`Uploading ${fileName} to R2 as ${r2Key}...`);
  
  const response = await fetch(`${UPLOAD_URL}/${r2Key}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${UPLOAD_TOKEN}`,
      'Content-Type': 'application/pdf',
      'x-upload-metadata': JSON.stringify({
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
        source: 'wordpress-migration-test'
      })
    },
    body: fileBuffer
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed (${response.status}): ${errorText}`);
  }
  
  const result = await response.json();
  console.log(`✅ Uploaded: ${r2Key}`);
  console.log(`   ETag: ${result.etag}`);
  console.log(`   Size: ${result.size} bytes`);
  console.log(`   Public URL: https://files.activeaway.com/${r2Key}`);
  
  return result;
}

async function main() {
  const files = [
    {
      local: '/Users/joshuathompson/active-away-astro/temp-wp-pdfs/2024-Calendar_compressed.pdf',
      r2Key: 'wp-content/uploads/2024-Calendar_compressed.pdf'
    },
    {
      local: '/Users/joshuathompson/active-away-astro/temp-wp-pdfs/0.-Airport-Sign.pdf',
      r2Key: 'wp-content/uploads/0.-Airport-Sign.pdf'
    }
  ];
  
  console.log('Starting test upload to R2...\n');
  
  for (const file of files) {
    try {
      await uploadFile(file.local, file.r2Key);
      console.log('');
    } catch (error) {
      console.error(`❌ Error uploading ${file.local}:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('All test PDFs uploaded successfully!');
  console.log('\nTest these URLs:');
  console.log('- https://files.activeaway.com/wp-content/uploads/2024-Calendar_compressed.pdf');
  console.log('- https://files.activeaway.com/wp-content/uploads/0.-Airport-Sign.pdf');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

