import type { MiddlewareHandler } from 'astro';

declare global {
  // eslint-disable-next-line no-var
  var __RUNTIME_ENV__: Record<string, unknown> | undefined;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const runtimeEnv = context.locals?.runtime?.env;

  if (runtimeEnv) {
    globalThis.__RUNTIME_ENV__ = runtimeEnv;
  }

  return next();
};



