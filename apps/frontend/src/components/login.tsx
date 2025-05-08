import { useNavigate } from "@tanstack/react-router";
import { Route } from "lucide-react";
import { useEffect, useState } from "react"
import { useAuthUser } from "@/lib/hooks/useAuthUser";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const navigate = useNavigate();

  const { usuario, isLoading } = useAuthUser();
  useEffect(() => {
    if (usuario) {
      navigate({ to: redirectTo });
    }
  }, [usuario, navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const submitCredentials = async () => {
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
      navigate({ to: redirectTo });
    }
  };

  if(isLoading) return (<></>);

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
