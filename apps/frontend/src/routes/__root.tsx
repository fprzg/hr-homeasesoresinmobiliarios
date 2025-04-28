import { useLocation, createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dash');
  return (
    <>
      {!isDashboardRoute && (
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-blue-600 font-bold text-2xl">HomeAsesores</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="[&.active]:font-bold text-gray-800 hover:text-blue-600 transition">Inicio</Link>
              <Link to="/inmuebles" className="[&.active]:font-bold text-gray-800 hover:text-blue-600 transition">Inmuebles</Link>
              <Link to="/servicios" className="[&.active]:font-bold text-gray-800 hover:text-blue-600 transition">Servicios</Link>
              <Link to="/equipo" className="[&.active]:font-bold text-gray-800 hover:text-blue-600 transition">Equipo</Link>
            </div>
            <div>
              {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Contactar</button> */}
            </div>
          </div>
        </nav>
      )}

      <Outlet />
    </>
  );
}