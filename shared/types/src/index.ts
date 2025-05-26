import { type ApiRoutes as apiRoutes } from '../../../apps/backend/src/app'

export type ApiRoutes = apiRoutes;

export type ApiPaginationData = {
    totalCount: number,
    totalPages: number,
    page: number,
    totalPageSize: number,
};

export function normalizeError(e: unknown): Error {
    if (e instanceof Error) {
        return e;
    }

    if (typeof e === "string") {
        return new Error(e);
    }

    if (e &&
        typeof e === "object" &&
        "message" in e &&
        typeof (e as any).message === "string"
    ) {
        return new Error((e as any).message);
    }

    return new Error(`Unknown error: ${JSON.stringify}`);
}