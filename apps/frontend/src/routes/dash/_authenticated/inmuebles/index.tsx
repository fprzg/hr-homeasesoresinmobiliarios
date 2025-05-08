// src/routes/dash/documentos/nuevo.lazy.tsx
import { createFileRoute } from '@tanstack/react-router';
import InmuebleForm from '@/components/inmueble-form';
import { crearCasa } from '@shared/zod/src';

export const Route = createFileRoute('/dash/_authenticated/inmuebles/')({
  component: NuevoDocumento,
});

function NuevoDocumento() {
  const defaultContent = crearCasa();
  return (
    <div className="">
      <InmuebleForm inmuebleDefault={defaultContent}/>
    </div>
  );
}