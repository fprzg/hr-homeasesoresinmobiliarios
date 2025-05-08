import { InmuebleType } from "@shared/zod/src"

export function InmueblesLista({
    inmuebles, handleEdit, handleDelete
}: {
    inmuebles: InmuebleType[],
    handleEdit: (id: string) => void,
    handleDelete: (id: string) => void
}) {
    return (
        <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Inmuebles Registrados</h2>

            {inmuebles.length === 0 ? (
                <p className="text-gray-500">No hay inmuebles registrados.</p>
            ) : (
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
            )}
        </div>

    )
}