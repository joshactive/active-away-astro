const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, PUT, POST',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-file-name, x-upload-metadata'
};

const methodNotAllowed = () => new Response('Method not allowed', {
  status: 405,
  headers: corsHeaders
});

export default {
  /**
   * @param {Request} request
   * @param {{ ACTIVE_AWAY_R2: R2Bucket, UPLOAD_TOKEN?: string }} env
   * @param {ExecutionContext} ctx
   */
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!['PUT', 'POST'].includes(request.method)) {
      return methodNotAllowed();
    }

    if (!env.ACTIVE_AWAY_R2) {
      console.error('R2 bucket binding "ACTIVE_AWAY_R2" is missing.');
      return jsonResponse({ error: 'Storage backend unavailable' }, 500);
    }

    if (!env.UPLOAD_TOKEN) {
      console.error('Missing UPLOAD_TOKEN secret.');
      return jsonResponse({ error: 'Server misconfigured' }, 500);
    }

    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${env.UPLOAD_TOKEN}`) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const url = new URL(request.url);
    const objectKey = getObjectKey(url, request);

    if (!objectKey) {
      return jsonResponse({
        error: 'Missing object key. Provide it in the path (/folder/file), ?key= query, or x-file-name header.'
      }, 400);
    }

    try {
      const payload = await resolvePayload(request);
      const customMetadata = parseMetadataHeader(request.headers.get('x-upload-metadata'));

      const r2Object = await env.ACTIVE_AWAY_R2.put(objectKey, payload.body, {
        httpMetadata: {
          contentType: payload.contentType
        },
        customMetadata
      });

      return jsonResponse({
        key: objectKey,
        etag: r2Object?.etag ?? null,
        size: r2Object?.size ?? payload.contentLength ?? null,
        uploadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Upload failed', error);
      return jsonResponse({ error: error.message ?? 'Upload failed' }, 500);
    }
  }
};

/**
 * @param {URL} url
 * @param {Request} request
 */
function getObjectKey(url, request) {
  const headerKey = request.headers.get('x-file-name');
  const queryKey = url.searchParams.get('key');
  const pathKey = url.pathname.replace(/^\/+/, '');
  const rawKey = headerKey || queryKey || pathKey;

  if (!rawKey) {
    return null;
  }

  const decoded = decodeURIComponent(rawKey.trim());
  if (!decoded || decoded.includes('..')) {
    return null;
  }

  return decoded;
}

/**
 * @param {Request} request
 * @returns {Promise<{ body: ReadableStream | ArrayBuffer, contentType: string, contentLength?: number }>}
 */
async function resolvePayload(request) {
  const contentTypeHeader = request.headers.get('content-type') || '';
  const normalizedContentType = contentTypeHeader.toLowerCase();

  if (request.method === 'PUT' && !normalizedContentType.includes('application/json')) {
    if (!request.body) {
      throw new Error('Request body is empty');
    }

    return {
      body: request.body,
      contentType: contentTypeHeader || 'application/octet-stream'
    };
  }

  if (normalizedContentType.includes('application/json')) {
    const data = await request.json();

    if (typeof data.fileUrl === 'string' && data.fileUrl.length > 0) {
      const downloaded = await fetch(data.fileUrl);

      if (!downloaded.ok || !downloaded.body) {
        throw new Error(`Failed to fetch file from ${data.fileUrl} (${downloaded.status})`);
      }

      const downloadedContentType = downloaded.headers.get('content-type') || 'application/octet-stream';
      const lengthHeader = downloaded.headers.get('content-length');

      return {
        body: downloaded.body,
        contentType: data.contentType || downloadedContentType,
        contentLength: lengthHeader ? Number(lengthHeader) : undefined
      };
    }

    if (typeof data.base64 === 'string' && data.base64.length > 0) {
      const binary = decodeBase64(data.base64);
      return {
        body: binary,
        contentType: data.contentType || 'application/octet-stream',
        contentLength: binary.byteLength
      };
    }

    throw new Error('JSON payload must include either "fileUrl" or "base64"');
  }

  if (!request.body) {
    throw new Error('Request body is empty');
  }

  return {
    body: request.body,
    contentType: contentTypeHeader || 'application/octet-stream'
  };
}

/**
 * @param {string | null} metadataHeader
 * @returns {Record<string, string> | undefined}
 */
function parseMetadataHeader(metadataHeader) {
  if (!metadataHeader) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(metadataHeader);
    if (!parsed || typeof parsed !== 'object') {
      return undefined;
    }

    const entries = Object.entries(parsed).map(([key, value]) => [key, String(value)]);
    return Object.fromEntries(entries);
  } catch (error) {
    console.warn('Failed to parse x-upload-metadata header', error);
    return undefined;
  }
}

/**
 * @param {string} base64
 */
function decodeBase64(base64) {
  const sanitized = base64.trim();
  const binary = atob(sanitized);
  const buffer = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    buffer[i] = binary.charCodeAt(i);
  }

  return buffer;
}

/**
 * @param {unknown} data
 * @param {number} [status=200]
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'content-type': 'application/json; charset=utf-8'
    }
  });
}

