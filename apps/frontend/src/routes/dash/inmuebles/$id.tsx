import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/inmuebles/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <>
      <div>Hello "/dash/$id"!</div>
      <div>Inmueble: {id}</div>
    </>
  );
}
