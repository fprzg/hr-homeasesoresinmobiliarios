// src/api/documentos.ts
import { Documento } from '@shared/zodSchemas/documento';

import { hc } from 'hono/client'
import { type ApiRoutes } from '@shared/types/api';

export const client = hc<ApiRoutes>('');

export const DocumentosAPI = {
  // Obtener lista de documentos
  listar: async (): Promise<Documento[]> => {
    const response = await fetch('/api/documentos');
    if (!response.ok) {
      throw new Error('Error al obtener documentos');
    }
    return response.json();
  },

  // Obtener un documento por ID
  obtener: async (id: string): Promise<Documento> => {
    const response = await fetch(`/api/documentos/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener documento con ID ${id}`);
    }
    return response.json();
  },

  // Crear un nuevo documento
  crear: async (documento: Documento): Promise<{ id: string }> => {
    const response = await fetch('/api/documentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documento),
    });

    const json = response.json();
    if (!response.ok) {
      console.log(json)
      throw new Error('Error al crear documento');
    }

    return json;
  },

  // Actualizar un documento existente
  actualizar: async (id: string, documento: Documento): Promise<void> => {
    const response = await fetch(`/api/documentos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documento),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar documento con ID ${id}`);
    }
  },

  // Eliminar un documento
  eliminar: async (id: string): Promise<void> => {
    const response = await fetch(`/api/documentos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar documento con ID ${id}`);
    }
  },
};

export interface ArchivoResponse {
  id: string;
  originalName: string;
}

export const ArchivosAPI = {
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
    console.log(data);
    return data.imagenes;
  },

  // Obtener URL de imagen
  getImagenUrl: (id: string): string => {
    return `/api/archivos/${id}`;
  },
};
