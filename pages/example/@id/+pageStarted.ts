import { createPageStart } from "~/shared/init";

import type { data } from "./+data";

export const pageStarted = createPageStart<Awaited<ReturnType<typeof data>>>();
