export function* ok(value) {
    if (value instanceof Error) {
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
