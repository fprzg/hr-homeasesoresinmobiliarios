import { type InmuebleType, bloqueSchema, inmuebleSchema, } from "@shared/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { precioLegible } from "@/lib/currency";


function fechaLegible(fechaOriginal: string) {
    const fecha = new Date(fechaOriginal);
    const legible = fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return legible;
};

export const InmueblePreview = ({ documentoContent, keyName, className }: { documentoContent: InmuebleType, keyName?: any, className?: string }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to: `/inmuebles/${documentoContent.id}` })
    };

    return (
        <div key={keyName} className={`text-center flex flex-col justify-center p-2 gap-4 shadow-md ${className}`}>
            <h1 className="text-lg">{documentoContent.asentamiento}</h1>
            <p>Publicación: {fechaLegible(documentoContent.fechaActualizacion)}</p>
            {documentoContent.precio &&
                <p>Precio: {precioLegible(documentoContent.precio)}</p>
            }
            <img src={`/api/archivos/${documentoContent.portada}`} alt="" />
            <button onClick={handleClick} className="w-30 mx-auto bg-blue-600">
                <span>Ver más</span>
                <ArrowRight />
            </button>
        </div>
    );
}

export function InmueblePage({ inmuebleData, className }: { inmuebleData: InmuebleType, className?: string }) {
    return (
        <div className={`text-center flex flex-col justify-center p-8 gap-4 ${className}`}>
            <h1 className="text-3xl">{inmuebleData.asentamiento}</h1>
            <p className="text-lg">Publicación: {fechaLegible(inmuebleData.fechaActualizacion)}</p>
            <p className="text-lg">Precio: {precioLegible(inmuebleData.precio)}</p>

            <img src={`/api/archivos/${inmuebleData.portada}`} alt="" />

            <p className="text-lg">Area total: {inmuebleData.area_total}</p>

            {inmuebleData.tipo === "casa" ?
                (
                    <>
                        <h3 className="text-xl">{inmuebleData.total_areas} áreas</h3>
                        <p className="text-lg">Área construida: {inmuebleData.area_construida}</p>
                        <p className="text-lg">{inmuebleData.num_banos} baños</p>
                        <p className="text-lg">{inmuebleData.num_recamaras} recámaras</p>
                        <p className="text-lg">{inmuebleData.num_pisos} pisos</p>
                        <p className="text-lg">{inmuebleData.num_cocheras} cocheras</p>
                        {inmuebleData.piscina && <p className="text-lg">Piscina</p>}
                    </>
                ) : (
                    <>
                        <p className="text-lg">Metros de frente: {inmuebleData.metros_frente}m</p>
                        <p className="text-lg">Metros de fondo: {inmuebleData.metros_fondo}m</p>
                        <p className="text-lg">Propiedad {inmuebleData.tipo_propiedad}</p>
                    </>
                )}


            <div className="">
                {inmuebleData.contenido.map((bloque, index) => (
                    <div className="grid grid-rows-1 justify-center p-4 gap-4">
                        <img src={`/api/archivos/${bloque.imagen}`} alt="" />
                        <p className="text-xl">{bloque.descripcion}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
