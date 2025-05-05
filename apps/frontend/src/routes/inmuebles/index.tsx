import { createFileRoute } from '@tanstack/react-router';
import { Documento } from '@shared/zod';
import { DocumentoPreview } from '@/components/documento';
import { DocumentosApi } from '@/api';

export const Route = createFileRoute('/inmuebles/')({
  component: AllInmuebles,
});

function AllInmuebles() {
  const { isPending, error, data } = DocumentosApi.listar();

  if (isPending) return <div>Cargando inmuebles...</div>;
  if (error) return <div>{error.message}</div>;

  const docs = data?.documentos as Documento[];

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
