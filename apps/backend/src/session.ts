import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { type Context } from "hono";
import { type SessionManager } from "@kinde-oss/kinde-typescript-sdk";

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
    async getSessionItem(key: string) {
        const result = getCookie(c, key);
        return result;
    },
    async setSessionItem(key: string, value: unknown) {
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
        } as const;

        if (typeof value === "string") {
            setCookie(c, key, value, cookieOptions);
        } else {;
            setCookie(c, key, JSON.stringify(value), cookieOptions);
        }
    },
    async removeSessionItem(key: string) {
        deleteCookie(c, key);
    },
    async destroySession() {
        ["id_token", "access_token", "refresh_token"].forEach((key) => {
            deleteCookie(c, key);
        })
    }
})