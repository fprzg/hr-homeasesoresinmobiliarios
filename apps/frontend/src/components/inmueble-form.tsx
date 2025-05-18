import { useNavigate } from '@tanstack/react-router';
import { crearCasa, crearInmuebleBase, crearTerreno, estadosMexico, InmuebleBaseType, BloqueType, crearBloqueType, InmuebleType } from "@shared/zod";
import { useState, useEffect } from "react";
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

export function InmuebleForm({ inmuebleData }: { inmuebleData?: InmuebleType }) {
    const navigate = useNavigate();

    const { isPending: fetchingInmuebles, error: fetchingInmueblesError, data } = useQuery({
        queryKey: ['get-all-documentos'],
        queryFn: getDocumentos,
    });

    const [inmuebles, setInmuebles] = useState<InmuebleType[]>([]);
    const [inmueble, setInmueble] = useState<InmuebleType>(inmuebleData ?? crearCasa());
    const [isEditing, setIsEditing] = useState(false);
    const [portadaFile, setPortadaFile] = useState(null);
    const [nuevoBloque, setNuevoBloque] = useState<BloqueType>(crearBloqueType());
    const [bloqueEditandoIndex, setBloqueEditandoIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!fetchingInmuebles && data?.inmuebles) {
            setInmuebles(data.inmuebles);
        }
    }, [fetchingInmuebles, data]);

    useEffect(() => {
        if (!fetchingInmuebles && fetchingInmueblesError) {
            setError(fetchingInmueblesError.message);
        }
    }, [fetchingInmuebles, fetchingInmueblesError]);

    useEffect(() => {
        if (inmuebleData) {
            setInmueble(inmuebleData);
            setIsEditing(true);
        }
    }, [inmuebleData]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        const valoresNumericos = [
            "precio",
            "areaTotal",
            "areaConstruida",
            "numBanos",
            "numRecamaras",
            "numPisos",
            "numCocheras",
            "totalAreas",
            "metrosFrente",
            "metrosFondo",
        ];

        if (valoresNumericos.includes(name)) {
            const numValue = value === "" ? 0 : parseInt(value, 10);
            setInmueble({ ...inmueble, [name]: numValue });
        }
        else if (type === "checkbox") {
            setInmueble({ ...inmueble, [name]: checked });
        }
        else if (name === "tipo") {
            const base = crearInmuebleBase(inmueble);
            const emptyInmueble = value === "terreno" ? crearTerreno() : crearCasa();
            const nuevoInmueble = {
                ...emptyInmueble,
                ...base,
            }
            setInmueble(nuevoInmueble);
        } else {
            if (name.startsWith("asentamiento.")) {
                const asentamientoName = name.substring("asentamiento.".length)
                setInmueble({
                    ...inmueble,
                    asentamiento: { ...inmueble.asentamiento, [asentamientoName]: value }
                });
            } else {
                setInmueble({ ...inmueble, [name]: value });
            }
        }
    };

    const handleBloqueChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setNuevoBloque({ ...nuevoBloque, [name]: checked });
        } else {
            setNuevoBloque({ ...nuevoBloque, [name]: value });
        }
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

            setInmueble({
                ...inmueble,
                portada: data.imagenes[0].id as string,
            });
            setLoading(false);
        } catch (err) {
            setError("Error al subir la imagen de portada");
            setLoading(false);
        }
    };

    const handleBloqueImagenUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/archivos', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            setNuevoBloque({
                ...nuevoBloque,
                imagenId: data.imagenes[0].id as string,
            });
            setLoading(false);
        } catch (err) {
            setError("Error al subir la imagen del bloque");
            setLoading(false);
        }
    };

    const handleAddBloque = () => {
        if (!nuevoBloque.imagenId || !nuevoBloque.descripcion) {
            setError("La imagen y descripción son obligatorias");
            return;
        }

        if (bloqueEditandoIndex === -1) {
            setInmueble({
                ...inmueble,
                contenido: [...inmueble.contenido, { ...nuevoBloque }],
            });
        } else {
            const contenido = [...inmueble.contenido];
            contenido[bloqueEditandoIndex] = nuevoBloque;
            setInmueble({
                ...inmueble,
                contenido,
            });
        }
        setBloqueEditandoIndex(-1);
        setNuevoBloque(crearBloqueType());
        setError("");
    };

    const handleUpdateBloque = (index: number) => {
        setBloqueEditandoIndex(index);
        setNuevoBloque(inmueble.contenido[index]);
    };

    const handleRemoveBloque = (index: number) => {
        const newContenido = [...inmueble.contenido];
        newContenido.splice(index, 1);
        setInmueble({ ...inmueble, contenido: newContenido });
    };

    const handleSubmit = async () => {
        if (inmueble.precio <= 0 || inmueble.areaTotal <= 0) {
            window.scrollTo(0, 0);
            setError("Por favor complete todos los campos obligatorios");
            return;
        }

        if (!inmueble.portada) {
            window.scrollTo(0, 0);
            setError("La imagen de portada es obligatoria");
            return;
        }

        try {
            setLoading(true);
            const currentDate = new Date().toISOString();

            if (isEditing) {
                const updatedInmueble = {
                    ...inmueble,
                    fechaActualizacion: currentDate,
                };

                await fetch('/api/inmuebles', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedInmueble)
                });

                setInmuebles(
                    inmuebles.map((item) =>
                        item.id === inmueble.id ? updatedInmueble : item
                    )
                );
            } else {
                const newInmueble = {
                    ...inmueble,
                    fechaPublicacion: currentDate,
                    fechaActualizacion: currentDate,
                };

                const res = await fetch('/api/inmuebles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newInmueble)
                });

                if (!res.ok) {
                    throw new Error("error al enviar al registar el inmueble. Intente de nuevo o contacte al administrador.");
                }

                const data = await res.json();

                if (data.ok) {
                    setInmuebles([...inmuebles, inmueble]);
                    resetForm();
                } else {
                    setError("error al guardar el inmueble. Intente más tarde o contacte el administrador.");
                }
            }

            setLoading(false);
        } catch (err) {
            setError("Error al guardar el inmueble");
            setLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        navigate({ to: `/dash/inmuebles/${id}` })
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar este inmueble?")) return;

        try {
            setLoading(true);

            const res = await api.inmuebles[":id"].$get({ param: { id } });
            if (!res.ok) {
                setError('error al eliminar el inmueble. Intente de nuevo o contacte al administrador.');
                return;
            }

            const data = await res.json();
            if (!data.ok) {
                setError('error al eliminar el inmueble. Intente de nuevo o contacte al administrador.');
                return;
            }

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

    const resetForm = () => {
        if (inmueble.tipo === "casa") {
            setInmueble(crearCasa());
        } else {
            setInmueble(crearTerreno());
        }

        setPortadaFile(null);
        setNuevoBloque(crearBloqueType());
        setIsEditing(false);
        setError("");
    };

    const InmueblesLista = () => {
        if (fetchingInmuebles) {
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
                                    {item.tipo === "casa" ? "Casa" : "Terreno"} en {item.asentamiento.municipio}, {item.asentamiento.estado}
                                </h3>
                                <p className="text-gray-600">
                                    ${item.precio.toLocaleString()} MXN | Área: {item.areaTotal} m²
                                </p>
                                {item.tipo === "casa" && (
                                    <p className="text-sm text-gray-500">
                                        {item.numRecamaras} rec. | {item.numBanos} baños | {item.areaConstruida} m² construidos
                                    </p>
                                )}
                                {item.tipo === "terreno" && (
                                    <p className="text-sm text-gray-500">
                                        {item.metrosFrente}m × {item.metrosFondo}m | Propiedad {item.tipoPropiedad}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium mb-1">Área total*</label>
                        <input
                            type="number"
                            name="areaTotal"
                            value={inmueble.areaTotal || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            min="1"
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Estado*</label>
                        <select
                            name="asentamiento.estado"
                            value={inmueble.asentamiento.estado}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            {estadosMexico.map((estado) => (
                                <option key={estado} value={estado}>
                                    {estado}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tipo Asentamiento*</label>
                        <input
                            type="text"
                            name="asentamiento.tipo"
                            value={inmueble.asentamiento.tipo}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Calle y colonia</label>
                        <input
                            type="text"
                            name="asentamiento.calleColonia"
                            value={inmueble.asentamiento.calleColonia}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Municipio</label>
                        <input
                            type="text"
                            name="asentamiento.municipio"
                            value={inmueble.asentamiento.municipio}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Codigo postal*</label>
                        <input
                            type="number"
                            name="asentamiento.codigoPostal"
                            value={inmueble.asentamiento.codigoPostal}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            min="1"
                        />
                    </div>
                </div>

                {/* Info de la publicación*/}
                <div>
                    <h2 className="text-lg font-semibold">Información de la publicación</h2>
                    <div className="">
                        <label htmlFor="" className='block text-sm font-medium mb-1'>Título*</label>
                        <input
                            type="text"
                            name="titulo"
                            value={inmueble.titulo}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="">
                        <label htmlFor="" className="block text-sm font-medium mb-1">Descripción*</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={inmueble.descripcion}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Campos específicos para Casa */}
                {inmueble.tipo === "casa" && (
                    <>
                        <h2 className="text-lg font-semibold">Información sobre la casa</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Área construida (m²)</label>
                                <input
                                    type="number"
                                    name="areaConstruida"
                                    value={inmueble.areaConstruida || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Número de baños</label>
                                <input
                                    type="number"
                                    name="numBanos"
                                    value={inmueble.numBanos || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Número de recámaras</label>
                                <input
                                    type="number"
                                    name="numRecamaras"
                                    value={inmueble.numRecamaras || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Número de pisos</label>
                                <input
                                    type="number"
                                    name="numPisos"
                                    value={inmueble.numPisos || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Número de cocheras</label>
                                <input
                                    type="number"
                                    name="numCocheras"
                                    value={inmueble.numCocheras || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Número de áreas</label>
                                <input
                                    type="number"
                                    name="totalAreas"
                                    value={inmueble.totalAreas || ""}
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
                    </>
                )}

                {/* Campos específicos para Terreno */}
                {inmueble.tipo === "terreno" && (
                    <>
                        <h2 className="text-lg font-semibold">Información sobre el terreno</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Metros de frente*</label>
                                <input
                                    type="number"
                                    name="metrosFrente"
                                    value={inmueble.metrosFrente || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    min={1}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Metros de fondo*</label>
                                <input
                                    type="number"
                                    name="metrosFondo"
                                    value={inmueble.metrosFondo || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Tipo de propiedad*</label>
                                <select
                                    name="tipoPropiedad"
                                    value={inmueble.tipoPropiedad}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="privada">Privada</option>
                                    <option value="comunal">Comunal</option>
                                    <option value="ejidal">Ejidal</option>
                                </select>
                            </div>
                        </div>
                    </>
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
                                            <p className="text-sm font-medium">Imagen: {bloque.imagenId}</p>
                                            <p className="text-sm">Descripción: {bloque.descripcion}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateBloque(index)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveBloque(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
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
                                {nuevoBloque.imagenId && (
                                    <span className="text-xs text-green-600">
                                        Imagen cargada: {nuevoBloque.imagenId}
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
                            <div>
                                <div className='flex items-center'>
                                    <input
                                        type="checkbox"
                                        name="agregarAPortada"
                                        onChange={handleBloqueChange}
                                        className='mr-2'
                                    />
                                    <label htmlFor="agregarAPortada" className='text-sm font-medium'>Agregar a portada</label>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddBloque}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                            >
                                {bloqueEditandoIndex ? "Añadir bloque" : "Actualizar bloque"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            navigate({ to: "/dash" });
                        }}
                        className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancelar
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => {
                                window.scrollTo(0, 0);
                                resetForm();
                                navigate({ to: "/dash" });
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Nuevo
                        </button>
                    )}

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
