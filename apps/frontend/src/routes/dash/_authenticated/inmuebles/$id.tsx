import { useState, useEffect } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { type InmuebleType } from '@shared/zod';
import { InmuebleForm } from '@/components/inmueble-form';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const Route = createFileRoute('/dash/_authenticated/inmuebles/$id')({
  component: EditarDocumento,
});

function EditarDocumento() {
  const { id } = useParams({ from: '/dash/_authenticated/inmuebles/$id' });

  const [inmuebleData, setInmuebleData] = useState<InmuebleType>();

  const getDocumentoById = async () => {
    const res = await api.inmuebles[":id"].$get({ param: { id } });
    if (!res.ok) {
      throw new Error('server error');
    }
    const data = await res.json();
    return data;
  }

  const { isPending, data } = useQuery({
    queryKey: ['get-documento-by-id', id],
    queryFn: getDocumentoById,
  });

  useEffect(() => {
    const xx: { inmueble: InmuebleType } = data as any as { inmueble: InmuebleType };
    if (!isPending && xx?.inmueble) {
      console.log(xx.inmueble.contenido);
      setInmuebleData(xx.inmueble);
    }
  }, [isPending, data]);

  return (
    <InmuebleForm inmuebleData={inmuebleData} />
  );
}