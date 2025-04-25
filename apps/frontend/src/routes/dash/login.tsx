import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '@/components/login'

export const Route = createFileRoute('/dash/login')({
  component: Login,
})

export function Login() {
  return (
    <>
      <LoginForm />
    </>
  )
}
