import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/equipo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/equipo"!</div>
}
