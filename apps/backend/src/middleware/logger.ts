import { type MiddlewareHandler } from "hono";

export const logger: MiddlewareHandler = async (c, next) => {
    const start = process.hrtime.bigint(); // nanoseconds
    await next();
    const end = process.hrtime.bigint();
    const durationMicroseconds = Number(end - start) / 1_000; // convert to microseconds
    console.log(`${c.req.method} ${c.req.url} - ${durationMicroseconds.toFixed(3)}µs`);
}
