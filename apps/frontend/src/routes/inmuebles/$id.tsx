import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { type InmuebleType } from '@shared/zod';
import { fechaLegible, precioLegible } from '@/lib/legible';

export const Route = createFileRoute('/inmuebles/$id')({
  component: InmuebleById,
});

function InmuebleById() {
  const { id } = Route.useParams();
  const [inmueble, setInmueble] = useState<InmuebleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInmueble() {
      try {
        //const res = await client.api.documentos.$get({ param: { id } });
        const res = await fetch(`/api/inmuebles/${id}`)
        const data = await res.json();
        console.log(data);
        setInmueble(data.inmueble);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el inmueble.");
      } finally {
        setLoading(false);
      }
    }

    fetchInmueble();
  }, [id]);

  if (loading) return <div>Cargando inmueble...</div>;
  if (error) return <div>{error}</div>;
  if (!inmueble) return <div>No se encontró el inmueble.</div>;

  return (
    <div className='mx-auto w-[80%] md:w-[80%] lg:w-[65%] xl:w-[50%] gap-4'>
      <div className={`text-center flex flex-col justify-center p-8 gap-4 `}>
        {/* <h1 className="text-3xl">{inmueble.asentamiento}</h1> */}
        <p className="text-lg">Publicación: {fechaLegible(inmueble.fechaActualizacion)}</p>
        <p className="text-lg">Precio: {precioLegible(inmueble.precio)}</p>

        <img src={`/api/archivos/${inmueble.portada}`} alt="" />

        <p className="text-lg">Area total: {inmueble.areaTotal}</p>

        {inmueble.tipo === "casa" ?
          (
            <>
              <h3 className="text-xl">{inmueble.totalAreas} áreas</h3>
              <p className="text-lg">Área construida: {inmueble.areaConstruida}</p>
              <p className="text-lg">{inmueble.numBanos} baños</p>
              <p className="text-lg">{inmueble.numRecamaras} recámaras</p>
              <p className="text-lg">{inmueble.numPisos} pisos</p>
              <p className="text-lg">{inmueble.numCocheras} cocheras</p>
              {inmueble.piscina && <p className="text-lg">Piscina</p>}
            </>
          ) : (
            <>
              <p className="text-lg">Metros de frente: {inmueble.metrosFrente}m</p>
              <p className="text-lg">Metros de fondo: {inmueble.metrosFondo}m</p>
              <p className="text-lg">Propiedad {inmueble.tipoPropiedad}</p>
            </>
          )}


        <div className="">
          {inmueble.contenido.map((bloque) => (
            <div className="grid grid-rows-1 justify-center p-4 gap-4">
              <img src={`/api/archivos/${bloque.imagen}`} alt="" />
              <p className="text-xl">{bloque.descripcion}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
