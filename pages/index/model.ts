import { createEffect, createStore, sample } from "effector";

import { pageStarted } from "./+pageStarted";

const randomFx = createEffect(({ message }: { message: string }) => {
  const number = Math.round(Math.random() * 1000);
  return `${message} ${number}`;
});

export const $random = createStore("");

sample({
  clock: pageStarted,
  fn: () => ({ message: "home page started" }),
  target: randomFx,
});

$random.on(randomFx.doneData, (_, text) => text);
