
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const { profile } = useAuth();
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  
  // Tactics form state
  const [fen, setFen] = useState("");
  const [solution, setSolution] = useState("");
  const [turn, setTurn] = useState("w");
  const [theme, setTheme] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const [sourcePgn, setSourcePgn] = useState("");
  const [event, setEvent] = useState("");
  const [whitePlayer, setWhitePlayer] = useState("");
  const [blackPlayer, setBlackPlayer] = useState("");
  const [whiteElo, setWhiteElo] = useState("");
  const [blackElo, setBlackElo] = useState("");

  const searchUser = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', searchEmail)
      .single();

    if (error) {
      toast.error("Usuario no encontrado");
      return;
    }
    setFoundUser(data);
    setDate(data.socio_hasta ? new Date(data.socio_hasta) : undefined);
  };

  const updateMemberStatus = async (isMember: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        roles: { ...foundUser.roles, socio: isMember },
        socio_hasta: date?.toISOString().split('T')[0]
      })
      .eq('id', foundUser.id);

    if (error) {
      toast.error("Error al actualizar estado de socio");
      return;
    }
    toast.success(`Usuario ${isMember ? 'ahora es' : 'ya no es'} socio`);
    searchUser();
  };

  const saveTacticsPuzzle = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('tactics_puzzles')
      .insert({
        fen,
        solution,
        turn,
        themes: [theme],
        difficulty_level: difficulty,
        description,
        source_game_pgn: sourcePgn,
        event_name: event,
        white_player: whitePlayer,
        black_player: blackPlayer,
        white_elo: parseInt(whiteElo) || null,
        black_elo: parseInt(blackElo) || null,
        created_by_user_id: profile?.id,
        is_active: true
      });

    if (error) {
      toast.error("Error al guardar el problema");
      return;
    }
    toast.success("Problema guardado exitosamente");
    
    // Reset form
    setFen("");
    setSolution("");
    setTurn("w");
    setTheme("");
    setDifficulty("");
    setDescription("");
    setSourcePgn("");
    setEvent("");
    setWhitePlayer("");
    setBlackPlayer("");
    setWhiteElo("");
    setBlackElo("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Administración del Sitio</h1>
          
          <Tabs defaultValue="members">
            <TabsList className="mb-8">
              <TabsTrigger value="members">Gestión de Socios</TabsTrigger>
              <TabsTrigger value="tactics">Problemas de Táctica</TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Email del usuario"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                  />
                  <Button onClick={searchUser}>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </Button>
                </div>

                {foundUser && (
                  <div className="space-y-4 p-6 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label>Estado de Socio</Label>
                      <Switch
                        checked={foundUser.roles?.socio || false}
                        onCheckedChange={(checked) => updateMemberStatus(checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Socio Hasta</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PP') : 'Seleccionar fecha'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tactics">
              <form onSubmit={saveTacticsPuzzle} className="space-y-6">
                <div className="space-y-2">
                  <Label>FEN (Posición Inicial)</Label>
                  <Input
                    required
                    value={fen}
                    onChange={(e) => setFen(e.target.value)}
                    placeholder="r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 w - - 0 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Solución (en SAN)</Label>
                  <Textarea
                    required
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="1.Ne7# o 1.Qg5+ hxg5 2.Nxf6#"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Turno de Juego</Label>
                  <Select required value={turn} onValueChange={setTurn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="w">Blancas</SelectItem>
                      <SelectItem value="b">Negras</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoría/Tema Principal</Label>
                  <Input
                    required
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Jaque Mate en 2"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dificultad</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Medio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                      <SelectItem value="very_hard">Muy Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Partida Origen (PGN o enlace)</Label>
                    <Input
                      value={sourcePgn}
                      onChange={(e) => setSourcePgn(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Evento</Label>
                    <Input
                      value={event}
                      onChange={(e) => setEvent(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jugador Blancas</Label>
                    <Input
                      value={whitePlayer}
                      onChange={(e) => setWhitePlayer(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jugador Negras</Label>
                    <Input
                      value={blackPlayer}
                      onChange={(e) => setBlackPlayer(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ELO Blancas</Label>
                    <Input
                      type="number"
                      value={whiteElo}
                      onChange={(e) => setWhiteElo(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ELO Negras</Label>
                    <Input
                      type="number"
                      value={blackElo}
                      onChange={(e) => setBlackElo(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Guardar Problema
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
