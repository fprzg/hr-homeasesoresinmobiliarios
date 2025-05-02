// src/routes/dash/documentos/listar.lazy.tsx
import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Documento } from '@shared/zod';
import { DocumentosAPI, ArchivosAPI } from '@/api';
import Sidebar from '@/components/dash-sidebar';

export const Route = createFileRoute('/dash/_authenticated/docs/listar')({
  component: ListarDocumentos,
});

function ListarDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDocumentos = async () => {
      try {
        setIsLoading(true);
        //const data = await DocumentosAPI.listar();
        const res = await fetch(`/api/documentos`)
        const data = await res.json();
        setDocumentos(data.documentos);
        setError(null);
      } catch (err) {
        console.error('Error al cargar documentos:', err);
        setError('Error al cargar la lista de documentos. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDocumentos();
  }, []);

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este documento? Esta acción no se puede deshacer.')) {
      try {
        await DocumentosAPI.eliminar(id);
        // Actualizar la lista después de eliminar
        setDocumentos(documentos.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Error al eliminar documento:', error);
        alert('Error al eliminar el documento. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="documentos-listar">
      <div className="page-header">
        <h2>Documentos</h2>
        <Link to="/dash/docs/nuevo" className="btn-crear">
          Crear
        </Link>
      </div>

      {isLoading ? (
        <div className="loading">Cargando documentos...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : documentos.length === 0 ? (
        <div className="sin-documentos">
          <p>No hay documentos disponibles.</p>
          <Link to="/dash/docs/nuevo">Crear el primer documento</Link>
        </div>
      ) : (
        <div className="documentos-tabla">
          <table>
            <thead>
              <tr>
                <th>Portada</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Ubicación</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((documento) => (
                <tr key={documento.id}>
                  <td className="portada-cell">
                    <img
                      src={ArchivosAPI.getImagenUrl(documento.portada)}
                      alt={documento.titulo}
                      width="70"
                      height="70"
                    />
                  </td>
                  <td>
                    <Link
                      to="/dash/docs/editar/$id"
                      params={{ id: documento.id }}
                      className="documento-link"
                    >
                      {documento.titulo}
                    </Link>
                  </td>
                  <td>{documento.categoria === 'casa' ? 'Casa' : 'Terreno'}</td>
                  <td>{documento.metadata.ubicacion}</td>
                  <td>{new Date(documento.metadata.fechaPublicacion).toLocaleDateString()}</td>
                  <td className="acciones">
                    <Link
                      to="/dash/docs/editar/$id"
                      params={{ id: documento.id }}
                      className="btn-editar"
                    >
                      Editar
                    </Link>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(documento.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Layout() {
  return (
    <>
        
      <ListarDocumentos />
    </>
  );
}