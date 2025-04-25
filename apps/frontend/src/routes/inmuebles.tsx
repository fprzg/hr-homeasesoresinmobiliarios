import { createFileRoute } from '@tanstack/react-router';
import { client } from '@/api';
import { useEffect, useState } from 'react';
import { Inmueble } from '@shared/zodSchemas/inmueble';

export const Route = createFileRoute('/inmuebles')({
  component: RouteComponent,
});

function RouteComponent() {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInmuebles() {
      setLoading(true);
      setError(null);
      const query = { page: "1", limit: "10" };
      try {
        const res = await client.api.inmuebles.$get({ query });
        const data = await res.json();
        setInmuebles(data?.data || []); // Asegurarse de que data?.data exista
      } catch (err: any) {
        setError('Hubo un error al cargar los inmuebles.');
        console.error("Error fetching inmuebles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInmuebles();
  }, []); // El array de dependencias vacío asegura que esto se ejecute solo una vez al montar el componente

  if (loading) {
    return <div>Cargando inmuebles...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='gap-4'>
      {inmuebles.length > 0 ? (
        inmuebles.map((inmueble) => (
          <div key={inmueble.id} className='pb-4'> 
            <p>título: {inmueble.titulo}</p>
            <p>slug: {inmueble.slug}</p>
            <p>categoria: {inmueble.categoria}</p>
            {/* Puedes mostrar más detalles del inmueble aquí */}
          </div>
        ))
      ) : (
        <div>No se encontraron inmuebles.</div>
      )}
    </div>
  );
}