import { fork } from "effector";

export function onBeforeRenderClient(pageContext: Vike.PageContext) {
  if (!("scope" in pageContext)) {
    return {
      pageContext: {
        scope: fork({ values: pageContext.scopeValues }),
      },
    };
  }
}
