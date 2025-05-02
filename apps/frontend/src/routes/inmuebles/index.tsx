import { createFileRoute } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { Documento } from '@shared/zod';
import { DocumentoPreview } from '@/components/documento';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/inmuebles/')({
  component: AllInmuebles,
});

async function getDocumentos() {
  const res = await api.documentos.$get()
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

function AllInmuebles() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-documentos'],
    queryFn: getDocumentos,
  })

  if (isPending) return <div>Cargando inmuebles...</div>;
  if (error) return <div>{error.message}</div>;

  const docs = data.documentos as Documento[];

  return (
    <div className='mx-auto w-[95%] gap-4 grid grid-cols-3 p-4 '>
      {docs.map((doc) => (
        <div key={doc.id}>
          <DocumentoPreview documentoContent={doc} className="" />
        </div>
      ))}
    </div>
  );
}
