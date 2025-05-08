import { InmueblesApi } from "@/api";
import { crearCasa, crearTerreno, InmuebleBaseType, InmuebleType } from "@shared/zod/src";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

async function getDocumentos() {
  const res = await api.inmuebles.$get();
  if (!res.ok) {
    throw new Error('server error');
  }
  const data = await res.json();
  return data;
}

//export default function InmuebleForm({ inmuebleDefault }: { inmuebleDefault: InmuebleType }) {
export default function InmuebleForm() {
  const { isPending: inmueblesLoading, error: inmueblesErrorMsg, data } = useQuery({
    queryKey: ['get-all-documentos'],
    queryFn: getDocumentos,
  });

  //const [inmuebles, setInmuebles] = useState<InmuebleType[]>(data ? data.inmuebles : []);
  const [inmuebles, setInmuebles] = useState<InmuebleType[]>(data?.inmuebles ?? []);


  const [inmueble, setInmueble] = useState<InmuebleType>(crearCasa());
  const [isEditing, setIsEditing] = useState(false);
  const [portadaFile, setPortadaFile] = useState(null);
  const [nuevoBloque, setNuevoBloque] = useState({ imagen: "", descripcion: "", });
  const [bloqueImagenFile, setBloqueImagenFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Maneja cambios en el formulario
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    // Manejo para valores numéricos
    if (
      [
        "precio",
        "area_total",
        "area_construida",
        "num_banos",
        "num_recamaras",
        "num_pisos",
        "num_cocheras",
        "total_areas",
        "metros_frente",
        "metros_fondo",
      ].includes(name)
    ) {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      setInmueble({ ...inmueble, [name]: numValue });
    }
    else if (type === "checkbox") {
      setInmueble({ ...inmueble, [name]: checked });
    }
    else if (name === "tipo") {
      if (value === "casa") {
        setInmueble(crearCasa());
      } else {
        setInmueble(crearTerreno());
      }
    } else {
      setInmueble({ ...inmueble, [name]: value });
    }
  };

  const handleBloqueChange = (e: any) => {
    const { name, value } = e.target;
    setNuevoBloque({ ...nuevoBloque, [name]: value });
  };

  const handlePortadaUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setPortadaFile(file);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/archivos', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);

      const imageId = data.imagenes[0].id;

      setInmueble({
        ...inmueble,
        portada: imageId,
      });
      setLoading(false);
    } catch (err) {
      setError("Error al subir la imagen de portada");
      setLoading(false);
    }
  };

  // Maneja la subida de imagen para un bloque de contenido
  const handleBloqueImagenUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setBloqueImagenFile(file);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/archivos', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      const imageId = data.imagenes[0].id;

      setNuevoBloque({
        ...nuevoBloque,
        imagen: imageId,
      });
      setLoading(false);
    } catch (err) {
      setError("Error al subir la imagen del bloque");
      setLoading(false);
    }
  };

  // Añade un nuevo bloque al contenido
  const handleAddBloque = () => {
    if (!nuevoBloque.imagen || !nuevoBloque.descripcion) {
      setError("La imagen y descripción son obligatorias");
      return;
    }

    setInmueble({
      ...inmueble,
      contenido: [...inmueble.contenido, { ...nuevoBloque }],
    });

    // Limpiar el formulario del bloque
    setNuevoBloque({ imagen: "", descripcion: "" });
    setBloqueImagenFile(null);
    setError("");
  };

  // Elimina un bloque del contenido
  const handleRemoveBloque = (index: number) => {
    const newContenido = [...inmueble.contenido];
    newContenido.splice(index, 1);
    setInmueble({ ...inmueble, contenido: newContenido });
  };

  // Guardar o actualizar un inmueble
  const handleSubmit = async () => {
    // Validaciones básicas
    if (!inmueble.estado || !inmueble.asentamiento || inmueble.precio <= 0 || inmueble.area_total <= 0) {
      setError("Por favor complete todos los campos obligatorios");
      return;
    }

    if (!inmueble.portada) {
      setError("La imagen de portada es obligatoria");
      return;
    }

    try {
      setLoading(true);
      const currentDate = new Date().toISOString();

      if (isEditing) {
        // Actualizar inmueble existente
        const updatedInmueble = {
          ...inmueble,
          fechaActualizacion: currentDate,
        };

        await fetch('/api/inmuebles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedInmueble)
        });

        // Actualizar en la lista local
        setInmuebles(
          inmuebles.map((item) =>
            item.id === inmueble.id ? updatedInmueble : item
          )
        );

        setIsEditing(false);
      } else {
        // Crear nuevo inmueble
        const newInmueble = {
          ...inmueble,
          //id: `inmueble_${Date.now()}`, // En implementación real, el ID vendría del backend
          fechaPublicacion: currentDate,
          fechaActualizacion: currentDate,
        };

        const response = await fetch('/api/inmuebles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInmueble)
        });
        const data = await response.json();

        setInmuebles([...inmuebles, data.inmueble]);
      }

      // Resetear el formulario
      resetForm();
      setLoading(false);
    } catch (err) {
      setError("Error al guardar el inmueble");
      setLoading(false);
    }
  };

  // Editar un inmueble existente
  const handleEdit = (id: string) => {
    const inmuebleToEdit = inmuebles.find((item) => item.id === id);
    if (inmuebleToEdit) {
      setInmueble(inmuebleToEdit);
      setIsEditing(true);
      window.scrollTo(0, 0);
    }
  };

  // Eliminar un inmueble
  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este inmueble?")) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/inmuebles/${id}`, {
        method: 'DELETE',
      });

      // Eliminar de la lista local
      setInmuebles(inmuebles.filter((item) => item.id !== id));

      if (isEditing && inmueble.id === id) {
        resetForm();
      }

      setLoading(false);
    } catch (err) {
      setError("Error al eliminar el inmueble");
      setLoading(false);
    }
  };

  // Resetear el formulario
  const resetForm = () => {
    // Crear un nuevo objeto inmueble vacío según el tipo actual
    if (inmueble.tipo === "casa") {
      setInmueble(crearCasa());
    } else {
      setInmueble(crearTerreno());
    }

    setPortadaFile(null);
    setNuevoBloque({ imagen: "", descripcion: "" });
    setBloqueImagenFile(null);
    setIsEditing(false);
    setError("");
  };

  const InmueblesLista = () => {
    if (inmueblesLoading) {
      return <p className="text-gray-500">Cargando inmuebles...</p>
    } else if (inmuebles.length === 0) {
      return <p className="text-gray-500">No hay inmuebles registrados.</p>
    }

    return (
      <div className="space-y-4">
        {inmuebles.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">
                  {item.tipo === "casa" ? "Casa" : "Terreno"} en {item.asentamiento}, {item.estado}
                </h3>
                <p className="text-gray-600">
                  ${item.precio.toLocaleString()} MXN | Área: {item.area_total} m²
                </p>
                {item.tipo === "casa" && (
                  <p className="text-sm text-gray-500">
                    {item.num_recamaras} rec. | {item.num_banos} baños | {item.area_construida} m² construidos
                  </p>
                )}
                {item.tipo === "terreno" && (
                  <p className="text-sm text-gray-500">
                    {item.metros_frente}m × {item.metros_fondo}m | Propiedad {item.tipo_propiedad}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Editar Inmueble" : "Registrar Nuevo Inmueble"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Tipo de inmueble */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de inmueble</label>
          <select
            name="tipo"
            value={inmueble.tipo}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
          </select>
        </div>

        {/* Campos comunes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Estado*</label>
            <input
              type="text"
              name="estado"
              value={inmueble.estado}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Asentamiento*</label>
            <input
              type="text"
              name="asentamiento"
              value={inmueble.asentamiento}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Precio (MXN)*</label>
            <input
              type="number"
              name="precio"
              value={inmueble.precio || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Área total (m²)*</label>
            <input
              type="number"
              name="area_total"
              value={inmueble.area_total || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              min="1"
            />
          </div>
        </div>

        {/* Campos específicos para Casa */}
        {inmueble.tipo === "casa" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Área construida (m²)</label>
              <input
                type="number"
                name="area_construida"
                value={inmueble.area_construida || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Número de baños</label>
              <input
                type="number"
                name="num_banos"
                value={inmueble.num_banos || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Número de recámaras</label>
              <input
                type="number"
                name="num_recamaras"
                value={inmueble.num_recamaras || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Número de pisos</label>
              <input
                type="number"
                name="num_pisos"
                value={inmueble.num_pisos || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Número de cocheras</label>
              <input
                type="number"
                name="num_cocheras"
                value={inmueble.num_cocheras || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Número de áreas</label>
              <input
                type="number"
                name="total_areas"
                value={inmueble.total_areas || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="piscina"
                checked={inmueble.piscina}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Piscina</label>
            </div>
          </div>
        )}

        {/* Campos específicos para Terreno */}
        {inmueble.tipo === "terreno" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Metros de frente*</label>
              <input
                type="number"
                name="metros_frente"
                value={inmueble.metros_frente || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Metros de fondo*</label>
              <input
                type="number"
                name="metros_fondo"
                value={inmueble.metros_fondo || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo de propiedad*</label>
              <select
                name="tipo_propiedad"
                value={inmueble.tipo_propiedad}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="privada">Privada</option>
                <option value="comunal">Comunal</option>
                <option value="ejidal">Ejidal</option>
              </select>
            </div>
          </div>
        )}

        {/* Imagen de portada */}
        <div>
          <label className="block text-sm font-medium mb-1">Imagen de portada*</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePortadaUpload}
            className="w-full p-2 border rounded-md"
          />
          {inmueble.portada && (
            <div className="mt-2">
              <span className="text-sm text-green-600">
                Imagen cargada: {inmueble.portada}
              </span>
              {portadaFile && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(portadaFile)}
                    alt="Vista previa"
                    className="h-24 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sección para añadir bloques de contenido */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Bloques de contenido</h3>

          {/* Lista de bloques existentes */}
          {inmueble.contenido.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Bloques existentes:</h4>
              <div className="space-y-3">
                {inmueble.contenido.map((bloque, index) => (
                  <div key={index} className="flex items-start border p-3 rounded-md">
                    <div className="flex-grow">
                      <p className="text-sm font-medium">Imagen: {bloque.imagen}</p>
                      <p className="text-sm">Descripción: {bloque.descripcion}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBloque(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulario para nuevo bloque */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Añadir nuevo bloque:</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBloqueImagenUpload}
                  className="w-full p-2 border rounded-md text-sm"
                />
                {nuevoBloque.imagen && (
                  <span className="text-xs text-green-600">
                    Imagen cargada: {nuevoBloque.imagen}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={nuevoBloque.descripcion}
                  onChange={handleBloqueChange}
                  className="w-full p-2 border rounded-md text-sm"
                  rows={2}
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleAddBloque}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
              >
                Añadir bloque
              </button>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : isEditing
                ? "Actualizar Inmueble"
                : "Guardar Inmueble"}
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Inmuebles Registrados</h2>
        <InmueblesLista />
      </div>
    </div >
  );
}