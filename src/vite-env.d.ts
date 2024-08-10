/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  // Define your env variables here. Example:
  // readonly PUBLIC_ENV__SOME_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
