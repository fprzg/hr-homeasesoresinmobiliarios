import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dash/login"!</div>
}
