import { createEvent } from "effector";

export const appStarted = createEvent();

export function createPageStart<T = void>() {
  const pageStarted = createEvent<{ params: Record<string, string>; data: T }>();
  return pageStarted;
}
