
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlayCircle, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GamePage() {
  const { profile } = useAuth();
  const esSocio = profile?.roles?.socio === true;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block text-sm font-medium text-france mb-2">
              ENTRENAMIENTO TÁCTICO
            </span>
            <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Trebejos Game
            </h1>
            <p className="font-rubik text-lg text-gray-600">
              Mejora tus habilidades tácticas con ejercicios interactivos diseñados para todos los niveles.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <h2 className="font-lora text-2xl font-semibold text-center text-gray-800">
                Zona de Entrenamiento
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Button 
                  size="lg"
                  className="w-full max-w-md"
                  onClick={() => alert("Accederías como Jugador a Trebejos Game. ¡Integración con game.clubtrebejos.com pendiente!")}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Unirse a Sesión (Resolver Tácticas)
                </Button>

                {esSocio && (
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full max-w-md"
                    onClick={() => alert("Accederías como Administrador del Juego (Socio). ¡Integración con game.clubtrebejos.com pendiente!")}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Crear/Administrar Sesión (Socios)
                  </Button>
                )}

                {!esSocio && (
                  <div className="text-center mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700">
                      ¿Quieres crear y dirigir tus propias sesiones de táctica?{" "}
                      <Link to="/info-socios" className="text-france hover:underline font-medium">
                        Hazte socio del Club Trebejos
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
