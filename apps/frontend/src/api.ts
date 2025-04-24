import { hc } from 'hono/client'
import { type ApiRoutes } from '@shared/types/api';

export const client = hc<ApiRoutes>('');
