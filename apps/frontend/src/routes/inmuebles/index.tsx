import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type InmuebleType } from '@shared/zod';
import { InmueblesApi } from '@/api';
import { useState, useEffect } from 'react';
import { precioLegible, fechaLegible } from '@/lib/legible';
import { ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/inmuebles/')({
  component: AllInmuebles,
});

export const InmueblePreview = ({ documentoContent, keyName, className }: { documentoContent: InmuebleType, keyName?: any, className?: string }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to: `/inmuebles/${documentoContent.id}` })
    };

    return (
        <div key={keyName} className={`text-center flex flex-col justify-center p-2 gap-4 shadow-md ${className}`}>
            {/* <h1 className="text-lg">{documentoContent.asentamiento}</h1> */}
            <p>Publicación: {fechaLegible(documentoContent.fechaActualizacion)}</p>
            {documentoContent.precio &&
                <p>Precio: {precioLegible(documentoContent.precio)}</p>
            }
            <img src={`/api/archivos/${documentoContent.portada}`} alt="" />
            <button onClick={handleClick} className="w-30 mx-auto bg-blue-600">
                <span>Ver más</span>
                <ArrowRight />
            </button>
        </div>
    );
}

function AllInmuebles() {
  //const { isPending, error, data } = InmueblesApi.listar();

  //if (isPending) return <div>Cargando inmuebles...</div>;
  //if (error) return <div>{error.message}</div>;

  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    tipo: "",
    precioMin: "",
    precioMax: "",
    areaMin: "",
    areaMax: "",
    estado: "",
    // Filtros específicos para casas
    areaConstruidaMin: "",
    numBanos: "",
    numRecamaras: "",
    numPisos: "",
    numCocheras: "",
    piscina: false,
    // Filtros específicos para terrenos
    metrosFrenteMin: "",
    metrosFondoMin: "",
    tipoPropiedad: "",
  });

  // Estado para los inmuebles
  const [inmuebles, setInmuebles] = useState<InmuebleType[]>([]);
  const [inmueblesOriginales, setInmueblesOriginales] = useState<InmuebleType[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  // Cargar los inmuebles al montar el componente
  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/inmuebles');
        if (!response.ok) {
          throw new Error('No se pudieron cargar los inmuebles');
        }
        const data = await response.json();
        console.log(data);

        const inmueblesData = data.inmuebles as InmuebleType[];

        setInmuebles(inmueblesData);
        setInmueblesOriginales(inmueblesData);

        // Extraer estados únicos para el filtro
        const estadosUnicos = [...new Set(inmueblesData.map(i => i.asentamiento.estado))].sort();
        setEstados(estadosUnicos);
      } catch (err) {
        //setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInmuebles();
  }, []);

  // Manejar cambios en los filtros
  const handleFiltroChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFiltros({
      ...filtros,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Aplicar filtros
  const aplicarFiltros = () => {
    let resultado = [...inmueblesOriginales];

    // Filtrar por tipo
    if (filtros.tipo) {
      resultado = resultado.filter(inmueble => inmueble.tipo === filtros.tipo);
    }

    // Filtrar por rango de precio
    if (filtros.precioMin) {
      resultado = resultado.filter(inmueble => inmueble.precio >= parseInt(filtros.precioMin));
    }
    if (filtros.precioMax) {
      resultado = resultado.filter(inmueble => inmueble.precio <= parseInt(filtros.precioMax));
    }

    // Filtrar por rango de área total
    if (filtros.areaMin) {
      resultado = resultado.filter(inmueble => inmueble.areaTotal >= parseInt(filtros.areaMin));
    }
    if (filtros.areaMax) {
      resultado = resultado.filter(inmueble => inmueble.areaTotal <= parseInt(filtros.areaMax));
    }

    // Filtrar por estado
    if (filtros.estado) {
      resultado = resultado.filter(inmueble => inmueble.asentamiento.estado === filtros.estado);
    }

    // Filtros específicos para casas
    if (filtros.tipo === "casa") {
      if (filtros.areaConstruidaMin) {
        resultado = resultado.filter(inmueble =>
          inmueble.tipo === "casa" && inmueble.areaConstruida >= parseInt(filtros.areaConstruidaMin)
        );
      }
      if (filtros.numBanos) {
        resultado = resultado.filter(inmueble =>
          inmueble.tipo === "casa" && inmueble.numBanos >= parseInt(filtros.numBanos)
        );
      }
      if (filtros.numRecamaras) {
        resultado = resultado.filter(inmueble =>
          inmueble.tipo === "casa" && inmueble.numRecamaras >= parseInt(filtros.numRecamaras)
        );
      }
      if (filtros.numPisos) {
        resultado = resultado.filter(inmueble =>
          inmueble.tipo === "casa" && inmueble.numPisos >= parseInt(filtros.numPisos)
        );
      }
      if (filtros.numCocheras) {
        resultado = resultado.filter(inmueble =>
          inmueble.tipo === "casa" && inmueble.numCocheras >= parseInt(filtros.numCocheras)
        );
      }
      if (filtros.piscina) {
        resultado = resultado.filter(inmueble =>
          inmueble.tipo === "casa" && inmueble.piscina === true
        );
      }
    }

    // Filtros específicos para terrenos
    if (filtros.tipo === "terreno") {
      if (filtros.metrosFrenteMin) {
        resultado = resultado.filter(inmueble =>
          inmueble.tipo === "terreno" && inmueble.metrosFrente >= parseInt(filtros.metrosFrenteMin)
        );
      }
      if (filtros.metrosFondoMin) {
        resultado = resultado.filter(inmueble =>
          inmueble.tipo === "terreno" && inmueble.metrosFondo >= parseInt(filtros.metrosFondoMin)
        );
      }
      if (filtros.tipoPropiedad) {
        resultado = resultado.filter(inmueble =>
          inmueble.tipo === "terreno" && inmueble.tipoPropiedad === filtros.tipoPropiedad
        );
      }
    }

    setInmuebles(resultado);
  };

  // Resetear filtros
  const resetearFiltros = () => {
    setFiltros({
      tipo: "",
      precioMin: "",
      precioMax: "",
      areaMin: "",
      areaMax: "",
      estado: "",
      areaConstruidaMin: "",
      numBanos: "",
      numRecamaras: "",
      numPisos: "",
      numCocheras: "",
      piscina: false,
      metrosFrenteMin: "",
      metrosFondoMin: "",
      tipoPropiedad: "",
    });
    setInmuebles(inmueblesOriginales);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Buscador de Inmuebles</h1>

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de inmueble</label>
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Todos</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Todos</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          {/* Rango de precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MXN)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="precioMin"
                placeholder="Mínimo"
                value={filtros.precioMin}
                onChange={handleFiltroChange}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                name="precioMax"
                placeholder="Máximo"
                value={filtros.precioMax}
                onChange={handleFiltroChange}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Rango de área total */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área total (m²)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="areaMin"
                placeholder="Mínimo"
                value={filtros.areaMin}
                onChange={handleFiltroChange}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                name="areaMax"
                placeholder="Máximo"
                value={filtros.areaMax}
                onChange={handleFiltroChange}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Filtros específicos para casas */}
        {filtros.tipo === "casa" && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-3">Características de la casa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área construida mínima (m²)
                </label>
                <input
                  type="number"
                  name="areaConstruidaMin"
                  value={filtros.areaConstruidaMin}
                  onChange={handleFiltroChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baños (mínimo)
                </label>
                <input
                  type="number"
                  name="numBanos"
                  value={filtros.numBanos}
                  onChange={handleFiltroChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recámaras (mínimo)
                </label>
                <input
                  type="number"
                  name="numRecamaras"
                  value={filtros.numRecamaras}
                  onChange={handleFiltroChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pisos (mínimo)
                </label>
                <input
                  type="number"
                  name="numPisos"
                  value={filtros.numPisos}
                  onChange={handleFiltroChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cocheras (mínimo)
                </label>
                <input
                  type="number"
                  name="numCocheras"
                  value={filtros.numCocheras}
                  onChange={handleFiltroChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="piscina"
                  id="piscina"
                  checked={filtros.piscina}
                  onChange={handleFiltroChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="piscina" className="ml-2 block text-sm text-gray-700">
                  Con piscina
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Filtros específicos para terrenos */}
        {filtros.tipo === "terreno" && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-3">Características del terreno</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metros de frente (mínimo)
                </label>
                <input
                  type="number"
                  name="metrosFrenteMin"
                  value={filtros.metrosFrenteMin}
                  onChange={handleFiltroChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metros de fondo (mínimo)
                </label>
                <input
                  type="number"
                  name="metrosFondoMin"
                  value={filtros.metrosFondoMin}
                  onChange={handleFiltroChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de propiedad
                </label>
                <select
                  name="tipoPropiedad"
                  value={filtros.tipoPropiedad}
                  onChange={handleFiltroChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Todos</option>
                  <option value="privada">Privada</option>
                  <option value="comunal">Comunal</option>
                  <option value="ejidal">Ejidal</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={resetearFiltros}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Resetear
          </button>
          <button
            onClick={aplicarFiltros}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Resultados ({inmuebles.length})</h2>

        {inmuebles.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No se encontraron inmuebles con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inmuebles.map((inmueble) => (
              <div key={inmueble.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={`/api/archivos/${inmueble.portada}`}
                    alt={`Inmueble en ${inmueble.asentamiento}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      //e.target.onerror = null;
                      //e.target.src = "https://via.placeholder.com/300x200?text=Sin+imagen";
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded">
                    {inmueble.tipo === "casa" ? "Casa" : "Terreno"}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      {precioLegible(inmueble.precio)}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {inmueble.areaTotal} m²
                    </span>
                  </div>

                  <p className="text-gray-700 mb-2">
                    , {inmueble.asentamiento.estado}
                  </p>

                  {inmueble.tipo === "casa" && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                        {inmueble.numRecamaras} Rec.
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                        {inmueble.numBanos} Baños
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                        {inmueble.areaConstruida} m² const.
                      </span>
                      {inmueble.piscina && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          Piscina
                        </span>
                      )}
                    </div>
                  )}

                  {inmueble.tipo === "terreno" && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                        {inmueble.metrosFrente}m frente
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                        {inmueble.metrosFondo}m fondo
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded capitalize">
                        {inmueble.tipoPropiedad}
                      </span>
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={()=> navigate({to: `/inmuebles/${inmueble.id}`})}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
