import { createFileRoute } from '@tanstack/react-router';
import { client } from '@/api';
import { useEffect, useState } from 'react';
import { Inmueble } from '@shared/zodSchemas/inmueble';
import { InmuebleBlock } from '@/components/inmueble';

export const Route = createFileRoute('/inmuebles/$id')({
  component: InmuebleById,
});

function InmuebleById() {
  const { id } = Route.useParams();
  const [inmueble, setInmueble] = useState<Inmueble | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInmueble() {
      try {
        const res = await client.api.inmuebles[":id"].$get({ param: { id } });
        const data = await res.json();
        setInmueble(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el inmueble.");
      } finally {
        setLoading(false);
      }
    }

    fetchInmueble();
  }, [id]);

  if (loading) return <div>Cargando inmueble...</div>;
  if (error) return <div>{error}</div>;
  if (!inmueble) return <div>No se encontró el inmueble.</div>;

  return (
    <div className='mx-auto w-[80%] md:w-[80%] lg:w-[65%] xl:w-[50%] gap-4'>
      <InmuebleBlock {...inmueble} />
    </div>
  );
}
