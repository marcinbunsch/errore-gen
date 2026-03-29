# errore-gen

Generator helpers for [errore](https://github.com/remorses/errore) — keep linear control flow without nesting.

Originally proposed by [@DeluxeOwl](https://github.com/DeluxeOwl) in [remorses/errore#2](https://github.com/remorses/errore/pull/2).

I extracted into a companion package as suggested by [@remorses](https://github.com/remorses).

## Install

```bash
npm install errore marcinbunsch/errore-gen
```

```bash
pnpm add errore marcinbunsch/errore-gen
```

## Usage

`gen` and `ok` let you write error-handling code that reads top to bottom. `ok` yields the first error and `gen` short-circuits with it.

There are two entrypoints:

### `errore-gen` — standalone

```ts
import { gen, ok } from "errore-gen"
import { matchError } from "errore"

const result = gen(function* () {
  const user = yield* ok(getUser(id))
  const posts = yield* ok(getPosts(user.id))
  return { user, posts }
})
// type: NotFoundError | NetworkError | { user: User; posts: Post[] }

if (result instanceof Error) {
  const message = matchError(result, {
    NotFoundError: (e) => `User not found`,
    NetworkError: (e) => `Network failed: ${e.message}`,
    Error: (e) => `Unexpected: ${e.message}`,
  })
  console.log(message)
}
```

### `errore-gen/errore` — with errore

Re-exports everything from `errore` plus `gen` and `ok`, so you can use a single import:

```ts
import * as errore from "errore-gen/errore"

const result = errore.gen(function* () {
  const user = yield* errore.ok(getUser(id))
  const posts = yield* errore.ok(getPosts(user.id))
  return { user, posts }
})
// type: NotFoundError | NetworkError | { user: User; posts: Post[] }

if (result instanceof Error) {
  const message = errore.matchError(result, {
    NotFoundError: (e) => `User not found`,
    NetworkError: (e) => `Network failed: ${e.message}`,
    Error: (e) => `Unexpected: ${e.message}`,
  })
  console.log(message)
}
```

### Async

Both entrypoints work with async generators:

```ts
const result = await gen(async function* () {
  const user = yield* ok(await getUser(id))
  const posts = yield* ok(await getPosts(user.id))
  return { user, posts }
})
// type: Promise<NotFoundError | NetworkError | { user: User; posts: Post[] }>
```

## API

### `ok(value)`

Takes a value that may be an error. If it's an error, yields it (causing `gen` to short-circuit). Otherwise returns the non-error value.

### `gen(body)`

Runs a generator function. If `ok` yields an error, `gen` returns it immediately. Otherwise returns the generator's return value. Works with both sync and async generators.

## License

MIT
