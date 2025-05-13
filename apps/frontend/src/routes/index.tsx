import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: Index,
})


type ImagenCarrusel = { imagen: string, target: string };

async function getCarruselImagenes() {
  const res = await fetch("/api/archivos/carrusel");
  if (!res.ok) {
    throw new Error("no se pudieron recuperarse las imagenes del carrusel.")
  }

  const data = await res.json();
  if (!data.ok) {
    throw new Error("no se pudieron recuperarse las imagenes del carrusel.")
  }

  return data;
}

function Index() {
  /*
  const [email, setEmail] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert('¡Gracias por contactarnos! Te responderemos pronto.');
    setEmail('');
  };
  */

  const { isPending, error, data } = useQuery({
    queryKey: ["get-carrusel-imagenes"],
    queryFn: getCarruselImagenes,
  });

  const [imagenesData, setImagenesData] = useState<ImagenCarrusel[]>([]);
  useEffect(() => {
    if (!isPending && data?.imagenes) {
      setImagenesData(data.imagenes);
    }
  }, [isPending, data])

  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-blue-700 text-white py-24">
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tu hogar ideal está a un paso de distancia
            </h1>
            <p className="text-xl mb-8">
              Somos un equipo de asesores inmobiliarios profesionales dedicados a encontrar la propiedad perfecta para ti y tu familia.
            </p>
            {/*
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition flex items-center justify-center">
                Ver propiedades <ChevronRight className="ml-2" size={16} />
              </button>
              <button className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-700 transition flex items-center justify-center">
                Consulta gratuita
              </button>
            </div>

*/}
          </div>
        </div>
      </section>

      {imagenesData.length > 0 ? <HexagonGrid imagenesData={imagenesData} /> : <></>}


      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos un servicio integral para todas tus necesidades inmobiliarias
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="p-2 bg-blue-100 rounded-lg inline-block mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Compra y Venta</h3>
              <p className="text-gray-600">
                Te asesoramos en todo el proceso de compra o venta de propiedades, garantizando las mejores condiciones del mercado.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="p-2 bg-blue-100 rounded-lg inline-block mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Gestión Legal</h3>
              <p className="text-gray-600">
                Nos encargamos de toda la documentación y trámites legales necesarios para una transacción segura y sin complicaciones.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="p-2 bg-blue-100 rounded-lg inline-block mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Asesoría Financiera</h3>
              <p className="text-gray-600">
                Te ayudamos a conseguir el mejor financiamiento para tu propiedad, trabajando con los principales bancos y entidades financieras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">¿Listo para encontrar tu propiedad ideal?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Agenda una consulta gratuita con uno de nuestros asesores inmobiliarios y da el primer paso hacia tu nuevo hogar.
          </p>
          {/*
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="px-4 py-3 rounded-md flex-grow text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Contactar ahora
            </button>
          </form>
          */}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Historias de éxito de quienes confiaron en nosotros para encontrar su hogar ideal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex text-yellow-400 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-gray-600 mb-6">
                "El equipo de HomeAsesores hizo que todo el proceso de compra fuera increíblemente sencillo. Su conocimiento del mercado y dedicación fueron clave para encontrar nuestra casa ideal."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  MC
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">María Castillo</h4>
                  <p className="text-gray-500 text-sm">Propietaria desde 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex text-yellow-400 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-gray-600 mb-6">
                "Vendimos nuestra propiedad en tiempo récord y a un precio excelente gracias a la estrategia de marketing personalizada que desarrollaron para nosotros. ¡Totalmente recomendados!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  JR
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Javier Rodríguez</h4>
                  <p className="text-gray-500 text-sm">Vendió su propiedad en 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex text-yellow-400 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-gray-600 mb-6">
                "Su asesoría financiera fue fundamental para conseguir un crédito hipotecario con excelentes condiciones. Además, su atención personalizada hizo toda la diferencia."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  LM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Laura Méndez</h4>
                  <p className="text-gray-500 text-sm">Compró su primera casa en 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">300+</p>
              <p className="text-gray-600">Propiedades vendidas</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">95%</p>
              <p className="text-gray-600">Clientes satisfechos</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">15+</p>
              <p className="text-gray-600">Años de experiencia</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">50+</p>
              <p className="text-gray-600">Asesores expertos</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function HexagonGrid({ imagenesData }: { imagenesData: ImagenCarrusel[] }) {
  const navigate = useNavigate();

  /*
  const [currentImages, setCurrentImages] = useState(imagenesData);
  const intervalTime = 5000; // Cambia las imágenes cada 5 segundos (ajusta según necesites)

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Lógica para obtener nuevas imágenes (reemplaza con tu API)
      const shuffledImages = [...imagenesData].sort(() => Math.random() - 0.5);
      setCurrentImages(shuffledImages);
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [imagenesData]);
  */

  const getImagenesCarrusel = (start: number, size: number) => {
    const data: { imagen: string, target: string }[] = [];

    for (let i = 0; i < size; ++i) {
      const current = imagenesData[(start + i) % imagenesData.length];
      data.push(current);
    }

    return data;
  };

  const handleHexagonClick = (target: string) => {
    navigate({ to: `/inmuebles/${target}` });
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
                backgroundImage: `url("/api/archivos/${item.imagen}")`,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
              }}
            // onClick={() => handleHexagonClick(item.target)}
            ></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='py-15'>
      <DrawRow data={getImagenesCarrusel(0, 5)} className='mb-[20px]' />
      <DrawRow data={getImagenesCarrusel(9, 14)} className='' />
    </div>
  );
};

export default HexagonGrid;