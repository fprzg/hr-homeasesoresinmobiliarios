// src/routes/dash/documentos/nuevo.lazy.tsx
import { createFileRoute } from '@tanstack/react-router';
import InmuebleForm from '@/components/inmueble-form';

export const Route = createFileRoute('/dash/_authenticated/docs/nuevo-casa')({
  component: NuevoDocumento,
});

function NuevoDocumento() {
  return (
    <div className="nuevo-documento">
      <InmuebleForm />
    </div>
  );
}