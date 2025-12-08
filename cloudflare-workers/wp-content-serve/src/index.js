/**
 * Cloudflare Worker to proxy WordPress /wp-content/uploads/ requests to R2
 * 
 * This worker ONLY handles requests to /wp-content/uploads/* paths.
 * All other requests are passed through unchanged to preserve existing functionality.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // SAFETY CHECK: Only handle /wp-content/uploads/* paths
    // All other paths pass through unchanged
    if (!url.pathname.startsWith('/wp-content/uploads/')) {
      // Not our responsibility - pass through to origin
      return fetch(request);
    }
    
    // Log for debugging (visible in wrangler tail)
    console.log(`[wp-content-serve] Proxying: ${url.pathname}`);
    
    // Construct R2 public URL
    const r2Url = `https://files.activeaway.com${url.pathname}`;
    
    try {
      // Fetch from R2
      const response = await fetch(r2Url);
      
      // If not found in R2, return 404
      if (!response.ok) {
        console.log(`[wp-content-serve] File not found in R2: ${url.pathname}`);
        return new Response('File not found', {
          status: 404,
          headers: {
            'Content-Type': 'text/plain'
          }
        });
      }
      
      // Clone response and add caching headers
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
      headers.set('X-Served-By', 'wp-content-serve-worker');
      
      // Return the file with caching headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
      
    } catch (error) {
      console.error(`[wp-content-serve] Error proxying ${url.pathname}:`, error);
      return new Response('Internal server error', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
};






