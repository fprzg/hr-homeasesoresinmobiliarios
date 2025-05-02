import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  navigate({ to: '/dash/docs/listar' });
}
