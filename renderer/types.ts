import type { EventCallable, Scope } from "effector";

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      config: {
        pageStarted?: EventCallable<{ params: Record<string, string>; data: unknown }>;
      };

      // https://effector.dev/en/api/effector/scope/
      scope?: Scope;
      scopeValues?: Record<string, unknown>;
    }
  }
}

// Tell TypeScript this file isn't an ambient module
export {};
