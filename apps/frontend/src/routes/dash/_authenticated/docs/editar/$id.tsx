// src/routes/dash/documentos/editar/$id.lazy.tsx
import { useState, useEffect } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Documento } from '@shared/zod';
import { DocumentosApi } from '@/api';
import DocumentForm from '@/components/document-form';

export const Route = createFileRoute('/dash/_authenticated/docs/editar/$id')({
  component: EditarDocumento,
});

function EditarDocumento() {
  const { id } = useParams({ from: '/dash/_authenticated/docs/editar/$id' });
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDocumento = async () => {
      try {
        setIsLoading(true);
        //const data = await DocumentosApi.obtener(id);
        const res = await fetch(`/api/documentos/${id}`)
        const data = await res.json();
        setDocumento(data.documento);
        setError(null);
      } catch (err) {
        console.error(`Error al cargar documento ${id}:`, err);
        setError('Error al cargar el documento. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDocumento();
  }, [id]);

  if (isLoading) {
    return <div className="loading">Cargando documento...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!documento) {
    return <div className="not-found">Documento no encontrado.</div>;
  }

  return (
    <div className="editar-documento">
      <DocumentForm documentoInicial={documento} modo="editar" />
    </div>
  );
}