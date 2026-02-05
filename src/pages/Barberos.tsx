import { useState, useEffect } from "react";
import { Plus, Search, Filter, SortAsc, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarberCard, type Barber } from "@/components/barberos/BarberCard";
import { NewBarberWizard } from "@/components/barberos/NewBarberWizard";
import { BarberDetailsModal } from "@/components/barberos/BarberDetailsModal";
import { ScheduleTab } from "@/components/barberos/ScheduleTab";
import { AttendanceTab } from "@/components/barberos/AttendanceTab";
import { StatsTab } from "@/components/barberos/StatsTab";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Barberos() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isNewBarberOpen, setIsNewBarberOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Cargar barberos desde la base de datos
  const fetchBarbers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching barbers:', error);
        toast.error("Error al cargar los barberos");
        return;
      }

      // Transformar datos de la BD al formato del frontend
      const transformedBarbers: Barber[] = (data || []).map((barber) => ({
        id: barber.id,
        name: barber.full_name,
        email: barber.email || "",
        phone: barber.phone || "",
        dni: barber.dni || "",
        status: barber.active ? "active" : "inactive",
        specialty: barber.specialty || "Mixto",
        hireDate: barber.hire_date || barber.created_at?.split('T')[0],
        photoUrl: barber.photo_url,
        services: [],
        rating: 4.5,
        reviewCount: 0,
        totalCuts: 0,
        revenue: 0,
        // Campos de pago
        commissionPercentage: barber.commission_percentage,
        lunchIncluded: barber.lunch_included,
        lunchAmount: barber.lunch_amount,
        incentivesEnabled: barber.incentives_enabled,
        incentivePerCut: barber.incentive_per_cut,
        incentiveThreshold: barber.incentive_threshold,
      }));

      setBarbers(transformedBarbers);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error inesperado al cargar");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

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
        case "name":
          return a.name.localeCompare(b.name);
        case "cuts":
          return (b.totalCuts || 0) - (a.totalCuts || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const handleViewDetails = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsDetailsOpen(true);
  };

  const handleEdit = (barber: Barber) => {
    toast.info(`Editando: ${barber.name}`);
  };

  const handleToggleStatus = async (barber: Barber) => {
    const newStatus = barber.status === "active" ? false : true;
    
    const { error } = await supabase
      .from('barbers')
      .update({ active: newStatus })
      .eq('id', barber.id);

    if (error) {
      toast.error("Error al cambiar estado");
      return;
    }

    toast.success(`${barber.name} ahora está ${newStatus ? "activo" : "inactivo"}`);
    fetchBarbers();
  };

  const handleSaveNewBarber = () => {
    // Recargar la lista después de guardar
    fetchBarbers();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            Gestión de Barberos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra tu equipo de trabajo
          </p>
        </div>
        <Button className="gap-2" size="lg" onClick={() => setIsNewBarberOpen(true)}>
          <Plus className="h-5 w-5" />
          Nuevo Barbero
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="barbers" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="barbers">Barberos</TabsTrigger>
          <TabsTrigger value="schedules">Horarios</TabsTrigger>
          <TabsTrigger value="attendance">Asistencia</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        {/* Barbers Tab */}
        <TabsContent value="barbers" className="mt-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o DNI..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="vacation">Vacaciones</SelectItem>
                </SelectContent>
              </Select>

              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
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
                <SelectTrigger className="w-[160px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="cuts">Más Cortes</SelectItem>
                  <SelectItem value="rating">Mejores Ratings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Cargando barberos...</span>
            </div>
          ) : (
            <>
              {/* Barbers Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBarbers.map((barber) => (
                  <BarberCard
                    key={barber.id}
                    barber={barber}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>

              {filteredBarbers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {barbers.length === 0 
                      ? "No hay barberos registrados. ¡Agrega el primero!"
                      : "No se encontraron barberos con los filtros seleccionados"
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="mt-6">
          <ScheduleTab />
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="mt-6">
          <AttendanceTab />
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="mt-6">
          <StatsTab />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <NewBarberWizard
        open={isNewBarberOpen}
        onOpenChange={setIsNewBarberOpen}
        onSave={handleSaveNewBarber}
      />

      <BarberDetailsModal
        barber={selectedBarber}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}