import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type BloquePersonalizado, crearInmuebleBase, Inmueble } from "@shared/zodSchemas/inmueble";
import { Plus, Trash2, Image, Upload, MoveVertical } from "lucide-react";
import { Categoria } from "@shared/zodSchemas/categoria";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { Link as RouterLink } from '@tanstack/react-router'
import { router } from "@/router";

// Definimos la interfaz para los archivos seleccionados
interface FileWithPreview {
  file: File;
  name: string;
  id?: string; // ID obtenido después de subir
}

// Interfaz para el bloque personalizado con archivos temporales
type BloqueConArchivos = BloquePersonalizado & {
  archivosTemporales?: FileWithPreview[];
}

// Interfaz extendida para inmueble con archivo de portada
interface InmuebleConArchivos extends Inmueble {
  archivoPortada?: FileWithPreview;
  contenido: BloqueConArchivos[];
}

// Sortable Image Item Component
function SortableImageItem({ item, index, onRemove, id }: { 
  item: FileWithPreview | string; 
  index: number; 
  onRemove: () => void;
  id: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determinar qué mostrar basado en si es un archivo local o una URL
  const displayName = typeof item === 'string' ? item : item.name;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 mb-2"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab p-1 hover:bg-gray-200 rounded"
      >
        <MoveVertical className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex-grow flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-200 flex items-center justify-center rounded">
          <Image className="h-4 w-4 text-gray-500" />
        </div>
        <span className="flex-grow truncate text-sm">{displayName}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ContentEditor() {
  const [inmuebleData, setInmuebleData] = useState<InmuebleConArchivos>(crearInmuebleBase() as InmuebleConArchivos);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mutación para guardar el inmueble
  const saveMutation = useMutation({
    mutationFn: async (data: Inmueble) => {
      // Preparamos un objeto limpio para enviar (sin archivos temporales)
      const dataToSend = { ...data };
      
      const response = await fetch("/api/inmuebles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      return await response.json();
    },
  });

  const checkLoading = (mutation: any) => mutation.status === "pending";

  // Mutación para subir imágenes
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('inmuebleId', inmuebleData.id);
      
      const response = await fetch("/api/archivos", {
        method: "POST",
        body: formData,
      });

      const asJson = await response.json();
      if (!response.ok) {
        //throw new Error("Failed to upload image");
        throw new Error(asJson.error);
      }

      return asJson;
    },
  });

  const addBlock = (blockType: BloquePersonalizado["tipo"]) => {
    const newContent = [...inmuebleData.contenido];

    switch (blockType) {
      case "Texto":
        newContent.push({ tipo: "Texto", texto: "" });
        break;
      case "CarruselImagenes":
        newContent.push({ 
          tipo: "CarruselImagenes", 
          imagenes: [],
          archivosTemporales: []
        });
        break;
    }

    setInmuebleData({
      ...inmuebleData,
      contenido: newContent,
    });
  };

  const updateBlockContent = (index: number, content: any) => {
    const newContent = [...inmuebleData.contenido];
    newContent[index] = { ...newContent[index], ...content };

    setInmuebleData({
      ...inmuebleData,
      contenido: newContent,
    });
  };

  const removeBlock = (index: number) => {
    const newContent = [...inmuebleData.contenido];
    newContent.splice(index, 1);

    setInmuebleData({
      ...inmuebleData,
      contenido: newContent,
    });
  };

  // Manejo de archivos
  const handleFileSelect = (blockIndex: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const block = inmuebleData.contenido[blockIndex];
    if (block.tipo === "CarruselImagenes") {
      // Crear objetos FileWithPreview
      const fileArray: FileWithPreview[] = Array.from(files).map(file => ({
        file,
        name: file.name
      }));
      
      // Añadir a los archivos temporales existentes
      const archivosTemporales = [...(block.archivosTemporales || []), ...fileArray];
      
      updateBlockContent(blockIndex, { archivosTemporales });
    }
  };

  const handlePortadaSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setInmuebleData({
      ...inmuebleData,
      archivoPortada: {
        file,
        name: file.name
      }
    });
  };

  // Función para subir todas las imágenes
  const uploadAllImages = async () => {
    // Lista para almacenar todas las promesas de subida
    const uploadPromises: Promise<any>[] = [];
    const updatedInmueble: InmuebleConArchivos = { ...inmuebleData };
    
    // Subir la imagen de portada si existe
    if (inmuebleData.archivoPortada?.file) {
      const portadaPromise = uploadImageMutation.mutateAsync(inmuebleData.archivoPortada.file)
        .then(response => {
          // Actualizar la URL de portada con el ID
          updatedInmueble.metadata.portada = response.id;
        });
      uploadPromises.push(portadaPromise);
    }
    
    // Recorrer los bloques para encontrar imágenes por subir
    updatedInmueble.contenido = inmuebleData.contenido.map((block) => {
      if (block.tipo === "CarruselImagenes" && block.archivosTemporales?.length) {
        const newBlock = { ...block };
        
        // Por cada archivo en el bloque
        newBlock.archivosTemporales?.forEach((fileItem, fileIndex) => {
          if (fileItem.file) {
            const uploadPromise = uploadImageMutation.mutateAsync(fileItem.file)
              .then(response => {
                // Actualizar las imágenes con los IDs retornados
                if (!newBlock.imagenes) newBlock.imagenes = [];
                newBlock.imagenes.push(response.id);
              });
            uploadPromises.push(uploadPromise);
          }
        });
        
        return newBlock;
      }
      return block;
    });
    
    // Esperar a que todas las subidas terminen
    await Promise.all(uploadPromises);
    
    // Preparar el objeto final para guardarlo
    const cleanInmueble: Inmueble = {
      ...updatedInmueble,
      contenido: updatedInmueble.contenido.map(block => {
        // Remover los archivos temporales antes de guardar
        const { archivosTemporales, ...cleanBlock } = block;
        return cleanBlock;
      })
    };
    
    // Guardar el inmueble actualizado
    return saveMutation.mutateAsync(cleanInmueble);
  };

  // Función para manejar guardado completo
  const handleSave = async () => {
    try {
      await uploadAllImages();
      // Si llegamos aquí, todo ha funcionado correctamente
      console.log("Inmueble guardado con éxito");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleCategoriaChange = (value: any) => {
    setInmuebleData({
      ...inmuebleData,
      categoria: value
    });
  };

  // DnD sensors para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Manejar reordenamiento de imágenes
  const handleDragEnd = (event: DragEndEvent, blockIndex: number) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const block = inmuebleData.contenido[blockIndex];
      if (block.tipo === "CarruselImagenes" && block.archivosTemporales) {
        const oldIndex = parseInt(active.id.toString().split('-')[1]);
        const newIndex = parseInt(over.id.toString().split('-')[1]);
        
        const newArchivos = [...block.archivosTemporales];
        const [movedItem] = newArchivos.splice(oldIndex, 1);
        newArchivos.splice(newIndex, 0, movedItem);
        
        updateBlockContent(blockIndex, { archivosTemporales: newArchivos });
      }
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/categorias");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setCategorias(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err?.message);
        }
        console.error("Error al cargar categorías:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {inmuebleData.contenido.map((block, index) => (
            <Card key={index} className="mb-4 overflow-hidden">
              <CardContent className="p-4">
                {block.tipo === "Texto" && (
                  <div>
                    <Label htmlFor={`texto-${index}`}>Texto</Label>
                    <Textarea
                      id={`texto-${index}`}
                      value={block.texto}
                      onChange={(e) => updateBlockContent(index, { texto: e.target.value })}
                      placeholder="Agregar texto..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                )}
                {block.tipo === "CarruselImagenes" && (
                  <div>
                    <Label className="mb-2 block">Carrusel de imágenes</Label>
                    <div className="space-y-2">
                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleDragEnd(event, index)}
                        modifiers={[restrictToVerticalAxis]}
                      >
                        <SortableContext 
                          items={(block.archivosTemporales || []).map((_, i) => `image-${i}`)} 
                          strategy={verticalListSortingStrategy}
                        >
                          {/* Mostrar archivos existentes */}
                          {block.imagenes && block.imagenes.map((id, imgIndex) => (
                            <div key={`existing-${imgIndex}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 mb-2">
                              <div className="h-8 w-8 bg-gray-200 flex items-center justify-center rounded">
                                <Image className="h-4 w-4 text-gray-500" />
                              </div>
                              <span className="flex-grow truncate text-sm">{id}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newImages = [...block.imagenes!];
                                  newImages.splice(imgIndex, 1);
                                  updateBlockContent(index, { imagenes: newImages });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          {/* Mostrar archivos temporales */}
                          {block.archivosTemporales?.map((fileItem, imgIndex) => (
                            <SortableImageItem
                              key={`image-${imgIndex}`}
                              id={`image-${imgIndex}`}
                              item={fileItem}
                              index={imgIndex}
                              onRemove={() => {
                                const newArchivos = [...(block.archivosTemporales || [])];
                                newArchivos.splice(imgIndex, 1);
                                updateBlockContent(index, { archivosTemporales: newArchivos });
                              }}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`file-upload-${index}`)?.click()}
                          className="flex-1"
                        >
                          <Upload className="h-4 w-4 mr-2" /> Seleccionar imágenes
                        </Button>
                        <input 
                          id={`file-upload-${index}`}
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileSelect(index, e.target.files)}
                          className="hidden"
                          multiple
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end mt-2">
                  <Button variant="destructive" size="sm" onClick={() => removeBlock(index)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid gap-2">
                  <Button variant="ghost" className="justify-start" onClick={() => addBlock("Texto")}>
                    <Plus className="h-4 w-4 mr-2" /> Texto
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => addBlock("CarruselImagenes")}>
                    <Image className="h-4 w-4 mr-2" /> Carrusel
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={checkLoading(saveMutation) || checkLoading(uploadImageMutation)}
          >
            {(checkLoading(saveMutation) || checkLoading(uploadImageMutation)) ? "Guardando..." : "Guardar"}
          </Button>
          <Button variant="destructive" className="w-full">
            Eliminar
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="titulo">Titulo</Label>
                  <Input
                    id="titulo"
                    type="text"
                    value={inmuebleData.titulo}
                    onChange={(e) => setInmuebleData({
                      ...inmuebleData,
                      titulo: e.target.value,
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={inmuebleData.categoria || ""}
                    onValueChange={handleCategoriaChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {error ? (
                        <SelectItem value="error" disabled>Error al cargar categorías</SelectItem>
                      ) : isLoading ? (
                        <SelectItem value="loading" disabled>Cargando categorías...</SelectItem>
                      ) : (
                        categorias.map((categoria) => (
                          <SelectItem key={categoria.id} value={"" + categoria.id}>
                            {categoria.nombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="portada">Imagen de Portada</Label>
                  <div className="mt-1 flex gap-2">
                    {inmuebleData.metadata.portada && (
                      <div className="h-8 w-8 bg-gray-200 flex items-center justify-center rounded">
                        <Image className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                    {inmuebleData.archivoPortada && (
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-200 flex items-center justify-center rounded">
                          <Image className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-sm">{inmuebleData.archivoPortada.name}</span>
                      </div>
                    )}
                    <div className="flex-grow flex gap-2">
                      {!inmuebleData.archivoPortada && !inmuebleData.metadata.portada && (
                        <span className="text-gray-500 text-sm flex-grow">No se ha seleccionado una imagen</span>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('portada-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <input
                        id="portada-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePortadaSelect(e.target.files)}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle>Metadatos</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    type="text"
                    value={inmuebleData.metadata.ubicacion}
                    onChange={(e) => setInmuebleData({
                      ...inmuebleData,
                      metadata: { ...inmuebleData.metadata, ubicacion: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    type="number"
                    value={inmuebleData.metadata.precio || ""}
                    onChange={(e) => setInmuebleData({
                      ...inmuebleData,
                      metadata: { ...inmuebleData.metadata, precio: Number(e.target.value) }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={inmuebleData.metadata.descripcion || ""}
                    onChange={(e) => setInmuebleData({
                      ...inmuebleData,
                      metadata: { ...inmuebleData.metadata, descripcion: e.target.value }
                    })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {checkLoading(uploadImageMutation) && (
        <div className="mt-4 p-2 bg-blue-100 text-blue-700 rounded">
          Subiendo imágenes...
        </div>
      )}

      {uploadImageMutation.isError && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          Error al subir imagen: {(uploadImageMutation.error as Error).message}
        </div>
      )}

{saveMutation.isSuccess && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded flex gap-4">
          <span>Contenido guardado exitosamente</span>
          <a href={`/inmuebles/${inmuebleData.id}`}>Ver</a>
        </div>
      )}

      {saveMutation.isError && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          Error al guardar: {(saveMutation.error as Error).message}
        </div>
      )}
    </>
  );
}