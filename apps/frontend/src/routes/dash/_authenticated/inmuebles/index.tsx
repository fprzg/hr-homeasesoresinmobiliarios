import { createFileRoute } from '@tanstack/react-router';
import { InmuebleForm } from '@/components/inmueble-form';

export const Route = createFileRoute('/dash/_authenticated/inmuebles/')({
  component: NuevoDocumento,
});

function NuevoDocumento() {
  return (
    <>
      <InmuebleForm />
    </>
  )
}