// src/router.ts
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

export { router };
