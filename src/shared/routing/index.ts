import { createEffect, createEvent, createStore, sample } from "effector";

export { Link } from "./link";

export const $redirectTo = createStore<string | null>(null, {
  // This store should not be passed from server to browser
  // Because we have different routing system on server and browser.
  serialize: "ignore",
});

export const performRedirect = createEvent<string>();

export function redirectTo<T>(path: string) {
  const redirector = createEvent<T>();

  sample({
    clock: redirector,
    fn: () => path,
    target: performRedirect,
  });

  return redirector;
}

sample({
  clock: performRedirect,
  target: $redirectTo,
});

/**
 * The handler is replaced in renderer/+onRenderClient.ts
 * On the browser we need to replace it into null, to prevent double navigation.
 * But on server we're assuming that after logic is done,
 *  store with redirect is filled if redirect is needed.
 */
export const clientNavigateFx = createEffect((path: string) => path);

sample({
  clock: $redirectTo,
  filter: Boolean,
  target: clientNavigateFx,
});

sample({
  clock: clientNavigateFx.doneData,
  target: $redirectTo,
});
