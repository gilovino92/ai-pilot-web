# BB

Yet another opinionated React SPA skeleton to quickly bootstrap your project.

- Node (latest LTS)
- pnpm

## TODO

- form validation with `zod`
- loading ui & optimize route critical data loading

## Important stack

[@tanstack/router](https://tanstack.com/router) for routing.

_Must read to understand the basic concept of file-based route and how to use._

- [Route Trees & Nesting](https://tanstack.com/router/latest/docs/framework/react/guide/route-trees)
- [Routing Concepts](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts)
- [Code Splitting](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting)
- [File-Based Routes](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing)
- [Data Loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
- [Authenticated Routes](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)

_Notes_

```
___[onEnter]___<end>_______________________________
____________[beforeLoad]___<end>___________________
________________________________[loader]___<end>___
```

[@tanstack/query](https://tanstack.com/query) for asynchronous state management.

_Notes_

- The most important part is that keys need to be unique for your queries. If React Query finds an entry for a key in the cache, it will use it. Please also be aware that you cannot use the same key for useQuery and useInfiniteQuery. There is, after all, only one Query Cache, and you would share the data between these two. That is not good because infinite queries have a fundamentally different structure than "normal" queries. [See more](https://tkdodo.eu/blog/effective-react-query-keys#caching-data)

_Useful resources._

- [Documentation it self](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TkDodo's blog](https://tkdodo.eu/blog)

[shadcn/ui](https://ui.shadcn.com) for building UI.

[tailwindcss](https://tailwindcss.com) for styling.

_Notes_

- `flex-1` together with `min-w-0` or `min-h-0` to prevent overflow.

[vite](https://vitejs.dev) for all the other thing to work.

## Suggested libraries

- [@tanstack/store](https://tanstack.com/store) for global state management.
- [@tanstack/form](https://tanstack.com/form) for form state management.
- [usehooks-ts](https://usehooks-ts.com) or [@uidotdev/usehooks](https://usehooks.com) for useful hooks.
- [UnJS](https://unjs.io) for other useful utilities, libraries, tools.

## Upgrade libraries

TL;DR

```
pnpx taze minor -w && pnpm install
```

Read more:

- [taze](https://github.com/antfu-collective/taze)
- [nolyfill](https://github.com/SukkaW/nolyfill)
