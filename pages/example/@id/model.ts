import { createStore, sample } from "effector";
import { redirectTo } from "~/shared/routing";

import { pageClientStarted } from "./+pageClientStarted";
import { pageStarted } from "./+pageStarted";

export const $id = createStore("");
export const $clientId = createStore(0);

const dataInitialized = sample({
  clock: pageStarted,
  fn: ({ data }) => data,
});

sample({
  clock: dataInitialized,
  filter: ({ sampleData: { id } }) => id === "10",
  target: redirectTo("/"),
});

sample({
  clock: dataInitialized,
  fn: ({ sampleData: { id } }) => id,
  target: $id,
});

sample({
  clock: pageClientStarted,
  fn: () => 1,
  target: $clientId,
});
