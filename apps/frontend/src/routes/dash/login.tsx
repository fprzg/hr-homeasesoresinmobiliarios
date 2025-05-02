import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '@/components/login'

export const Route = createFileRoute('/dash/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <LoginForm to="/dash" />
  )
}
