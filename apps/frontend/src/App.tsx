import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContentEditor } from "@/components/content-editor";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <ContentEditor />
      </div>
    </QueryClientProvider>
  );
}

export default App;