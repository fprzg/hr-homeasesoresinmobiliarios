import { hc } from "hono/client";
import { type ApiRoutes } from "@/app";

export const api = hc<ApiRoutes>('/', {
    headers: async () => {
        const apiKey = 'your-api-key';
        const accessToken = 'your-access-token';

        return {
            apiKey,
            authorization: `Bearer ${accessToken}`,
        };
    },
});