import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import './dash.css'

export const Route = createFileRoute('/dash/ _authenticated/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  navigate({ to: '/dash/docs/listar'});
}
