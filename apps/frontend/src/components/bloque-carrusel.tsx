// src/components/BloqueCarrusel.tsx
import { useState, useEffect } from 'react';
import { BloqueDocumento } from '@shared/zod';
import { ArchivosAPI } from '@/api';
import DragDropList from '@/components/drag-drop-list';

interface BloqueCarruselProps {
    bloque: Extract<BloqueDocumento, { tipo: 'CarruselImagenes' }>;
    onChange: (bloque: Extract<BloqueDocumento, { tipo: 'CarruselImagenes' }>) => void;
    onDelete: () => void;
    onUploadImages: (files: File[]) => Promise<string[]>;
    imageFileNames: Record<string, string>;
}

export default function BloqueCarrusel({
    bloque,
    onChange,
    onDelete,
    onUploadImages,
    imageFileNames
}: BloqueCarruselProps) {
    const [imagenes, setImagenes] = useState<string[]>(bloque.imagenes);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setImagenes(bloque.imagenes);
    }, [bloque.imagenes]);

    const handleImagenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setIsUploading(true);
            const files = Array.from(e.target.files);
            const imagenesIds = await onUploadImages(files);

            // Actualizar el estado local y el bloque padre
            const nuevasImagenes = [...imagenes, ...imagenesIds];
            setImagenes(nuevasImagenes);
            onChange({ ...bloque, imagenes: nuevasImagenes });
        } catch (error) {
            console.error('Error al subir imágenes:', error);
            alert('Error al subir imágenes. Inténtalo de nuevo.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        const nuevasImagenes = [...imagenes];
        nuevasImagenes.splice(index, 1);
        setImagenes(nuevasImagenes);
        onChange({ ...bloque, imagenes: nuevasImagenes });
    };

    const handleReorder = (nuevasImagenes: string[]) => {
        setImagenes(nuevasImagenes);
        onChange({ ...bloque, imagenes: nuevasImagenes });
    };

    const identifier = Math.random();

    return (
        <div className="bloque-carrusel">
            <div className="bloque-header">
                <h4>Carrusel de Imágenes</h4>
                <button type="button" className="btn-eliminar" onClick={onDelete}>
                    Eliminar
                </button>
            </div>

            <div className="carrusel-content">
                {imagenes.length > 0 ? (
                    <DragDropList
                        items={imagenes}
                        keyExtractor={(item) => item}
                        onReorder={handleReorder}
                        renderItem={(imagenId, index) => (
                            <div className="imagen-item">
                                <img
                                    src={ArchivosAPI.getImagenUrl(imagenId)}
                                    alt={`Imagen ${index + 1}`}
                                    width="150"
                                />
                                <div className="imagen-info">
                                    <span className="imagen-nombre">{imageFileNames[imagenId] || `Imagen ${index + 1}`}</span>
                                    <button
                                        type="button"
                                        className="btn-quitar"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Quitar
                                    </button>
                                </div>
                            </div>
                        )}
                    />
                ) : (
                    <div className="sin-imagenes">No hay imágenes en este carrusel</div>
                )}

                <div className="upload-section">
                    <input
                        type="file"
                        id={`carrusel-upload-${identifier}`}
                        multiple
                        accept="image/*"
                        onChange={handleImagenChange}
                        disabled={isUploading}
                    />
                    <label htmlFor={`carrusel-upload-${identifier}`} className="btn-upload">
                        {isUploading ? 'Subiendo...' : 'Añadir imágenes'}
                    </label>
                </div>
            </div>
        </div>
    );
}