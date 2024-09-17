import type { EventCallable } from "effector";

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      config: {
        pageStarted?: EventCallable<{ params: Record<string, string>; data: unknown }>;
        pageClientStarted?: EventCallable<void>;
      };
      scopeValues?: Record<string, unknown>;
    }
  }
}

// Tell TypeScript this file isn't an ambient module
export {};
