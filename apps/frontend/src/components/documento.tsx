import { BloqueDocumento, documentoSchema, Documento as DocumentoType } from "@shared/zodSchemas/documento";
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

function DocumentoBloque({ bloqueContent, keyName, className }: { bloqueContent: BloqueDocumento, keyName?: any, className?: string }) {
    const ComponentContent = () => {
        switch (bloqueContent.tipo) {
            case "Texto":
                return (
                        <p className="text-xl">{bloqueContent.texto}</p>
                )
            case "CarruselImagenes":
                return (
                    <>
                        <h3 className="text-xl font-semibold mb-2">Galería de imágenes</h3>
                        <div className="grid gap-4 pb-4">
                            {bloqueContent.imagenes.map((id, idx) => (
                                <img src={`/api/archivos/${id}`} alt={`Imagen ${idx + 1}`} className="rounded-lg shadow-md" key={idx} />
                            ))}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div key={keyName} className={`mb-6 ${className}`}>
            <ComponentContent/>
        </div>
    )

};

export const DocumentoPreview = ({ documentoContent, keyName, className }: { documentoContent: DocumentoType, keyName?: any, className?: string }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to: `/inmuebles/${documentoContent.id}` })
    };

    return (
        <div key={keyName} className={`text-center flex flex-col justify-center p-2 gap-4 shadow-md ${className}`}>
            <h1 className="text-lg">{documentoContent.titulo}</h1>
            <p>Publicación: {fechaLegible(documentoContent.metadata.fechaPublicacion)}</p>
            {documentoContent.metadata.precio &&
                <p>Precio: {precioLegible(documentoContent.metadata.precio)}</p>
            }
            <img src={`/api/archivos/${documentoContent.portada}`} alt="" />
            <Button onClick={handleClick} className="w-30 mx-auto bg-blue-600">
                <span>Ver más</span>
                <ArrowRight />
            </Button>
        </div>
    );
}

export function DocumentoPage({ documentoContent, className }: { documentoContent: DocumentoType, className?: string }) {
    return (
        <div className={`text-center flex flex-col justify-center p-8 gap-4 ${className}`}>
            <h1 className="text-3xl">{documentoContent.titulo}</h1>
            <p>Publicación: {fechaLegible(documentoContent.metadata.fechaPublicacion)}</p>
            
            <img src={`/api/archivos/${documentoContent.portada}`} alt="" />

            {documentoContent.metadata.precio &&
                <p>Precio: {precioLegible(documentoContent.metadata.precio)}</p>
            }
            
            {documentoContent.contenido.map((bloque, index) => (
                <DocumentoBloque bloqueContent={bloque} key={index} />
            ))}
        </div>
    );
}
