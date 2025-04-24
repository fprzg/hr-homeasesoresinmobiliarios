import { createFileRoute } from '@tanstack/react-router'
import { ContentEditor } from "@/components/content-editor";

export const Route = createFileRoute('/dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <ContentEditor />
    </>
  );
}
