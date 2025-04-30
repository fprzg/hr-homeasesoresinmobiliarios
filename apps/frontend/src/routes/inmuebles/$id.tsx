import { createFileRoute } from '@tanstack/react-router';
import { client } from '@/api';
import { useEffect, useState } from 'react';
import { Documento } from '@shared/zodSchemas/documento';
import { DocumentoPage } from '@/components/documento';

export const Route = createFileRoute('/inmuebles/$id')({
  component: InmuebleById,
});

function InmuebleById() {
  const { id } = Route.useParams();
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInmueble() {
      try {
        //const res = await client.api.documentos.$get({ param: { id } });
        const res = await fetch(`/api/documentos/${id}`)
        const data = await res.json();
        setDocumento(data.documento);
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
  if (!documento) return <div>No se encontró el inmueble.</div>;

  return (
    <div className='mx-auto w-[80%] md:w-[80%] lg:w-[65%] xl:w-[50%] gap-4'>
      <DocumentoPage documentoContent={documento} className=""/>
    </div>
  );
}
