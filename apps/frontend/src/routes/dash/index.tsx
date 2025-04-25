import { createFileRoute, rootRouteId } from '@tanstack/react-router'
import { ContentEditor } from "@/components/content-editor";
import LoginForm from '@/components/login';

export const Route = createFileRoute('/dash/')({
  component: RouteComponent,
})

Route.update({
  //Layout: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <ContentEditor />
    </>
  );
}
