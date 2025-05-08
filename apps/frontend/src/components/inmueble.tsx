import { type InmuebleType, type bloqueSchema, inmuebleSchema, } from "@shared/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

function precioLegible(cantidad: number) {
    const numero = Number(cantidad);
    return numero.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

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
            <h1 className="text-3xl">asdfsdf</h1>
            <p>Publicación: {fechaLegible(inmuebleData.fechaActualizacion)}</p>

            <img src={`/api/archivos/${inmuebleData.portada}`} alt="" />

        </div>
    );
}
