// src/components/BloqueCarrusel.tsx
import { useState, useEffect } from 'react';
import { BloqueDocumento } from '@shared/zod';
import { ArchivosApi } from '@/api';
import DragDropList from '@/components/drag-drop-list';
import { Input } from './ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';

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
        <div className="">
            <div className="">
                <Label>Imagenes</Label>
                <Button type="button" className="btn-eliminar" onClick={onDelete}>
                    Eliminar
                </Button>
            </div>

            <div className="">
                {imagenes.length > 0 ? (
                    <DragDropList
                        items={imagenes}
                        keyExtractor={(item) => item}
                        onReorder={handleReorder}
                        renderItem={(imagenId, index) => (
                            <div className="imagen-item">
                                <img
                                    src={ArchivosApi.getImagenUrl(imagenId)}
                                    alt={`Imagen ${index + 1}`}
                                    width="150"
                                />
                                <div className="imagen-info">
                                    <span className="">{imageFileNames[imagenId] || `Imagen ${index + 1}`}</span>
                                    <Button
                                        type="button"
                                        className="btn-quitar"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Quitar
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                ) : (
                    <div className="">No hay imágenes en este carrusel</div>
                )}

                <div className="">
                    <Input
                        type="file"
                        id={`carrusel-upload-${identifier}`}
                        multiple
                        accept="image/*"
                        onChange={handleImagenChange}
                        disabled={isUploading}
                    />
                    <Label htmlFor={`carrusel-upload-${identifier}`} className="btn-upload">
                        {isUploading ? 'Subiendo...' : 'Añadir imágenes'}
                    </Label>
                </div>
            </div>
        </div>
    );
}