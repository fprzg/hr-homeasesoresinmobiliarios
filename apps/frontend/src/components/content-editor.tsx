import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BloquePersonalizadoSchema, Inmueble, getDefaultInmueblePage } from "@shared/zodSchemas/inmueble";
import { Plus, Trash2, Image, Video, MapPin, Youtube } from "lucide-react";

export function ContentEditor() {
  const [inmuebleData, setInmuebleData] = useState<Inmueble>(getDefaultInmueblePage());
  
  const saveMutation = useMutation({
    mutationFn: async (data: Inmueble) => {
      const response = await fetch("/api/inmueble", {
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
  
  const addBlock = (blockType: BloquePersonalizadoSchema["tipo"]) => {
    const newContent = [...inmuebleData.contenido];
    
    switch (blockType) {
      case "Titulo":
        newContent.push({ tipo: "Titulo", texto: "" });
        break;
      case "Descripcion":
        newContent.push({ tipo: "Descripcion", texto: "" });
        break;
      case "CarruselImagenes":
        newContent.push({ tipo: "CarruselImagenes", imagenes: ["https://example.com/image1.jpg"] });
        break;
      case "VideoEmbebido":
        newContent.push({ tipo: "VideoEmbebido", video: "" });
        break;
      case "Localizacion":
        newContent.push({ tipo: "Localizacion", texto: "" });
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
    console.log(inmuebleData);
    saveMutation.mutate(inmuebleData);
  };
  
  return (
    <div className="container mx-auto p-4">
      <header className="w-full py-4 border-b mb-6">
        <Tabs defaultValue="section1" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="section1">Section 1</TabsTrigger>
            <TabsTrigger value="section2">Section 2</TabsTrigger>
            <TabsTrigger value="section3">Section 3</TabsTrigger>
            <TabsTrigger value="section4">Section 4</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {inmuebleData.contenido.map((block, index) => (
            <Card key={index} className="mb-4 overflow-hidden">
              <CardContent className="p-4">
                {block.tipo === "Titulo" && (
                  <div>
                    <Label htmlFor={`titulo-${index}`}>Título</Label>
                    <Input
                      id={`titulo-${index}`}
                      value={block.texto}
                      onChange={(e) => updateBlockContent(index, { texto: e.target.value })}
                      placeholder="Agregar título..."
                      className="mt-1"
                    />
                  </div>
                )}
                
                {block.tipo === "Descripcion" && (
                  <div>
                    <Label htmlFor={`descripcion-${index}`}>Descripción</Label>
                    <Textarea
                      id={`descripcion-${index}`}
                      value={block.texto}
                      onChange={(e) => updateBlockContent(index, { texto: e.target.value })}
                      placeholder="Agregar descripción..."
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
                
                {block.tipo === "VideoEmbebido" && (
                  <div>
                    <Label htmlFor={`video-${index}`}>Video YouTube embebido</Label>
                    <Input
                      id={`video-${index}`}
                      value={block.video}
                      onChange={(e) => updateBlockContent(index, { video: e.target.value })}
                      placeholder="URL del video de YouTube"
                      className="mt-1"
                    />
                  </div>
                )}
                
                {block.tipo === "Localizacion" && (
                  <div>
                    <Label htmlFor={`localizacion-${index}`}>Localización</Label>
                    <Input
                      id={`localizacion-${index}`}
                      value={block.texto}
                      onChange={(e) => updateBlockContent(index, { texto: e.target.value })}
                      placeholder="Dirección o coordenadas"
                      className="mt-1"
                    />
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
                  <Button variant="ghost" className="justify-start" onClick={() => addBlock("Titulo")}>
                    <Plus className="h-4 w-4 mr-2" /> Título
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => addBlock("Descripcion")}>
                    <Plus className="h-4 w-4 mr-2" /> Descripción
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => addBlock("CarruselImagenes")}>
                    <Image className="h-4 w-4 mr-2" /> Carrusel
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => addBlock("VideoEmbebido")}>
                    <Youtube className="h-4 w-4 mr-2" /> Video
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => addBlock("Localizacion")}>
                    <MapPin className="h-4 w-4 mr-2" /> Localización
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
          
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Metadata</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
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
                    value={inmuebleData.metadata.precio}
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
                <div>
                  <Label htmlFor="videoUrl">URL de Video</Label>
                  <Input
                    id="videoUrl"
                    value={inmuebleData.metadata.videoUrl || ""}
                    onChange={(e) => setInmuebleData({
                      ...inmuebleData,
                      metadata: { ...inmuebleData.metadata, videoUrl: e.target.value }
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
    </div>
  );
}