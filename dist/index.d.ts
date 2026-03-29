export declare function ok<V>(value: V): Generator<Extract<V, Error>, Exclude<V, Error>>;
export declare function gen<Y extends Error, R>(body: () => Generator<Y, R>): R | Y;
export declare function gen<Y extends Error, R>(body: () => AsyncGenerator<Y, R>): Promise<R | Y>;
//# sourceMappingURL=index.d.ts.map