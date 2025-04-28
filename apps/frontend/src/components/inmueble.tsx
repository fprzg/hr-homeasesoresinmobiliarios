import { BloquePersonalizado, inmuebleSchema, Inmueble as InmuebleType } from "@shared/zodSchemas/inmueble";
import { Button } from "./ui/button";
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

function renderBloque(bloque: BloquePersonalizado, key?: number, className?: string) {
    className = `mb-6 ${className}`
    switch (bloque.tipo) {
        case "Texto":
            return (
                <div key={key} className={className}>
                    <p className="text-xl">{bloque.texto}</p>
                </div>
            )
        case "CarruselImagenes":
            /*
            return (
                <div key={key} className={className}>
                    <h3 className="text-xl font-semibold mb-2">Galería de imágenes</h3>
                    <div className="flex overflow-x-auto gap-4 pb-4">
                        {bloque.imagenes.map((imagenUrl, imgIndex) => (
                            <div key={imgIndex} className="flex-shrink-0">
                                <img src={`/api/archivos/${imagenUrl}`} alt={`Imagen ${imgIndex + 1}`} className="rounded-lg shadow-md" />
                                <p className="text-xs text-center mt-1 text-gray-500">Imagen {imgIndex + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
            */
            return (
                <div key={key} className={className}>
                    <h3 className="text-xl font-semibold mb-2">Galería de imágenes</h3>
                    <div className="grid gap-4 pb-4">
                        {bloque.imagenes.map((imagenUrl, imgIndex) => (
                            <img src={`/api/archivos/${imagenUrl}`} alt={`Imagen ${imgIndex + 1}`} className="rounded-lg shadow-md" />
                        ))}
                    </div>
                </div>
            );
        default:
            return null;
    }
};

export function InmueblePreview(inmueble: InmuebleType) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to: `/inmuebles/${inmueble.id}` })
    };

    return (
        <div key={inmueble.id} className='text-center flex flex-col justify-center p-8 gap-4'>
            <h1 className="text-3xl">{inmueble.titulo}</h1>
            <p>Publicación: {fechaLegible(inmueble.metadata.fechaPublicacion)}</p>
            {inmueble.metadata.precio &&
                <p>Precio: {precioLegible(inmueble.metadata.precio)}</p>
            }
            <img src={`/api/archivos/${inmueble.metadata.portada}`} alt="" />
            <Button onClick={handleClick} className="w-30 mx-auto bg-blue-600">
                <span>Ver más</span>
                <ArrowRight />
            </Button>
        </div>
    );
}

export function InmueblePage(inmueble: InmuebleType) {
    return (
        <div key={inmueble.id} className='text-center flex flex-col justify-center p-8 gap-4'>
            <h1 className="text-3xl">{inmueble.titulo}</h1>
            <p>Publicación: {fechaLegible(inmueble.metadata.fechaPublicacion)}</p>
            {inmueble.metadata.precio &&
                <p>Precio: {precioLegible(inmueble.metadata.precio)}</p>
            }
            <img src={`/api/archivos/${inmueble.metadata.portada}`} alt="" />
            {inmueble.contenido.map((bloque, index) => (
                <>
                    {renderBloque(bloque, index)}
                </>
            ))}
        </div>
    );
}
