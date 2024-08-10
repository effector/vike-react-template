import path from "node:path";

import type { CookieSerializeOptions } from "@fastify/cookie";
import "dotenv/config";
import fastify from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { renderPage } from "vike/server";

import { CONFIG } from "./config.js";
import { directoryRoot } from "./directory-root.js";

export async function createServer(isProduction: boolean) {
  const app = fastify({
    trustProxy: true,
    logger: isProduction
      ? true
      : {
          level: "warn",
          transport: {
            target: "pino-pretty",
          },
        },
  });

  await app.register(import("@fastify/compress"), { global: true });

  await app.register(import("@fastify/early-hints"), {
    // indicates if the plugin should log warnings if invalid values are supplied as early hints
    warn: true,
  });

  // Vite integration
  if (isProduction) {
    await app.register(import("@fastify/cors"), {
      origin: CONFIG.PUBLIC_HOST,
      methods: ["HEAD", "GET", "POST", "PUT", "PATCH", "DELETE"],
    });

    await app.register(import("@fastify/accepts"));

    await app.register(import("@fastify/cookie"));

    await app.register(import("@fastify/helmet"), { contentSecurityPolicy: false });

    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    await app.register(import("@fastify/static"), {
      root: path.join(directoryRoot, "client", "assets"),
      prefix: "/assets/",
    });

    await app.register(import("@fastify/rate-limit"), {
      max: 100,
      timeWindow: "1 minute",
    });
  } else {
    // We instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our production server.)
    const vite = await import("vite");
    const viteServer = await vite.createServer({
      root: directoryRoot,
      server: { middlewareMode: true },
      logLevel: "error",
    });

    app.addHook("onRequest", async (request, reply) => {
      const next = () =>
        new Promise<void>((resolve) => {
          viteServer.middlewares(request.raw, reply.raw, () => resolve());
        });
      await next();
    });
  } // !isProduction

  // Any custom middlewares here. Like API middlewares, etc.

  // Vike middleware. It should always be our last middleware
  // (because it's a catch-all middleware superseding any middleware placed after it).
  app.get("*", async (request, reply) => {
    // Accessor reads, sets, and removes cookies.
    const cookies = createCookiesAccessor(request, reply);

    // The page context is passed to renderer/+onRenderHtml.tsx
    const pageContextInit = {
      urlOriginal: `${request.protocol}://${request.hostname}${request.url}`,
      cookies,
    };

    const pageContext = await renderPage(pageContextInit);

    if (pageContext.errorWhileRendering) {
      app.log.error({ errorWhileRendering: pageContext.errorWhileRendering }, "Error while rendering page");
      return reply.status(500).send("Error while rendering page");
      // Install error tracking here, see https://vike.dev/errors
    }

    const { httpResponse } = pageContext;
    if (!httpResponse) {
      // TODO: here we could render a 404 page
      return reply.callNotFound();
    }

    const { statusCode, headers, earlyHints } = httpResponse;

    // Write hints before sending the response
    await reply.writeEarlyHints({ Link: earlyHints.map((hint) => hint.earlyHintLink) });

    headers.forEach(([name, value]) => reply.header(name, value));

    reply.status(statusCode).send(httpResponse.body);

    // see https://vike.dev/streaming
    // https://www.npmjs.com/package/react-streaming
    return reply;
  });

  return app;
}

function createCookiesAccessor(request: FastifyRequest, reply: FastifyReply) {
  return {
    get(name: string): string | undefined {
      return request.cookies[name];
    },
    set(name: string, value: string, options: CookieSerializeOptions) {
      reply.setCookie(name, value, options);
    },
    remove(name: string, options: CookieSerializeOptions) {
      reply.clearCookie(name, options);
    },
  };
}
