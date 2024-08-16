# Effector SSR Vike Application Template

This project is a template for quickly starting a Server-Side Rendering (SSR) Node.js application, combining a powerful set of vite, react, effector, and fastify.

## Features

- **File-system routing** implemented by Vike;
- **Effector** to cover state management cases;
- **React.js** to use the giant ecosystem of UI components;

## Used Tools

- **TypeScript**: v5 with [ts-node](https://npmjs.com/ts-node)
- **React**: v18
- **Vite**: v5 with [vite-plugin-svgr](https://npmjs.com/vite-plugin-svgr), [@vitejs/plugin-react](https://npmjs.com/@vitejs/plugin-react)
- **Vike**: v0.4 with [vike-react](https://npmjs.com/vike-react) and few hooks in ./renderer
- **Fastify**: v4 with [cookie](https://npmjs.com/cookie), [cors](https://npmjs.com/cors), [early-hints](https://npmjs.com/early-hints), [helmet](https://npmjs.com/helmet), [rate-limit](https://npmjs.com/rate-limit), more.
- **Effector**: v23 with [patronum](https://npmjs.com/patronum), [reflect](https://npmjs.com/@effector/reflect), [factorio](https://npmjs.com/effector-factorio)
- **Zod**: v3
- **SVGR**: as [vite-plugin-svgr](https://npmjs.com/vite-plugin-svgr) v4
- **Prettier**: v3 with [plugin-sort-imports](@trivago/prettier-plugin-sort-imports) by trivago

## Requirements

- Node.js 18.6+
- corepack enabled (but can be used without)

## Use this template

0. Press "Use this template" to create a copy of repository.

1. Clone your repository:

```bash
git clone https://github.com/effector/vike-react-template my-app
# OR
gh repo clone effector/vike-react-template my-app
```

2. Navigate to the project directory:

```bash
cd my-app
```

3. Install package manager and dependencies:

```bash
corepack enable
corepack prepare
pnpm install
```

## Usage

1. Run in development mode:

```bash
pnpm dev
```

2. Build for production:

```bash
pnpm build
```

3. Run production version:

```bash
pnpm start
```

## Project Structure

Strongly recommend to carefully **review each file** in this repository, before using it in production.

This project inherites [Vike project structure](https://vike.dev/file-structure):

    dist/
    pages/
    public/
    renderer/
    server/
    src/

- `dist` contains result of `pnpm build`, it is production build;
- `pages` is a Vike's [filesystem routing](https://vike.dev/routing#filesystem-routing);
- `public` is a [static files directory](https://vike.dev/static-directory#public);
- `renderer` is a react + effector [integration hooks](https://vike.dev/file-structure#renderer);
- `server` is a fastify server, builds with `tsc`, runs with `ts-node`;
- `src` is a [FSD](https://feature-sliced.design) basis, with code imported into `pages`, and `renderer`;

### `pages/`

#### `pages/+Wrapper.tsx`

It is a data provider for logic uses effector.

#### `pages/+Layout.tsx`

To wrap up components with some layout use [`+Layout.tsx`](https://vike.dev/Layout).

Also, you can [nest multiple layouts](https://vike.dev/Layout#nested-layouts).

#### `pages/index/+pageStarted.ts`

This vike hook describes what event Vike should call on server when page logic can be started.

Usually looks like this:

```ts
import { createPageStart } from "~/shared/init";

export const pageStarted = createPageStart();

// pageStarted has type:
pageStarted: EventCallable<{
  params: Record<string, string>;
  data: void;
}>;
```

`params` looks like `{ id: "foo" }` for route `pages/example/@id` and pathname `/example/foo`.

| Url          | Route             | `params`        |
| ------------ | ----------------- | --------------- |
| /            | pages/index       | `{}`            |
| /example/100 | pages/example/@id | `{ id: "100" }` |

#### `pages/index/+Page.tsx`

This is a page component. It can import `model.ts` and all from src using `~/` alias.

Use `export default` and named functions:

```tsx
export default function PageHome() {
  return <h1>Hello World</h1>;
}
```

#### `pages/index/model.ts`

This is a logic file written in effector. It can import `+pageStarted.ts` and all from src using `~/` alias.

```ts
import { createEffect, sample } from "effector";

import { pageStarted } from "./+pageStarted";

const helloFx = createEffect((name: string) => {
  console.info(`Hello ${name}`);
});

sample({
  clock: pageStarted,
  fn: () => "World",
  target: helloFx,
});
```

When user opened http://localhost:3000, `pageStarted` fired, then sample with `clock: pageStarted` reacts and triggers `helloFx` with `"World"` argument.

In our dynamic and event driven kind of environment, this is the powerful way to describe logic.
**Without needing to deal with React**, Hooks, Rerenders, StrictMode, Next.js, etc.

### `pages/example/@id`

Let's talk about data loading.

You can always use simple `createEffect` to load data in Browser, just react on user actions, not `pageStarted` nor `appStarted`.

Until, you read [Data Fetching article](https://vike.dev/data-fetching) from Vike.dev. It will works until [Client-Side Routing](https://vike.dev/client-routing).
Vike has `+data.ts` hook to fetch data on client and server navigation.

> In case of refetch data using triggering some event on client side, or changing filters in user interface consider making client navigation with query parameters.

#### `pages/example/@id/+data.ts`

Declare your data fetcher. Name of the exported function must be `data`. Use this as starting point:

```ts
import type { PageContextServer } from "vike/types";

export async function data(pageContext: PageContextServer) {
  const { routeParams } = pageContext;
  const { id } = routeParams;

  // await api.someItems.getById(id)

  return {
    sampleData: { id: id ?? "<empty>" },
  };
}
```

Consider placing all reusable API requests into `src/shared/api`.
Using barrel file pattern is optional but very useful.

#### `pages/example/@id/+pageStarted.ts`

In case of data loading, hook pageStarted should be modified:

```ts
import { createPageStart } from "~/shared/init";

import type { data } from "./+data";

export const pageStarted = createPageStart<Awaited<ReturnType<typeof data>>>();
```

You need just bind resulting type of your `data` loader function. Vike passes result of `data()` call into `pageStarted` like `{ params: { id }, data }`.

#### `pages/example/@id/model.ts`

So, you can access data from `model` like this:

```ts
import { createStore, sample } from "effector";

import { pageStarted } from "./+pageStarted";

sample({
  clock: pageStarted,
  fn: ({ data, params: { id } }) => data,
  target: insertHereAnyUnit,
});
// you can actually use `source, filter` in sample
```

### `pages/_error`

Component created as `pages/_error/+Page.tsx` is used to show [error page](https://vike.dev/error-page).

### `renderer/`

Here described exact integration of vike, react, and effector.
You may need to read this before changing:

- [Vike Hooks](https://vike.dev/hooks);
- [Build Your Own Framework](https://vike.dev/build-your-own-framework) on top of Vike;
- Don't be shy, read source files, it has links to documentation;

### `server/`

#### `server/config.ts`

Contains resolvers of configuration variables.

```ts
export const CONFIG = {
  get SERVER_PORT() {
    return Number.parseInt(globalThis.process.env.SERVER_PORT ?? "3000", 10);
  },
};
```

> This is the only way it works on Cloudflare Workers. If you have a better solution please [Leave an issue](https://github.com/effector/vike-react-template/issues).

#### `server/directory-root.ts`

Declares project root directory, to resolve static assets from.

#### `server/index.ts`

Creates instance of `server/server`, handles signals SIGINT, SIGTERM.

#### `server/server.ts`

Creates fastify instance, configures plugins, read cookies, renders using vike/server.

You can modify any part of this and any other files. Please, explore documentation before.

#### `server/tsconfig.json`

Used here to describe different environment for files in this directory.

It builds for production with `tsc -p server`. It runs for development with `ts-node` ESM-loader.

There is no hot reload in `server/` directory. Restart manually after changing these files.

### `src/`

Consider using [Feature-Sliced Design](https://feature-sliced.design/) structuring this directory.

#### `src/vike.d.ts`

Handles [`pageContext` typings](https://vike.dev/pageContext#typescript).

#### `src/vite-env.d.ts`

Handles [Vite client types](https://vitejs.dev/guide/features.html#client-types).

## Customization

> What kind of customizations needs to be described? integration with supabase? [Leave an issue](https://github.com/effector/vike-react-template/issues).

### Use different Package Manager

First of all, delete `pnpm-lock.yaml`, dist, and node_modules:

```bash
rm pnpm-lock.yaml
rm -rf node_modules dist
```

#### Node.js v18.x:

Set exact version into `packageManager` field of `package.json`:

```json
// package.json
{
  "packageManager": "npm@10.8.2" // "yarn@3.8.4",
}
```

Save and navigate to your terminal into the project directory:

```bash
# Enable corepack for your shell
corepack enable

# Install package manager for your project
corepack prepare

# Install dependencies
npm install
```

#### Node.js v20+:

Node.js v20 has different version of corepack, so we can use `corepack use`.

```bash
# Enable corepack for your shell
corepack enable

# Install package manager for your project
corepack use npm@latest # yarn@3

# Install dependencies
npm install

# Check packageManager field in package.json
jq .packageManager package.json
#> "yarn@3.8.4+sha256.1ee0e26fb669143425371ab8727fe4c5841640a2fd944863a8e8c28be966aca2"
# It's OK
```

## Supported OS and Node.js

This template has been tested on:

- macOS Sonoma 14.5, Node.js v20.10.0

## Contributing

We welcome contributions to the project! Please read our contribution guidelines before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
