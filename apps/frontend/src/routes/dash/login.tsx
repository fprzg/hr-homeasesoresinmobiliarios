import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react"
import { userQueryOptions } from '@/lib/api';

export const Route = createFileRoute('/dash/login')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return { usuario: data };
    } catch (e) {
      return { usuario: null };
    }
  },
  component: RouteComponent,
})

// export default function LoginForm({ redirectTarget }: { redirectTo: string }) {
function RouteComponent() {
  const redirectTarget = "/dash";
  const navigate = useNavigate();

  const context = Route.useRouteContext();
  if (context.usuario) {
    navigate({ to: redirectTarget });
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const submitCredentials = async () => {
    if (username === "") {
      setErrorMsg("el nombre de usuario está vacío.");
      return
    }
    if (password.length < 8) {
      setErrorMsg("La contraseña debe tener al menos 8 caracteres.")
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    });
    if (!res.ok) {
      console.log(res);
      if (res.status == 401) {
        setErrorMsg("Credenciales inválidas. Intente de nuevo.");
      } else {
        setErrorMsg("Error en el servidor. Intente más tarde o contacte al administrador.");
      }
    } else {
      navigate({ to: redirectTarget });
    }
  };

  return (
    <div className="text-center w-[350px] mx-auto grid grid-cols-1 gap-y-4">
      <div className="grid grid-cols-1">
        <label htmlFor="username">Usuario:</label>
        <input
          className="p-2 border rounded-md"
          type="text"
          name="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 ">
        <label htmlFor="password">Contraseña:</label>
        <input
          className="p-2 border rounded-md"
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 ">
        <button
          type="button"
          className="bg-blue-500 text-white py-1 rounded-md text-lg hover:bg-blue-600"
          onClick={submitCredentials}
        >
          Iniciar sesión
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-500 rounded p-2 shadow-xl">
          <p className="text-lg text-white">{errorMsg}</p>
        </div>
      )}

    </div >
  );
}