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

  if (match && match.destinationPath !== normalizedPath) {
    const destinationUrl = new URL(match.destinationPath, requestUrl.origin);
    destinationUrl.search = requestUrl.search;
    destinationUrl.hash = requestUrl.hash;

    if (runtimeEnv?.DEV) {
      console.log(`🔀 Redirecting ${normalizedPath} -> ${destinationUrl.pathname} (${match.statusCode})`);
    }

    return Response.redirect(destinationUrl.toString(), match.statusCode);
  }

  return next();
};



