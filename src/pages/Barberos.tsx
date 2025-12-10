import { useState } from "react";
import { Plus, Search, Filter, SortAsc } from "lucide-react";
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

const barbersData: Barber[] = [
  {
    id: 1,
    name: "Miguel Ángel Rodríguez",
    email: "miguel@barberpro.com",
    phone: "+52 55 1234 5678",
    dni: "12345678A",
    status: "active",
    specialty: "Corte Clásico",
    hireDate: "2022-03-15",
    services: [
      { name: "Corte Clásico", price: 30, duration: 25 },
      { name: "Fade Degradado", price: 40, duration: 35 },
      { name: "Barba Completa", price: 25, duration: 20 },
    ],
    rating: 4.8,
    reviewCount: 156,
    totalCuts: 1248,
    revenue: 37440,
  },
  {
    id: 2,
    name: "Juan Carlos López",
    email: "juan@barberpro.com",
    phone: "+52 55 2345 6789",
    dni: "23456789B",
    status: "active",
    specialty: "Fade",
    hireDate: "2021-08-20",
    services: [
      { name: "Fade Degradado", price: 40, duration: 35 },
      { name: "Diseño", price: 50, duration: 45 },
      { name: "Corte + Diseño", price: 65, duration: 50 },
    ],
    rating: 4.9,
    reviewCount: 203,
    totalCuts: 1564,
    revenue: 54740,
  },
  {
    id: 3,
    name: "Pedro Sánchez García",
    email: "pedro@barberpro.com",
    phone: "+52 55 3456 7890",
    dni: "34567890C",
    status: "active",
    specialty: "Barba",
    hireDate: "2023-01-10",
    services: [
      { name: "Barba Completa", price: 25, duration: 20 },
      { name: "Afeitado Tradicional", price: 30, duration: 25 },
      { name: "Tratamiento Barba", price: 35, duration: 30 },
    ],
    rating: 4.7,
    reviewCount: 89,
    totalCuts: 687,
    revenue: 18549,
  },
  {
    id: 4,
    name: "Roberto Díaz Hernández",
    email: "roberto@barberpro.com",
    phone: "+52 55 4567 8901",
    dni: "45678901D",
    status: "vacation",
    specialty: "Mixto",
    hireDate: "2020-11-05",
    services: [
      { name: "Corte Clásico", price: 30, duration: 25 },
      { name: "Fade Degradado", price: 40, duration: 35 },
      { name: "Corte + Barba", price: 45, duration: 40 },
      { name: "Diseño", price: 50, duration: 45 },
    ],
    rating: 4.6,
    reviewCount: 312,
    totalCuts: 2156,
    revenue: 75460,
  },
  {
    id: 5,
    name: "Luis Gómez Martínez",
    email: "luis@barberpro.com",
    phone: "+52 55 5678 9012",
    dni: "56789012E",
    status: "inactive",
    specialty: "Diseño",
    hireDate: "2023-06-01",
    services: [
      { name: "Diseño", price: 50, duration: 45 },
      { name: "Corte + Diseño", price: 65, duration: 50 },
    ],
    rating: 4.5,
    reviewCount: 45,
    totalCuts: 234,
    revenue: 11700,
  },
];

export default function Barberos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isNewBarberOpen, setIsNewBarberOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredBarbers = barbersData
    .filter((barber) => {
      const matchesSearch =
        barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barber.dni.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || barber.status === statusFilter;
      const matchesSpecialty = specialtyFilter === "all" || barber.specialty === specialtyFilter;
      return matchesSearch && matchesStatus && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "cuts":
          return b.totalCuts - a.totalCuts;
        case "rating":
          return b.rating - a.rating;
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

  const handleToggleStatus = (barber: Barber) => {
    const newStatus = barber.status === "active" ? "inactive" : "active";
    toast.success(`${barber.name} ahora está ${newStatus === "active" ? "activo" : "inactivo"}`);
  };

  const handleSaveNewBarber = (barber: any) => {
    console.log("New barber:", barber);
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
                No se encontraron barberos con los filtros seleccionados
              </p>
            </div>
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
