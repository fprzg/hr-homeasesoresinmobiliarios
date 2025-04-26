import { createFileRoute } from '@tanstack/react-router'
import { ContentEditor } from "@/components/content-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute('/dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>

      <div className="container mx-auto p-4">
          <Tabs defaultValue="tab-editor" className="w-full mx-auto gap-6">
            <TabsList className="grid grid-cols-4 mx-auto">
              <TabsTrigger value="tab-editor">Nuevo</TabsTrigger>
              <TabsTrigger value="section2">Section 2</TabsTrigger>
              <TabsTrigger value="section3">Section 3</TabsTrigger>
              <TabsTrigger value="section4">Section 4</TabsTrigger>
            </TabsList>

            <TabsContent value="tab-editor">
              <ContentEditor />
            </TabsContent>

          </Tabs>
      </div>

    </>
  );
}
