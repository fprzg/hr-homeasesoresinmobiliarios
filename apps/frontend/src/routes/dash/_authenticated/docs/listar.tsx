import { createFileRoute, Link, Navigate, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/dash/_authenticated/docs/listar')({
  component: ComponentLayout,
});

function ComponentLayout() {
  return (
    <div className="">documentos perrones</div>
  );
}
