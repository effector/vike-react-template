import { allSettled, fork, serialize } from "effector";

// https://vike.dev/onBeforeRenderClient
export async function onBeforeRenderClient(pageContext: Vike.PageContext) {
  // https://vike.dev/pageContext

  const scope = fork({ values: pageContext.scopeValues });

  const pageClientStarted = pageContext.config.pageClientStarted;

  if (pageClientStarted) {
    await allSettled(pageClientStarted, { scope });
  }

  pageContext.scopeValues = serialize(scope);
}
