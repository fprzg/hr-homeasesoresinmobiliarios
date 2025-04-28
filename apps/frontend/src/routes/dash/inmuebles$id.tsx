import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/inmuebles$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dash/$id"!</div>
}
