import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import Calendar from "./pages/Calendar"; // El componente que carga sus propios datos
import Results from "./pages/Results";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";

// Importar datos para OTRAS secciones (¡Esto está bien!)
import { historyMilestones } from "@/lib/data/data-historia";
import { pastTournaments } from "@/lib/data/data-resultados";
import { courses } from "@/lib/data/data-cursos";

// Ya NO se importa nada de data-calendario

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/historia" element={<History milestones={historyMilestones} />} />
          {/* --- LÍNEA CORREGIDA --- */}
          <Route path="/calendario" element={<Calendar />} /> 
          {/* --- FIN LÍNEA CORREGIDA --- */}
          <Route path="/resultados" element={<Results tournaments={pastTournaments} />} />
          <Route path="/cursos" element={<Courses courses={courses} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;