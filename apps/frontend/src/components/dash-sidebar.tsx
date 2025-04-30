import { Link, useMatchRoute } from '@tanstack/react-router';

export default function Sidebar() {
  const matchRoute = useMatchRoute();
  
  const isActive = (to: string) => {
    return matchRoute({ to, fuzzy: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Dashboard</h1>
      </div>
      
      <nav className="sidebar-nav">
        <h3>Documentos</h3>
        <ul>
          <li>
            <Link 
            to="/dash/docs/listar" 
              className={isActive('/dash/documentos/listar') ? 'active' : ''}
            >
              Todos
            </Link>
          </li>
          <li>
            <Link 
              to="/dash/docs/nuevo" 
              className={isActive('/dash/documentos/nuevo') ? 'active' : ''}
            >
              Nuevo
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}