import { jwt } from "hono/jwt";

export const jwtMiddleware = jwt({
  secret: 'your-secret-key',
  cookie: 'jwt',
});
