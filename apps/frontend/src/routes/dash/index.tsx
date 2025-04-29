import { createFileRoute } from '@tanstack/react-router'
import { ContentEditor } from "@/components/inmueble-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from 'react';
import { Inmueble } from '@shared/zodSchemas/inmueble';
import { client } from '@/api';

export const Route = createFileRoute('/dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInmuebles() {
      setLoading(true);
      setError(null);
      try {
        const res = await client.api.inmuebles.$get({ query: { page: "1", limit: "10" } });
        const data = await res.json();
        setInmuebles(data?.data || []);
      } catch (err: any) {
        setError('Hubo un error al cargar los inmuebles.');
        console.error("Error fetching inmuebles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInmuebles();
  }, []);

  return (
    <>

      <div className="container mx-auto p-4">
        <Tabs defaultValue="tab-editor" className="w-full mx-auto gap-6">
          {/* <TabsList className="grid grid-cols-4 mx-auto"> */}
          <TabsList className="grid grid-cols-2 mx-auto">
            <TabsTrigger value="tab-editor">Nuevo</TabsTrigger>
            <TabsTrigger value="tab-pages">Páginas</TabsTrigger>
          </TabsList>

          <TabsContent value="tab-editor">
            <ContentEditor />
          </TabsContent>

          <TabsContent value="tab-pages">
            <div className="pb-4">
              <h1 className='text-3xl'>Páginas</h1>
            </div>

            <div>
              {inmuebles.map((elem, idx) => (
                <div key={elem.id}>
                  <span className="text-xl font-semibold px-2"><a href={`/inmuebles/${elem.id}`}>{elem.titulo}</a></span>
                  <button className="rounded bg-red-600 text-white" onClick={() => {
                     const handleEliminar = async () => {
                      try {
                        const response = await fetch(`/api/inmuebles/${elem.id}`, {
                          method: 'DELETE',
                        });
                      } catch (error) {
                        //console.error('Error al eliminar:', error);
                      }

                      alert('Inmueble eliminado');
                    };

                    handleEliminar();
                  }}>
                    <span className='p-1.5'>Eliminar</span>
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </div>

    </>
  );
}
