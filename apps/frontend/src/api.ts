import { InmuebleType } from '@shared/zod'
import { api } from './lib/api';
import { useQuery } from '@tanstack/react-query';

export const InmueblesApi = {
  listar: () => {
    async function getDocumentos() {
      const res = await api.inmuebles.$get();
      if (!res.ok) {
        throw new Error('server error');
      }
      const data = await res.json();
      return data;
    }

    return useQuery({
      queryKey: ['get-all-documentos'],
      queryFn: getDocumentos,
    });
  },

  // Obtener un documento por ID
  obtener: async (id: string): Promise<InmuebleType> => {
    const response = await fetch(`/api/inmuebles/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener inmueble con ID ${id}`);
    }
    return response.json();
  },

  // Crear un nuevo documento
  crear: async (inmueble: InmuebleType): Promise<{ id: string }> => {
    const response = await fetch('/api/inmuebles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inmueble),
    });

    const json = response.json();
    if (!response.ok) {
      throw new Error('Error al guardar el inmueble');
    }

    return json;
  },

  // Actualizar un documento existente
  actualizar: async (id: string, inmueble: InmuebleType): Promise<void> => {
    const response = await fetch(`/api/inmuebles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inmueble),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar inmueble con ID ${id}`);
    }
  },

  // Eliminar un documento
  eliminar: async (id: string): Promise<void> => {
    const response = await fetch(`/api/inmuebles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar inmueble con ID ${id}`);
    }
  },
};

export interface ArchivoResponse {
  id: string;
  originalName: string;
}

export const ArchivosApi = {
  // Subir imágenes
  subir: async (files: File[]): Promise<ArchivoResponse[]> => {
    const formData = new FormData();

    // Añadir cada archivo al FormData
    files.forEach(file => {
      formData.append('imagenes', file);
    });

    const response = await fetch('/api/archivos', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir archivos');
    }

    const data = await response.json();
    return data.imagenes;
  },

  // Obtener URL de imagen
  getImagenUrl: (id: string): string => {
    return `/api/archivos/${id}`;
  },
};