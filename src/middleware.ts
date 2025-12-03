import type { MiddlewareHandler } from 'astro';
import { getRedirects } from './utils/strapi.js';

type RedirectEntry = {
  sourcePath: string;
  destinationPath: string;
  statusCode: number;
};

const REDIRECT_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

let redirectCache: {
  redirects: RedirectEntry[];
  expiresAt: number;
} | null = null;

const getCachedRedirects = async (): Promise<RedirectEntry[]> => {
  const now = Date.now();
  if (!redirectCache || now > redirectCache.expiresAt) {
    const redirects = await getRedirects();
    redirectCache = {
      redirects,
      expiresAt: now + REDIRECT_CACHE_TTL
    };
  }
  return redirectCache.redirects;
};

const normalizePathname = (pathname: string) => {
  if (!pathname) return '/';
  return pathname.toLowerCase().replace(/\/{2,}/g, '/') || '/';
};

declare global {
  // eslint-disable-next-line no-var
  var __RUNTIME_ENV__: Record<string, unknown> | undefined;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const runtimeEnv = context.locals?.runtime?.env;

  if (runtimeEnv) {
    globalThis.__RUNTIME_ENV__ = runtimeEnv;
  }

  const requestUrl = new URL(context.request.url);
  const normalizedPath = normalizePathname(requestUrl.pathname);
  const redirects = await getCachedRedirects();
  const match = redirects.find((redirect) => redirect.sourcePath === normalizedPath);

  if (match) {
    // Handle 410 Gone status specifically
    if (match.statusCode === 410) {
      if (runtimeEnv?.DEV) {
        console.log(`🛑 Serving 410 Gone for ${normalizedPath}`);
      }
      
      // Return a simple 410 page matching the site's theme roughly
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>410 - Page Gone | Active Away</title>
          <meta name="robots" content="noindex, nofollow">
          <style>
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; }
            .container { max-width: 600px; padding: 20px; }
            h1 { font-family: 'Playfair Display', serif; font-size: 3rem; margin-bottom: 1rem; color: #ad986c; }
            p { font-size: 1.2rem; color: #ccc; line-height: 1.6; margin-bottom: 2rem; }
            a { display: inline-block; background-color: #ad986c; color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 600; transition: background 0.3s; }
            a:hover { background-color: #8d7a56; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Page No Longer Available</h1>
            <p>The content you are looking for has been permanently removed and is no longer available.</p>
            <a href="/">Return Home</a>
          </div>
        </body>
        </html>
      `;
      
      return new Response(html, {
        status: 410,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // Handle standard redirects (301, 302, etc.)
    if (match.destinationPath !== normalizedPath) {
      const destinationUrl = new URL(match.destinationPath, requestUrl.origin);

      const finalSearchParams = new URLSearchParams(requestUrl.search);
      for (const [key, value] of destinationUrl.searchParams.entries()) {
        finalSearchParams.set(key, value);
      }
      const finalSearch = finalSearchParams.toString();
      destinationUrl.search = finalSearch ? `?${finalSearch}` : '';

      destinationUrl.hash = requestUrl.hash;

      if (runtimeEnv?.DEV) {
        console.log(`🔀 Redirecting ${normalizedPath} -> ${destinationUrl.pathname} (${match.statusCode})`);
      }

      return Response.redirect(destinationUrl.toString(), match.statusCode);
    }
  }

  return next();
};



