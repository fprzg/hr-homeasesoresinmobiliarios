import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/servicios')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/servicios"!</div>
}
