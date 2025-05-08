import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert('¡Gracias por contactarnos! Te responderemos pronto.');
    setEmail('');
  };

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

      <HexagonGrid />


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

// Componente para una sola imagen hexagonal
const HexagonImage = ({
  fadeTime = 5000,
  interval = 7000,
  delay = 0, // Retraso para escalonar las transiciones
  size = 'md'
}) => {
  const [imageUrl, setImageUrl] = useState('/api/placeholder/400/400');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mapeo de tamaños
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const fetchRandomImage = async () => {
    try {
      // En un entorno real, esto obtendría una imagen de /api/archivos/random
      const timestamp = new Date().getTime();
      const sizes = [300, 400, 500];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      //return `/api/placeholder/${randomSize}/${randomSize}?t=${timestamp}`;
      return `/api/archivos/random`;
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
      //return '/api/placeholder/400/400';
    }
  };

  const changeImage = async () => {
    setIsFading(true);

    setTimeout(async () => {
      setIsLoading(true);
      const newImageUrl = await fetchRandomImage();
      setImageUrl(newImageUrl);
      setIsFading(false);
    }, fadeTime);
  };

  useEffect(() => {
    // Retrasar la carga inicial según el parámetro delay
    const initialLoadTimeout = setTimeout(() => {
      fetchRandomImage().then(url => {
        setImageUrl(url);
        setIsLoading(false);
      });
    }, delay);

    // Configurar el intervalo para cambiar la imagen
    const imageInterval = setInterval(() => {
      changeImage();
    }, interval + delay); // Añadir delay al intervalo para escalonar las transiciones

    return () => {
      clearTimeout(initialLoadTimeout);
      clearInterval(imageInterval);
    };
  }, [interval, fadeTime, delay]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} relative overflow-hidden`}>
        <div
          className={`
            absolute inset-0 
            ${isFading ? 'opacity-0' : 'opacity-100'} 
            transition-opacity ease-in-out duration-1000
            bg-gray-100
          `}
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          <img
            // src={imageUrl}
            src="/api/archivos/random"
            alt="Imagen hexagonal"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
          />
        </div>
      </div>

      <div
        className={`${sizeClasses[size]} absolute top-0 left-0 border-2 border-gray-300 pointer-events-none`}
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        }}
      ></div>
    </div>
  );
};

// Componente principal que crea la cuadrícula de hexágonos
export default function HexagonGrid({
  fadeTime = 5000,
  interval = 7000,
}) {
  fadeTime += Math.random() * 4;
  // Determinar si es móvil o escritorio
  const [isMobile, setIsMobile] = useState(false);

  // Configuración de la cuadrícula
  const gridConfig = isMobile
    ? { rows: 3, cols: 5 } // 5x3 en móvil
    : { rows: 4, cols: 8 }; // 8x4 en escritorio

  useEffect(() => {
    // Función para detectar si es móvil basado en el ancho de la pantalla
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px es el breakpoint común para tablets/móviles
    };

    // Comprobar al cargar y al redimensionar
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Crear la cuadrícula
  const renderGrid = () => {
    const grid = [];
    const { rows, cols } = gridConfig;
    let index = 0;

    for (let row = 0; row < rows; row++) {
      const rowItems = [];
      const isOddRow = row % 2 !== 0;
      const actualCols = isOddRow ? cols - 1 : cols; // Una columna menos en filas impares para alinear

      for (let col = 0; col < actualCols; col++) {
        // Calcular un retraso único para cada hexágono para efecto escalonado
        const delay = (row * cols + col) * 400; // 400ms de retraso entre hexágonos

        rowItems.push(
          <div
            key={`hex-${row}-${col}`}
            className={`inline-block ${isOddRow ? 'ml-6' : ''}`}
          >
            <HexagonImage
              fadeTime={fadeTime}
              interval={interval}
              delay={delay}
              size={isMobile ? 'sm' : 'md'}
            />
          </div>
        );
        index++;
      }

      grid.push(
        <div key={`row-${row}`} className={`flex ${isOddRow ? '-ml-6' : ''} -mt-4 first:mt-0`}>
          {rowItems}
        </div>
      );
    }

    return grid;
  };

  return (
    <div className="p-4">
      <div className="mx-auto max-w-full overflow-hidden">
        {renderGrid()}
      </div>
    </div>
  );
}