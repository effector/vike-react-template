declare global {
  /** Refine Vike types. */
  namespace Vike {
    /** Extend and/or refine the `PageContext` type (`import type { PageContext } from 'vike/types'`).
     *
     *  For example:
     *  - You can refine the type of `PageContext['Page']`.
     *  - You can define the type of custom `pageContext` values such as `pageContext.user`, see https://vike.dev/pageContext#custom
     *
     *  https://vike.dev/pageContext#typescript
     */
    interface PageContext {}
  }
}

export {};
