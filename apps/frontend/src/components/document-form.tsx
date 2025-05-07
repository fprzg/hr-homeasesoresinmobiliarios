import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { BloqueType, InmuebleType, crearBloqueBase, crearDocumentoBase } from '@shared/zod';
import { DocumentosApi, ArchivosApi } from '@/api';
import BloqueTexto from '@/components/bloque-texto';
import BloqueCarrusel from '@/components/bloque-carrusel';
import ImageUploader from '@/components/image-uploader';
import DragDropList from '@/components/drag-drop-list';
import { Button } from '@/components/ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from './ui/select';

export default function InmuebletForm({ documentoInicial, modo }: { documentoInicial?: InmuebleType, modo: 'crear' | 'editar' }) {
    const navigate = useNavigate();
    const [documento, setDocumento] = useState<InmuebleType>(crearDocumentoBase());
    const [imageFileNames, setImageFileNames] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBloqueModalOpen, setIsBloqueModalOpen] = useState(false);

    /*
    // Cargar nombres de archivos si estamos en modo editar
    useEffect(() => {
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
    */

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Manejar cambios en campos anidados (metadata)
        /*
        if (name.startsWith('metadata.')) {
            const metadataField = name.split('.')[1];
            setDocumento({
                ...documento,
                metadata: {
                    ...documento.metadata,
                    [metadataField]: value,
                },
            });
        } 
            */
        setDocumento({
            ...documento,
            [name]: value,
        });
    };

    const handlePortadaUpload = (imageId: string, fileName: string) => {
        setDocumento({
            ...documento,
            portada: imageId,
        });
        //setPortadaFileName(fileName);
    };

    const handleAddBloque = () => {
        const nuevoBloque = crearBloqueBase();
        setDocumento({
            ...documento,
            contenido: [...documento.contenido, nuevoBloque],
        });

        setIsBloqueModalOpen(false);
    };

    const handleUpdateBloque = (index: number, bloqueActualizado: BloqueType) => {
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

    const handleReorderBloques = (nuevosContenidos: BloqueType[]) => {
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

        if (!documento.portada) {
            alert('Sube una imagen de portada.');
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
        <div className="">
            <form onSubmit={handleSubmit}>
                <div className="">
                    <h2>{modo === 'crear' ? 'Crear Nuevo Documento' : 'Editar Documento'}</h2>

                    <div className="">
                        <Button
                            type="submit"
                            className=""
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>

                        {modo === 'editar' && (
                            <Button
                                variant="destructive"
                                className="btn-eliminar"
                                onClick={handleEliminar}
                            >
                                Eliminar
                            </Button>
                        )}
                    </div>
                </div>

                {/* form body */}
                <div className="">
                    <div className="">
                        <h3 className="text-xl pb-6">Información General</h3>

                        <div className="">
                            <Label htmlFor="categoria">Categoría*</Label>

                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel></SelectLabel>
                                        <SelectItem value="casa">Casa</SelectItem>
                                        <SelectItem value="terreno">Terreno</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* TODO: Agregar más detalles para definir el estado */}
                        <div className="">
                            <Label htmlFor="metadata.ubicacion">Asentamiento*</Label>
                            <Input
                                type="text"
                                id="metadata.ubicacion"
                                name="metadata.ubicacion"
                                value={documento.asentamiento}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="">
                            <Label htmlFor="metadata.precio">Precio</Label>
                            <Input
                                type="number"
                                id="metadata.precio"
                                name="metadata.precio"
                                value={documento.precio || ''}
                                onChange={handleNumberInputChange}
                            />
                        </div>

                    </div>

                    <div className="">
                        <Label htmlFor=''>Portada</Label>

                        {documento.portada ? (
                            <div className="portada-preview">
                                <img
                                    src={ArchivosApi.getImagenUrl(documento.portada)}
                                    alt="Portada"
                                    width="200"
                                />
                                {/* <p>{portadaFileName}</p> */}
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setDocumento({ ...documento, portada: '' });
                                        // setPortadaFileName('');
                                    }}
                                >
                                    Cambiar imagen
                                </Button>
                            </div>
                        ) : (
                            <Button>
                                <ImageUploader className=''
                                    onImageUploaded={handlePortadaUpload}
                                    label="Subir portada*"
                                />
                            </Button>
                        )}
                    </div>

                    <div className="">
                        <div className="">
                            <Label>Contenido</Label>

                            <Button
                                type="button"
                                onClick={() => setIsBloqueModalOpen(true)}
                            >
                                Agregar bloque
                            </Button>
                        </div>

                        {isBloqueModalOpen && (
                            <div className="bg-pink-300">
                                <div className="">
                                    <h4>Selecciona el tipo de bloque</h4>
                                    <div className="bloque-options">
                                        <Button
                                            type="button"
                                            onClick={() => handleAddBloque()}
                                        >
                                            Texto
                                        </Button>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => setIsBloqueModalOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {documento.contenido.map((bloque) => (
                            <div className="">
                            </div>
                        ))}

                        {documento.contenido.length === 0 && (
                            <div className="">
                                <p className=''>No hay bloques de contenido. Añade uno haciendo clic en "Agregar bloque".</p>
                            </div>
                        )}

                    </div>
                </div>
            </form>
        </div>
    );
}