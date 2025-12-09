import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  User,
  Phone,
  Mail,
  Calendar,
  Star,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const clientsData = [
  {
    id: 1,
    name: "Carlos Mendoza",
    email: "carlos@email.com",
    phone: "+52 55 1234 5678",
    visits: 24,
    totalSpent: 1250,
    lastVisit: "2024-01-15",
    favoriteService: "Corte + Barba",
    status: "vip",
  },
  {
    id: 2,
    name: "Roberto García",
    email: "roberto@email.com",
    phone: "+52 55 2345 6789",
    visits: 12,
    totalSpent: 580,
    lastVisit: "2024-01-14",
    favoriteService: "Fade Degradado",
    status: "regular",
  },
  {
    id: 3,
    name: "Luis Pérez",
    email: "luis@email.com",
    phone: "+52 55 3456 7890",
    visits: 8,
    totalSpent: 320,
    lastVisit: "2024-01-12",
    favoriteService: "Corte Clásico",
    status: "regular",
  },
  {
    id: 4,
    name: "Fernando López",
    email: "fernando@email.com",
    phone: "+52 55 4567 8901",
    visits: 35,
    totalSpent: 2100,
    lastVisit: "2024-01-10",
    favoriteService: "Barba Completa",
    status: "vip",
  },
  {
    id: 5,
    name: "Diego Ramírez",
    email: "diego@email.com",
    phone: "+52 55 5678 9012",
    visits: 3,
    totalSpent: 95,
    lastVisit: "2024-01-08",
    favoriteService: "Corte Clásico",
    status: "new",
  },
  {
    id: 6,
    name: "Andrés Morales",
    email: "andres@email.com",
    phone: "+52 55 6789 0123",
    visits: 1,
    totalSpent: 45,
    lastVisit: "2024-01-05",
    favoriteService: "Corte + Barba",
    status: "new",
  },
];

const statusConfig = {
  vip: { label: "VIP", variant: "default" as const },
  regular: { label: "Regular", variant: "secondary" as const },
  new: { label: "Nuevo", variant: "info" as const },
};

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredClients = clientsData.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClients = clientsData.length;
  const vipClients = clientsData.filter((c) => c.status === "vip").length;
  const newClients = clientsData.filter((c) => c.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu base de clientes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Nuevo Cliente
              </DialogTitle>
              <DialogDescription>
                Registra un nuevo cliente en el sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="clientName">Nombre completo</Label>
                <Input id="clientName" placeholder="Nombre del cliente" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientEmail">Correo electrónico</Label>
                <Input id="clientEmail" type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientPhone">Teléfono</Label>
                <Input id="clientPhone" placeholder="+52 55 1234 5678" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notas</Label>
                <Input id="notes" placeholder="Preferencias, alergias, etc." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Guardar Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clientes</p>
              <p className="font-display text-2xl">{totalClients}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary/10 p-3">
              <Star className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clientes VIP</p>
              <p className="font-display text-2xl">{vipClients}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-info/10 p-3">
              <User className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nuevos este mes</p>
              <p className="font-display text-2xl">{newClients}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clients Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead className="text-center">Visitas</TableHead>
              <TableHead className="text-right">Total Gastado</TableHead>
              <TableHead>Última Visita</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => {
              const status = statusConfig[client.status as keyof typeof statusConfig];
              return (
                <TableRow key={client.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.favoriteService}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </p>
                      <p className="text-sm flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-display text-lg">{client.visits}</span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${client.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(client.lastVisit).toLocaleDateString("es-MX")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver historial
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
