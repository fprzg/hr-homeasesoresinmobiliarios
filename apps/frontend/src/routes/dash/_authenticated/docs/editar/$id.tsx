// src/routes/dash/documentos/editar/$id.lazy.tsx
import { useState, useEffect } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { type InmuebleType } from '@shared/zod';
import { InmueblesApi } from '@/api';
import DocumentForm from '@/components/inmueble-form';

export const Route = createFileRoute('/dash/_authenticated/docs/editar/$id')({
  component: EditarDocumento,
});

function EditarDocumento() {
  const { id } = useParams({ from: '/dash/_authenticated/docs/editar/$id' });
  const [inmueble, setInmueble] = useState<InmuebleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDocumento = async () => {
      try {
        setIsLoading(true);
        //const data = await DocumentosApi.obtener(id);
        const res = await fetch(`/api/inmuebles/${id}`)
        const data = await res.json();
        setInmueble(data.documento);
        setError(null);
      } catch (err) {
        console.error(`Error al cargar inmueble ${id}:`, err);
        setError('Error al cargar el inmueble. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDocumento();
  }, [id]);

  if (isLoading) {
    return <div className="loading">Cargando inmueble...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!inmueble) {
    return <div className="not-found">Inmueble no encontrado.</div>;
  }

  return (
    <div className="editar-documento">
      {/* <DocumentForm documentoInicial={inmueble} modo="editar" /> */}
    </div>
  );
}