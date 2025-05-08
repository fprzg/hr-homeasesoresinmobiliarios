// src/routes/dash/documentos/nuevo.lazy.tsx
import { createFileRoute } from '@tanstack/react-router';
import DocumentForm from '@/components/inmueble-form';

export const Route = createFileRoute('/dash/_authenticated/docs/nuevo-terreno')({
  component: NuevoDocumento,
});

function NuevoDocumento() {
  return (
    <div className="nuevo-documento">
      <DocumentForm modo="crear" />
    </div>
  );
}