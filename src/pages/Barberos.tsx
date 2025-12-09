import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const barbersData = [
  {
    id: 1,
    name: "Miguel Ángel Rodríguez",
    email: "miguel@barberpro.com",
    phone: "+52 55 1234 5678",
    status: "active",
    specialty: "Cortes clásicos",
    hireDate: "2022-03-15",
    sales: 156,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Juan Carlos López",
    email: "juan@barberpro.com",
    phone: "+52 55 2345 6789",
    status: "active",
    specialty: "Fade y degradados",
    hireDate: "2021-08-20",
    sales: 203,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Pedro Sánchez García",
    email: "pedro@barberpro.com",
    phone: "+52 55 3456 7890",
    status: "active",
    specialty: "Barba y bigote",
    hireDate: "2023-01-10",
    sales: 89,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Roberto Díaz Hernández",
    email: "roberto@barberpro.com",
    phone: "+52 55 4567 8901",
    status: "inactive",
    specialty: "Cortes modernos",
    hireDate: "2020-11-05",
    sales: 312,
    rating: 4.6,
  },
];

export default function Barberos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredBarbers = barbersData.filter((barber) =>
    barber.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Barbero
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Nuevo Barbero
              </DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo miembro del equipo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" placeholder="Nombre del barbero" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="+52 55 1234 5678" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Cortes clásicos</SelectItem>
                    <SelectItem value="fade">Fade y degradados</SelectItem>
                    <SelectItem value="beard">Barba y bigote</SelectItem>
                    <SelectItem value="modern">Cortes modernos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Guardar Barbero
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar barbero..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Barbers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBarbers.map((barber) => (
          <div
            key={barber.id}
            className="card-elevated p-6 animate-fade-in hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground font-display text-xl">
                    {barber.name.split(" ")[0][0]}
                    {barber.name.split(" ")[1]?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{barber.name}</h3>
                  <Badge
                    variant={barber.status === "active" ? "success" : "muted"}
                    className="mt-1"
                  >
                    {barber.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">{barber.specialty}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{barber.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{barber.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Desde {new Date(barber.hireDate).toLocaleDateString("es-MX")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="font-display text-2xl">{barber.sales}</p>
                <p className="text-xs text-muted-foreground">Servicios</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl flex items-center gap-1">
                  ⭐ {barber.rating}
                </p>
                <p className="text-xs text-muted-foreground">Calificación</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
