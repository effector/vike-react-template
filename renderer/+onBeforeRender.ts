import { allSettled, fork, serialize } from "effector";
import { redirect } from "vike/abort";
import type { OnBeforeRenderAsync } from "vike/types";
import { appStarted } from "~/shared/init";
import { $redirectTo } from "~/shared/routing";

export const onBeforeRender: OnBeforeRenderAsync = async (pageContext) => {
  const { pageStarted } = pageContext.config;

  const scope = fork();
  await allSettled(appStarted, { scope });

  if (pageStarted) {
    await allSettled(pageStarted, { scope, params: { params: pageContext.routeParams, data: pageContext.data } });
  }

  const redirectTo = scope.getState($redirectTo);
  if (redirectTo) {
    throw redirect(redirectTo);
  }

  return {
    pageContext: {
      scope,
      scopeValues: serialize(scope),
    },
  };
};
