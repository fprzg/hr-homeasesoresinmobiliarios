import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/logout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dash/logout"!</div>
}
