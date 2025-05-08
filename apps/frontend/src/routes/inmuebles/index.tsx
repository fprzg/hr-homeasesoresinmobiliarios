import { createFileRoute } from '@tanstack/react-router';
import { type InmuebleType} from '@shared/zod';
import { InmueblePreview } from '@/components/inmueble';
import { InmueblesApi } from '@/api';

export const Route = createFileRoute('/inmuebles/')({
  component: AllInmuebles,
});

function AllInmuebles() {
  const { isPending, error, data } = InmueblesApi.listar();

  if (isPending) return <div>Cargando inmuebles...</div>;
  if (error) return <div>{error.message}</div>;

  const docs = data?.inmuebles as InmuebleType[];

  return (
    <div className='mx-auto w-[95%] gap-4 grid grid-cols-3 p-4 '>
      {docs.map((doc) => (
        <div key={doc.id}>
          <InmueblePreview documentoContent={doc} className="" />
        </div>
      ))}
    </div>
  );
}
