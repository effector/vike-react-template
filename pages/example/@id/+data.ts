import type { PageContextServer } from "vike/types";

export async function data(pageContext: PageContextServer) {
  const { routeParams } = pageContext;
  const { id } = routeParams;

  return {
    sampleData: { id: id ?? "<empty>" },
  };
}
