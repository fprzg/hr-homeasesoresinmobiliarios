// src/routes/dash/documentos/editar/$id.lazy.tsx
import { useState, useEffect } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { type InmuebleType } from '@shared/zod';
import { InmueblesApi } from '@/api';
import { InmuebleForm } from '@/components/inmueble-form';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const Route = createFileRoute('/dash/_authenticated/inmuebles/$id')({
  component: EditarDocumento,
});

function EditarDocumento() {
  const { id } = useParams({ from: '/dash/_authenticated/inmuebles/$id' });

  const getDocumentoById = async () => {
    const res = await api.inmuebles[":id"].$get({ param: { id } });
    if (!res.ok) {
      throw new Error('server error');
    }
    const data = await res.json();
    return data;
  }

  const { isPending, error, data } = useQuery({
    queryKey: ['get-documento-by-id'],
    queryFn: getDocumentoById,
  });

  const [inmuebleData, setInmuebleData] = useState<InmuebleType>();

  useEffect(() => {
    if (!isPending && data?.inmueble) {
      setInmuebleData(data.inmueble);
    }
  }, [isPending, data]);

  return (
    <InmuebleForm inmuebleData={inmuebleData} />
  );
}