import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CheckCircle } from 'lucide-react';

export const Route = createFileRoute('/servicios')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="font-sans bg-gray-50">
      {/* Page Header */}
      <section className="relative bg-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Ofrecemos soluciones inmobiliarias integrales adaptadas a tus necesidades específicas
          </p>
        </div>
      </section>

      {/* Main Service Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Servicio 1: Compra y Venta */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="bg-blue-100 p-2 inline-block rounded-lg mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Compra y Venta de Propiedades</h2>
                <p className="text-gray-600 mb-6">
                  Nuestro equipo de asesores especializados te guiará a través de todo el proceso de compra o venta de tu propiedad, asegurando que obtengas el mejor valor y las mejores condiciones.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Evaluación precisa del valor de mercado de la propiedad</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Estrategia personalizada de marketing para vendedores</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Búsqueda exhaustiva según tus necesidades específicas</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Negociación profesional para conseguir las mejores condiciones</p>
                  </div>
                </div>
{/*
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center">
                  Solicitar asesoría gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
 */}
              </div>
              <div className="md:w-1/2 bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuestro proceso</h3>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="rounded-full bg-blue-600 text-white w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Consulta inicial</h4>
                      <p className="text-gray-600">Evaluamos tus necesidades y objetivos inmobiliarios</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full bg-blue-600 text-white w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Análisis de mercado</h4>
                      <p className="text-gray-600">Realizamos un estudio comparativo del mercado actual</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full bg-blue-600 text-white w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Estrategia personalizada</h4>
                      <p className="text-gray-600">Desarrollamos un plan de acción adaptado a tus necesidades</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full bg-blue-600 text-white w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Cierre exitoso</h4>
                      <p className="text-gray-600">Finalizamos la transacción asegurando tu satisfacción</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Servicio 2: Asesoría Financiera */}
          <div>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 order-1 md:order-2">
                <div className="bg-blue-100 p-2 inline-block rounded-lg mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Asesoría Financiera Inmobiliaria</h2>
                <p className="text-gray-600 mb-6">
                  Te ayudamos a encontrar la mejor opción de financiamiento para la compra de tu propiedad, trabajando con los principales bancos y entidades financieras para obtener las condiciones más favorables.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Análisis de tu capacidad crediticia y opciones disponibles</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Comparativa detallada de productos financieros</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Gestión de trámites con entidades bancarias</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Asesoría sobre deducciones fiscales y beneficios</p>
                  </div>
                </div>
                {/*
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center">
                  Consulta financiera gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                 */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}