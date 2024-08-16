import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

// https://vike.dev/config
export default {
  // https://vike.dev/clientRouting
  clientRouting: true,

  // https://vike.dev/passToClient
  passToClient: ["scopeValues"],

  // https://vike.dev/meta
  meta: {
    pageStarted: {
      env: { client: true, server: true },
    },
    // https://effector.dev/en/api/effector/scope/
    scope: {
      env: { client: true, server: true },
    },
  },

  // https://vike.dev/extends
  extends: [vikeReact],

  // https://vike.dev/hydrationCanBeAborted
  hydrationCanBeAborted: true,
} satisfies Config;
