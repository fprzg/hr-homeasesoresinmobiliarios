import { hc } from 'hono/client'
import { type ApiRoutes } from '@shared/types';
import { queryOptions } from '@tanstack/react-query';

export const client = hc<ApiRoutes>('/', {
    headers: async () => {
        //const apiKey = process.env.API_KEY || "";
        const apiKey = "";
        const accessToken = 'jwt';

        return {
            apiKey,
            authorization: `Bearer ${accessToken}`,
        };
    },
});

export const api = client.api;

async function getCurrentUser() {
    const res = await api.auth.me.$get();
    if (!res.ok) {
        throw new Error("server error");
    }
    const data = await res.json();
    return data;
}

export const userQueryOptions = queryOptions({
    queryKey: ["get-current-user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
});