import { createMiddleware } from "hono/factory";
import { type UserType } from "@kinde-oss/kinde-typescript-sdk";
import { sessionManager } from "@/session";

export type Variables = {
    user: UserType;
}

type Env = {
    Variables: Variables
}

export const getUser = createMiddleware<Env>(async (c, next) => {
    try {
        const manager = sessionManager(c);
        const isAuthenticated = await kindeClient.isAuthenticated(manager);
        if (!isAuthenticated) {
            return c.json({ error: "Unauthorizated" }, 401);
        }
        const user = await kindeClient.getUserProfile(manager);
        c.set("user", user);
        await next();
    } catch (e) {
        console.error(e);
        return c.json({ error: 'Unauthorized' }, { status: 401 })
    }
});