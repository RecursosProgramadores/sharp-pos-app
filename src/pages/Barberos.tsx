import { useState } from "react";
import { Plus, Search, Filter, SortAsc, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { BarberCard } from "@/components/barberos/BarberCard";
import { NewBarberWizard } from "@/components/barberos/NewBarberWizard";
import { BarberDetailsModal } from "@/components/barberos/BarberDetailsModal";
import { ScheduleTab } from "@/components/barberos/ScheduleTab";
import { AttendanceTab } from "@/components/barberos/AttendanceTab";
import { StatsTab } from "@/components/barberos/StatsTab";
import { ChairRentalsTab } from "@/components/barberos/ChairRentalsTab";
import { toast } from "sonner";
import { useBarbers } from "@/hooks/useBarbers";
import type { Barber } from "@/components/barberos/BarberCard";

export default function Barberos() {
  const { barbers, isLoading, fetchBarbers, toggleStatus } = useBarbers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isNewBarberOpen, setIsNewBarberOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredBarbers = barbers
    .filter((barber) => {
      const matchesSearch =
        barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (barber.dni && barber.dni.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || barber.status === statusFilter;
      const matchesSpecialty = specialtyFilter === "all" || barber.specialty === specialtyFilter;
      return matchesSearch && matchesStatus && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name);
        case "cuts": return (b.totalCuts || 0) - (a.totalCuts || 0);
        case "rating": return (b.rating || 0) - (a.rating || 0);
        default: return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">Gestión de Barberos</h1>
          <p className="text-muted-foreground mt-1">Administra tu equipo de trabajo</p>
        </div>
        <Button className="gap-2" size="lg" onClick={() => setIsNewBarberOpen(true)}>
          <Plus className="h-5 w-5" />Nuevo Barbero
        </Button>
      </div>

      <Tabs defaultValue="barbers" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl">
          <TabsTrigger value="barbers">Barberos</TabsTrigger>
          <TabsTrigger value="schedules">Horarios</TabsTrigger>
          <TabsTrigger value="attendance">Asistencia</TabsTrigger>
          <TabsTrigger value="rentals">Alquiler Sillas</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="barbers" className="mt-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por nombre o DNI..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Especialidad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Corte Clásico">Corte Clásico</SelectItem>
                  <SelectItem value="Fade">Fade</SelectItem>
                  <SelectItem value="Barba">Barba</SelectItem>
                  <SelectItem value="Diseño">Diseño</SelectItem>
                  <SelectItem value="Mixto">Mixto</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]"><SortAsc className="h-4 w-4 mr-2" /><SelectValue placeholder="Ordenar por" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="cuts">Más Cortes</SelectItem>
                  <SelectItem value="rating">Mejores Ratings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Cargando barberos...</span>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBarbers.map((barber) => (
                  <BarberCard
                    key={barber.id}
                    barber={barber}
                    onViewDetails={(b) => { setSelectedBarber(b); setIsDetailsOpen(true); }}
                    onEdit={(b) => toast.info(`Editando: ${b.name}`)}
                    onToggleStatus={toggleStatus}
                  />
                ))}
              </div>
              {filteredBarbers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {barbers.length === 0 ? "No hay barberos registrados. ¡Agrega el primero!" : "No se encontraron barberos con los filtros seleccionados"}
                  </p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="schedules" className="mt-6"><ScheduleTab /></TabsContent>
        <TabsContent value="attendance" className="mt-6"><AttendanceTab /></TabsContent>
        <TabsContent value="rentals" className="mt-6"><ChairRentalsTab /></TabsContent>
        <TabsContent value="stats" className="mt-6"><StatsTab /></TabsContent>
      </Tabs>

      <NewBarberWizard open={isNewBarberOpen} onOpenChange={setIsNewBarberOpen} onSave={fetchBarbers} />
      <BarberDetailsModal barber={selectedBarber} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </div>
  );
}
