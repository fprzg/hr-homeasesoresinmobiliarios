import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { type InmuebleType } from '@shared/zod';
import { fechaLegible, precioLegible } from '@/lib/legible';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/inmuebles/$id')({
  component: InmuebleById,
});

function InmuebleById() {
  const { id } = Route.useParams();

  const [inmuebleData, setInmuebleData] = useState<InmuebleType>();

  const getDocumentoById = async () => {
    const res = await api.inmuebles[":id"].$get({ param: { id } });
    if (!res.ok) {
      throw new Error('server error');
    }
    const data = await res.json();
    return data;
  }

  const { isPending: loading, error, data } = useQuery({
    queryKey: ['get-documento-by-id', id],
    queryFn: getDocumentoById,
  });

  const inmueble = data?.inmueble ?? {};

  if (loading) return <div>Cargando inmueble...</div>;
  if (error) return <div>{error?.message}</div>;
  if (!inmueble) return (
    <>
      <h3 className="text-xl">El inmueble no existe</h3>
      <p>No se encontró el inmueble. Puede que la url esté malformada o que el inmueble haya sido dado de baja.</p>
    </>
  );

  return (
    <>
      <section className="relative py-20 lg:py-60 text-white">
        {/* Fondo con imagen */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(/api/archivos/${inmueble.portada})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        {/* Overlay con tinte de color primario */}
        {/* <div className="absolute inset-0 bg-primary opacity-70"></div> */}
        <div className="absolute inset-0 bg-primary opacity-20"></div>

        <div className="container mx-auto px-6 relative z-10">

          <div className="md:w-2/3">

            <h1 className="text-3xl md:text-5xl font-semibold mb-6">{inmueble.titulo}</h1>
            <p className="text-3xl mb-8">{precioLegible(inmueble.precio)}</p>
          </div>
        </div>
      </section>

      <div className='mx-auto w-[80%] md:w-[80%] lg:w-[65%] xl:w-[50%] py-12'>
        <div className={`text-center flex flex-col gap-8 `}>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl lg:text-2xl">{inmueble.asentamiento.calleColonia}</h1>
            <h1 className="text-xl lg:text-2xl">{inmueble.asentamiento.codigoPostal}, {inmueble.asentamiento.municipio}</h1>
            <h1 className="text-xl lg:text-2xl">{inmueble.asentamiento.estado}</h1>
          </div>

          <p className="text-xl">{inmueble.descripcion}</p>

          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Descripcion</th>
                <th className="border px-4 py-2 text-left">N. de áreas</th>
              </tr>
            </thead>
            <tbody>
              {inmueble.tipo === "casa" ?
                <>
                  <tr className="bg-white">
                    <td className="border px-4 py-2 font-medium">Área construida</td>
                    <td className="border px-4 py-2">{inmueble.areaConstruida} m²</td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border px-4 py-2 font-medium">N. de áreas</td>
                    <td className="border px-4 py-2">{inmueble.totalAreas}</td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border px-4 py-2 font-medium">N. de pisos</td>
                    <td className="border px-4 py-2">{inmueble.numPisos}</td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border px-4 py-2 font-medium">N. de recámaras</td>
                    <td className="border px-4 py-2">{inmueble.numRecamaras}</td>
                  </tr>


                  <tr className="bg-white">
                    <td className="border px-4 py-2 font-medium">N. de baños</td>
                    <td className="border px-4 py-2">{inmueble.numBanos}</td>
                  </tr>

                  {inmueble.numCocheras > 1 ?
                    <tr className="bg-white">
                      <td className="border px-4 py-2 font-medium">N. de cocheras</td>
                      <td className="border px-4 py-2">{inmueble.numCocheras}</td>
                    </tr>
                    :
                    <tr className="bg-white">
                      <td className="border px-4 py-2 font-medium">Cochera</td>
                      <td className="border px-4 py-2">{inmueble.numCocheras === 1 ? "Si" : "No"}</td>
                    </tr>
                  }
                </>
                :
                <>
                  <tr className="bg-white">
                    <td className="border px-4 py-2 font-medium">Metros de frente</td>
                    <td className="border px-4 py-2">{inmueble.metrosFrente} m²</td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border px-4 py-2 font-medium">Metros de fondo</td>
                    <td className="border px-4 py-2">{inmueble.metrosFondo} m²</td>
                  </tr>

                  <tr className="bg-white">
                    <td className="border px-4 py-2 font-medium">Tipo de propiedad</td>
                    <td className="border px-4 py-2">{inmueble.tipoPropiedad}</td>
                  </tr>
                </>
              }
            </tbody>
          </table>

          {inmueble.contenido.map((bloque: any) => (
            <div className="grid grid-rows-1 justify-center pb-4">
              <img src={`/api/archivos/${bloque.imagenId}`} alt="" />
              <p className="text-xl">{bloque.descripcion}</p>
            </div>
          ))}

          <p className="text-md">Publicado {fechaLegible(inmueble.fechaActualizacion)}</p>
        </div>
      </div >
    </>
  );
}
