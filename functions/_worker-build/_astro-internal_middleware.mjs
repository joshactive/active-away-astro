globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getRedirects } from './chunks/strapi_o4DRQMSu.mjs';
import './chunks/astro-designed-error-pages_vRC5pxF8.mjs';
import './chunks/astro/server_BeIGjyuI.mjs';
import { s as sequence } from './chunks/index_mB7vn6XK.mjs';

const REDIRECT_CACHE_TTL = 1e3 * 60 * 5;
let redirectCache = null;
const getCachedRedirects = async () => {
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
const normalizePathname = (pathname) => {
  if (!pathname) return "/";
  return pathname.toLowerCase().replace(/\/{2,}/g, "/") || "/";
};
const onRequest$2 = async (context, next) => {
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

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
