import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArchivosApi } from "@/api";

type ImagenCarrusel = { imagen: string, target: string };


export function HexagonGrid({
    fetchImagenes,
    className,
}: {
    fetchImagenes: () => UseQueryResult,
    className?: string,
}) {
    const {isPending, error, data} = fetchImagenes();

    const [imagenes, setImagenes] = useState<{imagen: string, target: string}[]>(data?.imagenes ?? []);
    useEffect(() => {
        if(!isPending && data?.imagenes) {
            setImagenes(data?.imagenes);
        }
    }, [isPending, data]);

    const getImagenesCarrusel = (start: number, size: number) => {
        const data: { imagen: string, target: string }[] = [];

        for (let i = 0; i < size; ++i) {
            const current = imagenes[(start + i) % imagenes.length];
            data.push(current);
        }

        return data;
    };

    const DrawRow = ({ data, className }: { data: { imagen: string, target: string }[], className?: string }) => {
        return (
            <div className={`flex flex-row justify-center ${className}`}>
                {data.slice(0, 5).map((item, index) => (
                    <div key={`row1-${index}`} className={`relative aspect-square w-32 md:w-40 mx-[10px]`}>
                        <div
                            // className="absolute inset-0 bg-cover bg-center cursor-pointer w-[160px] h-[160px]"
                            className="absolute inset-0 bg-cover bg-center cursor-pointer w-[160px] h-[160px]"
                            style={{
                                backgroundImage: `url(${ArchivosApi.getImagenUrl(item.imagen)})`,
                                clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
                            }}
                        // onClick={() => handleHexagonClick(item.target)}
                        ></div>
                    </div>
                ))}
            </div>
        );
    };

    if (imagenes.length === 0) return <></>;

    return (
        <div className={`py-15 ${className}`}>
            <DrawRow data={getImagenesCarrusel(0, 5)} className='mb-[20px]' />
            <DrawRow data={getImagenesCarrusel(9, 14)} className='' />
        </div>
    );
};