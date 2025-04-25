import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Login } from "./login"
import { parse } from "cookie";

async function isAuthenticated() {
  const cookies = parse(document.cookie);
  const token = cookies.token;

  if (!token) {
    return false;
  }

  const res = await fetch('/api/jwt/verify', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw redirect({ to: '/' });
  }

  return true;
}

export const Route = createFileRoute('/dash/_authenticated')({
  component: AuthenticatedDashboardLayout,
})

function AuthenticatedDashboardLayout() {
  if (!isAuthenticated()) {
    return <Login />
  }

  return <Outlet />
}