import { describe, test, expect } from "vitest"
import * as errore from "../src/errore.js"

class NotFoundError extends errore.createTaggedError({
  name: "NotFoundError",
  message: "User $id not found",
}) {}

class DbError extends errore.createTaggedError({
  name: "DbError",
  message: "Database failed: $reason",
}) {}

function mayFail1(ok: boolean): NotFoundError | number {
  if (!ok) return new NotFoundError({ id: "123" })
  return 2
}

function mayFail2(ok: boolean): DbError | number {
  if (!ok) return new DbError({ reason: "timeout" })
  return 3
}

describe("gen", () => {
  test("sync: returns value when all ok", () => {
    const result = errore.gen(function* () {
      const a = yield* errore.ok(mayFail1(true))
      const b = yield* errore.ok(mayFail2(true))
      return a + b
    })

    expect(result).toBe(5)
  })

  test("sync: returns first yielded error", () => {
    const result = errore.gen(function* () {
      const first = yield* errore.ok(mayFail1(false))
      const second = yield* errore.ok(mayFail2(true))
      return first + second
    })

    expect(result).toBeInstanceOf(NotFoundError)
  })

  test("async: returns value when all ok", async () => {
    const result = await errore.gen(async function* () {
      const a = yield* errore.ok(await Promise.resolve(mayFail1(true)))
      const b = yield* errore.ok(await Promise.resolve(mayFail2(true)))
      return a + b
    })

    expect(result).toBe(5)
  })

  test("async: returns first yielded error", async () => {
    const result = await errore.gen(async function* () {
      const first = yield* errore.ok(await Promise.resolve(mayFail1(false)))
      const second = yield* errore.ok(await Promise.resolve(mayFail2(true)))
      return first + second
    })

    expect(result).toBeInstanceOf(NotFoundError)
  })

  test("matches error with matchError", () => {
    const result = errore.gen(function* () {
      const first = yield* errore.ok(mayFail1(false))
      const second = yield* errore.ok(mayFail2(true))
      return first + second
    })

    if (result instanceof Error) {
      const message = errore.matchError(result, {
        NotFoundError: (e) => `Missing ${e.id}`,
        DbError: (e) => `Db ${e.reason}`,
        Error: (e) => `Unknown ${e.message}`,
      })
      expect(message).toBe("Missing 123")
    }
  })
})
