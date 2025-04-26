import { createFileRoute } from '@tanstack/react-router';
import { client } from '@/api';
import { useEffect, useState } from 'react';
import { Inmueble } from '@shared/zodSchemas/inmueble';
import { InmueblePreview } from '@/components/inmueble';

export const Route = createFileRoute('/inmuebles/')({
  component: AllInmuebles,
});

function AllInmuebles() {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInmuebles() {
      setLoading(true);
      setError(null);
      try {
        const res = await client.api.inmuebles.$get({ query: { page: "1", limit: "10" } });
        const data = await res.json();
        setInmuebles(data?.data || []);
      } catch (err: any) {
        setError('Hubo un error al cargar los inmuebles.');
        console.error("Error fetching inmuebles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInmuebles();
  }, []);

  if (loading) return <div>Cargando inmuebles...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='mx-auto w-[80%] md:w-[80%] lg:w-[65%] xl:w-[50%] gap-4'>
      {inmuebles.length > 0 ? (
        inmuebles.map((inmueble) => (
          <InmueblePreview key={inmueble.id} {...inmueble} />
        ))
      ) : (
        <div>No se encontraron inmuebles.</div>
      )}
    </div>
  );
}
