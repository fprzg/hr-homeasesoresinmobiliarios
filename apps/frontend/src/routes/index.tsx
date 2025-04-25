import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { Star, MapPin, Phone, Mail, ArrowRight, ChevronRight } from 'lucide-react';

import { Link } from '@tanstack/react-router'

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
              Tu hogar ideal está a solo un paso de distancia
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HomeAsesores</h3>
              <p className="text-gray-400">
                Expertos inmobiliarios comprometidos con hacer realidad tus sueños de vivienda.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Inicio</Link></li>
                <li><Link to="/inmuebles" className="text-gray-400 hover:text-white transition">Propiedades</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Servicios</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Sobre nosotros</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-400">Av. Principal 123, Ciudad</span>
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-400">+123 456 7890</span>
                </li>
                <li className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-400">info@propexperts.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2025 HomeAsesores. Todos los derechos reservados.</p>
            {/*
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2H1l8.26 11.015L1.45 22H4.1l6.388-7.349L16 22h7l-8.608-11.478L21.8 2h-2.65l-5.986 6.886L8 2zm9 18L5 4h2l12 16h-2z"></path>
                </svg>
              </a>
            </div>
            */}
          </div>
        </div>
      </footer>
    </div>
  );
}