import { allSettled, fork, serialize } from "effector";
import { redirect } from "vike/abort";
import type { OnBeforeRenderAsync } from "vike/types";
import { appStarted } from "~/shared/init";
import { $redirectTo } from "~/shared/routing";

// https://vike.dev/onBeforeRender
export const onBeforeRender: OnBeforeRenderAsync = async (pageContext) => {
  // https://vike.dev/pageContext
  const { pageStarted } = pageContext.config;

  // https://effector.dev/en/api/effector/fork/
  const scope = fork();

  // https://effector.dev/en/api/effector/allsettled/#methods-allSettled-unit-scope-params
  await allSettled(appStarted, { scope });

  if (pageStarted) {
    await allSettled(pageStarted, { scope, params: { params: pageContext.routeParams, data: pageContext.data } });
  }

  // https://effector.dev/en/api/effector/scope/#methods-getState
  const redirectTo = scope.getState($redirectTo);
  if (redirectTo) {
    // https://vike.dev/redirect
    throw redirect(redirectTo);
  }

  return {
    pageContext: {
      scope,
      // https://effector.dev/en/api/effector/serialize
      scopeValues: serialize(scope),
    },
  };
};
