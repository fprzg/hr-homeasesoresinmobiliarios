// src/components/DocumentForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { BloqueDocumento, Documento, crearDocumentoBase } from '@shared/zod';
import { DocumentosApi, ArchivosApi } from '@/api';
import BloqueTexto from '@/components/bloque-texto';
import BloqueCarrusel from '@/components/bloque-carrusel';
import ImageUploader from '@/components/image-uploader';
import DragDropList from '@/components/drag-drop-list';

export default function DocumentForm({ documentoInicial, modo }: { documentoInicial?: Documento, modo: 'crear' | 'editar' }) {
    const navigate = useNavigate();
    const [documento, setDocumento] = useState<Documento>(crearDocumentoBase());
    const [portadaFileName, setPortadaFileName] = useState<string>('');
    const [imageFileNames, setImageFileNames] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBloqueModalOpen, setIsBloqueModalOpen] = useState(false);

    // Cargar nombres de archivos si estamos en modo editar
    useEffect(() => {
        // Si hay una portada y estamos en modo editar, intentar obtener su nombre de archivo
        if (documentoInicial?.portada && modo === 'editar') {
            // Aquí se podría agregar lógica para recuperar el nombre del archivo
            setPortadaFileName('Portada cargada');
        }

        // Obtener nombres de archivos para las imágenes en carruseles
        if (documentoInicial) {
            setDocumento(documentoInicial);

            const fileNames: Record<string, string> = {};
            documentoInicial.contenido.forEach(bloque => {
                if (bloque.tipo === 'CarruselImagenes') {
                    bloque.imagenes.forEach((id, index) => {
                        fileNames[id] = `Imagen ${index + 1}`;
                    });
                }
            });
            setImageFileNames(fileNames);
        }
    }, [documentoInicial, modo]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Manejar cambios en campos anidados (metadata)
        if (name.startsWith('metadata.')) {
            const metadataField = name.split('.')[1];
            setDocumento({
                ...documento,
                metadata: {
                    ...documento.metadata,
                    [metadataField]: value,
                },
            });
        } else {
            setDocumento({
                ...documento,
                [name]: value,
            });
        }
    };

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = value ? parseFloat(value) : undefined;

        // Asumimos que es un campo de metadata, como precio
        if (name.startsWith('metadata.')) {
            const metadataField = name.split('.')[1];
            setDocumento({
                ...documento,
                metadata: {
                    ...documento.metadata,
                    [metadataField]: numValue,
                },
            });
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tagsString = e.target.value;
        const tagsArray = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];

        setDocumento({
            ...documento,
            metadata: {
                ...documento.metadata,
                tags: tagsArray,
            },
        });
    };

    const handlePortadaUpload = (imageId: string, fileName: string) => {
        setDocumento({
            ...documento,
            portada: imageId,
        });
        setPortadaFileName(fileName);
    };

    const handleAddBloque = (tipo: 'Texto' | 'CarruselImagenes') => {
        let nuevoBloque: BloqueDocumento;

        if (tipo === 'Texto') {
            nuevoBloque = {
                tipo: 'Texto',
                texto: '',
            };
        } else {
            nuevoBloque = {
                tipo: 'CarruselImagenes',
                imagenes: [],
            };
        }

        setDocumento({
            ...documento,
            contenido: [...documento.contenido, nuevoBloque],
        });

        setIsBloqueModalOpen(false);
    };

    const handleUpdateBloque = (index: number, bloqueActualizado: BloqueDocumento) => {
        const nuevosContenidos = [...documento.contenido];
        nuevosContenidos[index] = bloqueActualizado;

        setDocumento({
            ...documento,
            contenido: nuevosContenidos,
        });
    };

    const handleDeleteBloque = (index: number) => {
        const nuevosContenidos = [...documento.contenido];
        nuevosContenidos.splice(index, 1);

        setDocumento({
            ...documento,
            contenido: nuevosContenidos,
        });
    };

    const handleReorderBloques = (nuevosContenidos: BloqueDocumento[]) => {
        setDocumento({
            ...documento,
            contenido: nuevosContenidos,
        });
    };

    const uploadImages = async (files: File[]): Promise<string[]> => {
        try {
            const result = await ArchivosApi.subir(files);

            // Actualizar el mapeo de nombres de archivos
            const newImageFileNames = { ...imageFileNames };
            result.forEach(({ id, originalName }) => {
                newImageFileNames[id] = originalName;
            });
            setImageFileNames(newImageFileNames);

            return result.map(item => item.id);
        } catch (error) {
            console.error('Error al subir imágenes:', error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones básicas
        if (!documento.titulo) {
            alert('Por favor, ingresa un título para el documento.');
            return;
        }

        if (!documento.portada) {
            alert('Por favor, sube una imagen de portada.');
            return;
        }

        try {
            setIsSubmitting(true);

            if (modo === 'crear') {
                // Crear nuevo documento
                const result = await DocumentosApi.crear(documento);
                alert('Documento creado exitosamente.');
                navigate({ to: '/dash/docs/listar' });
            } else if ('id' in documento) {
                // Actualizar documento existente
                await DocumentosApi.actualizar(documento.id, documento);
                alert('Documento actualizado exitosamente.');
                navigate({ to: '/dash/docs/listar' });
            }
        } catch (error) {
            console.error('Error al guardar documento:', error);
            alert('Error al guardar el documento. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEliminar = async () => {
        if (!('id' in documento)) return;

        if (window.confirm('¿Estás seguro de eliminar este documento? Esta acción no se puede deshacer.')) {
            try {
                await DocumentosApi.eliminar(documento.id);
                alert('Documento eliminado exitosamente.');
                navigate({ to: '/dash/docs/listar' });
            } catch (error) {
                console.error('Error al eliminar documento:', error);
                alert('Error al eliminar el documento. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="documento-form">
            <form onSubmit={handleSubmit}>
                <div className="form-header">
                    <h2>{modo === 'crear' ? 'Crear Nuevo Documento' : 'Editar Documento'}</h2>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-guardar"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>

                        {modo === 'editar' && (
                            <button
                                type="button"
                                className="btn-eliminar"
                                onClick={handleEliminar}
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                </div>

                <div className="form-body">
                    <div className="form-section">
                        <h3>Información General</h3>

                        <div className="form-group">
                            <label htmlFor="titulo">Título*</label>
                            <input
                                type="text"
                                id="titulo"
                                name="titulo"
                                value={documento.titulo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="categoria">Categoría*</label>
                            <select
                                id="categoria"
                                name="categoria"
                                value={documento.categoria}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="casa">Casa</option>
                                <option value="terreno">Terreno</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="metadata.ubicacion">Ubicación*</label>
                            <input
                                type="text"
                                id="metadata.ubicacion"
                                name="metadata.ubicacion"
                                value={documento.metadata.ubicacion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="metadata.precio">Precio</label>
                            <input
                                type="number"
                                id="metadata.precio"
                                name="metadata.precio"
                                value={documento.metadata.precio || ''}
                                onChange={handleNumberInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="metadata.tags">Etiquetas (separadas por comas)</label>
                            <input
                                type="text"
                                id="metadata.tags"
                                name="metadata.tags"
                                value={documento.metadata.tags?.join(', ') || ''}
                                onChange={handleTagsChange}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Portada*</h3>

                        {documento.portada ? (
                            <div className="portada-preview">
                                <img
                                    src={ArchivosApi.getImagenUrl(documento.portada)}
                                    alt="Portada"
                                    width="200"
                                />
                                <p>{portadaFileName}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDocumento({ ...documento, portada: '' });
                                        setPortadaFileName('');
                                    }}
                                >
                                    Cambiar imagen
                                </button>
                            </div>
                        ) : (
                            <ImageUploader
                                onImageUploaded={handlePortadaUpload}
                                label="Subir portada*"
                            />
                        )}
                    </div>

                    <div className="form-section">
                        <div className="contenido-header">
                            <h3>Contenido</h3>
                            <button
                                type="button"
                                onClick={() => setIsBloqueModalOpen(true)}
                            >
                                Agregar bloque
                            </button>
                        </div>

                        {isBloqueModalOpen && (
                            <div className="bloque-modal">
                                <div className="bloque-modal-content">
                                    <h4>Selecciona el tipo de bloque</h4>
                                    <div className="bloque-options">
                                        <button
                                            type="button"
                                            onClick={() => handleAddBloque('Texto')}
                                        >
                                            Texto
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAddBloque('CarruselImagenes')}
                                        >
                                            Carrusel de Imágenes
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsBloqueModalOpen(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}

                        <DragDropList
                            items={documento.contenido}
                            keyExtractor={(item) => `${item.tipo}`}
                            onReorder={handleReorderBloques}
                            renderItem={(bloque, index) => (
                                <div className="bloque-item">
                                    {bloque.tipo === 'Texto' ? (
                                        <BloqueTexto
                                            bloque={bloque}
                                            onChange={(bloqueActualizado) => handleUpdateBloque(index, bloqueActualizado)}
                                            onDelete={() => handleDeleteBloque(index)}
                                        />
                                    ) : (
                                        <BloqueCarrusel
                                            bloque={bloque}
                                            onChange={(bloqueActualizado) => handleUpdateBloque(index, bloqueActualizado)}
                                            onDelete={() => handleDeleteBloque(index)}
                                            onUploadImages={uploadImages}
                                            imageFileNames={imageFileNames}
                                        />
                                    )}
                                </div>
                            )}
                        />

                        {documento.contenido.length === 0 && (
                            <div className="sin-contenido">
                                <p>No hay bloques de contenido. Añade uno haciendo clic en "Agregar bloque".</p>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}