import { Inmueble as InmuebleType } from "@shared/zodSchemas/inmueble";
import { Button } from "./ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const precioLegible = (cantidad: number) => {
    const numero = Number(cantidad);
    return numero.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

const fechaLegible = (fechaOriginal: string) => {
    const fecha = new Date(fechaOriginal);
    const legible = fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return legible;
};

export function InmuebleBlock(inmueble: InmuebleType) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to: `/inmuebles/${inmueble.id}` })
    };

    return (
        <div key={inmueble.id} className='text-center flex flex-col justify-center p-8 gap-4'>
            <h1 className="text-3xl">{inmueble.titulo}</h1>
            <p>Publicación: {fechaLegible(inmueble.metadata.fechaPublicacion)}</p>
            <p>Precio: {precioLegible(inmueble.metadata.precio)}</p>
            <img src={inmueble.metadata.portadaUrl} alt="" />
            <Button onClick={handleClick} className="w-30 mx-auto bg-blue-600">
                <span>Ver más</span>
                <ArrowRight />
            </Button>
        </div>
    );
}