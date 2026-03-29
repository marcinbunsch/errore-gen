// re-export all from errore for convenience so that you can import all from errore-gen
export * from "errore";
import { isError } from "errore";
export function* ok(value) {
    if (isError(value)) {
        yield value;
        throw new Error("ok must be used with gen");
    }
    return value;
}
export function gen(body) {
    const result = body().next();
    if (result instanceof Promise) {
        return result.then((step) => step.value);
    }
    return result.value;
}
