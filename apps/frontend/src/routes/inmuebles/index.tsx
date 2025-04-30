import { createFileRoute } from '@tanstack/react-router';
import { client } from '@/api';
import { useEffect, useState } from 'react';
import { Documento } from '@shared/zodSchemas/documento';
import { DocumentoPreview } from '@/components/documento';

export const Route = createFileRoute('/inmuebles/')({
  component: AllInmuebles,
});

function AllInmuebles() {
  const [inmuebles, setInmuebles] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInmuebles() {
      setLoading(true);
      setError(null);
      try {
        const res = await client.api.documentos.$get();
        const data = await res.json();
        setInmuebles(data?.documentos || []);
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
  console.log(inmuebles);

  return (
    <div className='mx-auto w-[95%] gap-4 grid grid-cols-3 p-4 '>
      {inmuebles.map((elem, idx) => (
        <div key={idx}>
          <DocumentoPreview documentoContent={elem} className="" />
        </div>
      ))}
    </div>
  );
}
