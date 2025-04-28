import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BloquePersonalizado, crearInmuebleBase, Inmueble } from "@shared/zodSchemas/inmueble";
import { Plus, Trash2, Image } from "lucide-react";
import { Categoria } from "@shared/zodSchemas/categoria";

export function ContentEditor() {
  const [inmuebleData, setInmuebleData] = useState<Inmueble>(crearInmuebleBase());

  const saveMutation = useMutation({
    mutationFn: async (data: Inmueble) => {
      const response = await fetch("/api/inmuebles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      return await response.json();
    },
  });

  const addBlock = (blockType: BloquePersonalizado["tipo"]) => {
    const newContent = [...inmuebleData.contenido];

    switch (blockType) {
      case "Texto":
        newContent.push({ tipo: "Texto", texto: "" });
        break;
      case "CarruselImagenes":
        newContent.push({ tipo: "CarruselImagenes", imagenes: ["https://placehold.co/600x400/orange/white"] });
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

  const handleSave = () => {
    saveMutation.mutate(inmuebleData);
  };

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleCategoriaChange = (value: any) => {
    setInmuebleData({
      ...inmuebleData,
      categoria: value
    });
  };


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
                      {block.imagenes.map((url, imgIndex) => (
                        <div key={imgIndex} className="flex items-center gap-2">
                          <Input
                            value={url}
                            onChange={(e) => {
                              const newImages = [...block.imagenes];
                              newImages[imgIndex] = e.target.value;
                              updateBlockContent(index, { imagenes: newImages });
                            }}
                            placeholder="URL de la imagen"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newImages = [...block.imagenes];
                              newImages.splice(imgIndex, 1);
                              updateBlockContent(index, { imagenes: newImages });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateBlockContent(index, {
                            imagenes: [...block.imagenes, "https://example.com/image.jpg"]
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Agregar imagen
                      </Button>
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
          <Button className="w-full" onClick={handleSave}>
            Guardar
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
                  <Label htmlFor="portada">URL de Portada</Label>
                  <Input
                    id="portada"
                    value={inmuebleData.metadata.portadaUrl}
                    onChange={(e) => setInmuebleData({
                      ...inmuebleData,
                      categoria: e.target.value,
                    })}
                    className="mt-1"
                  />
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
                  <Label htmlFor="portada">URL de Portada</Label>
                  <Input
                    id="portada"
                    value={inmuebleData.metadata.portadaUrl}
                    onChange={(e) => setInmuebleData({
                      ...inmuebleData,
                      metadata: { ...inmuebleData.metadata, portadaUrl: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {saveMutation.isSuccess && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          Contenido guardado exitosamente
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