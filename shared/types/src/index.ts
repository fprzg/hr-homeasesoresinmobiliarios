import { type ApiRoutes as apiRoutes } from '../../../apps/backend/src/app'

export type ApiRoutes = apiRoutes;

export type ApiPaginationData = {
    totalCount: number,
    totalPages: number,
    page: number,
    totalPageSize: number,
};