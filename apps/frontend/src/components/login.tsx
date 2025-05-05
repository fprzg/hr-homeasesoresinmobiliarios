import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { useForm } from "@tanstack/react-form";
import { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  )
}

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setSubmitError("");
      try {
        const res = await api.auth["login"].$post({ json: value });
        if (!res.ok) {
          if (res.status === 401) {
            const data = await res.json() as { error: string };
            setSubmitError(data.error)
          } else {
            setSubmitError("Hubo un error en el servidor. Intenta más tarde")
          }
        }
        navigate({ to: redirectTo });
      } catch (e) {
        setSubmitError("Hubo un error en el servidor. Intenta más tarde")
        console.error(e)
      }
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }} className="max-w-sm mx-auto space-y-4">

      <div>
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Introduzca su usuario'
                : value.length < 3
                  ? 'El usuario debe contener al menos 3 letras'
                  : undefined,
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return (
                value.includes('error') && '"error" no se permite como usuario'
              )
            },
          }}
          children={(field) => {
            return (
              <>
                <Label htmlFor={field.name}>Usuario</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            );
          }}
        />
      </div>

      <div>
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Introduzca su contraseña'
                : value.length < 8
                  ? 'La contraseña debe tener al menos 8 caracteres'
                  : undefined,
            onChangeAsyncDebounceMs: 500,
          }}
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Contraseña:</Label>
              <Input
                type="password"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)} />
              <FieldInfo field={field} />
            </>
          )}
        />
      </div>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit} >
            {isSubmitting ? "..." : "Iniciar sesión"}
          </Button>
        )}
      />

      {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

    </form >
  );
}
