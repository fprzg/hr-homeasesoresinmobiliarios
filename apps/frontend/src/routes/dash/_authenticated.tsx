import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Login } from "./login"
import { parse } from "cookie";
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

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

const Authorized = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const jwtToken = getCookie('jwt'); // Asume que tu cookie se llama 'jwt'

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: '/dash/login' });
    }
  }, [jwtToken, navigate]);

  // Si el token existe, renderiza los hijos (las rutas protegidas)
  return <>{jwtToken ? children : null}</>;
};

export default Authorized;