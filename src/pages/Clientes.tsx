import { useState } from "react";
import {
  Plus,
  Search,
  Download,
  Filter,
  Users,
  Star,
  UserPlus,
  TrendingUp,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  Gift,
  Calendar,
  Phone,
  Mail,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewClientModal } from "@/components/clientes/NewClientModal";
import { ClientDetailsModal } from "@/components/clientes/ClientDetailsModal";
import { BirthdayReminders } from "@/components/clientes/BirthdayReminders";
import { InactiveClients } from "@/components/clientes/InactiveClients";
import { LoyaltyConfig } from "@/components/clientes/LoyaltyConfig";
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  lastVisit: string;
  visits: number;
  totalSpent: number;
  level: "new" | "regular" | "vip" | "premium";
  photo?: string;
  preferredBarber?: string;
  preferredServices?: string[];
  notes?: string;
  points: number;
}

const initialClients: Client[] = [
  { id: 1, name: "Carlos Mendoza", email: "carlos@email.com", phone: "+52 55 1234 5678", birthDate: "1990-12-20", lastVisit: "2024-01-15", visits: 24, totalSpent: 1250, level: "vip", preferredBarber: "Miguel Torres", points: 125 },
  { id: 2, name: "Roberto García", email: "roberto@email.com", phone: "+52 55 2345 6789", birthDate: "1985-12-05", lastVisit: "2024-01-14", visits: 12, totalSpent: 580, level: "regular", points: 58 },
  { id: 3, name: "Luis Pérez", email: "luis@email.com", phone: "+52 55 3456 7890", birthDate: "1992-03-15", lastVisit: "2024-01-12", visits: 8, totalSpent: 320, level: "regular", points: 32 },
  { id: 4, name: "Fernando López", email: "fernando@email.com", phone: "+52 55 4567 8901", birthDate: "1988-07-22", lastVisit: "2024-01-10", visits: 35, totalSpent: 2100, level: "premium", preferredBarber: "Carlos Mendoza", points: 210 },
  { id: 5, name: "Diego Ramírez", email: "diego@email.com", phone: "+52 55 5678 9012", birthDate: "1995-12-28", lastVisit: "2024-01-08", visits: 3, totalSpent: 95, level: "new", points: 10 },
  { id: 6, name: "Andrés Morales", email: "andres@email.com", phone: "+52 55 6789 0123", birthDate: "1991-06-10", lastVisit: "2023-09-15", visits: 6, totalSpent: 180, level: "regular", points: 18 },
  { id: 7, name: "Miguel Sánchez", email: "miguel@email.com", phone: "+52 55 7890 1234", birthDate: "1987-01-05", lastVisit: "2023-08-20", visits: 15, totalSpent: 750, level: "vip", points: 75 },
];

const levelConfig = {
  new: { label: "Nuevo", icon: "🥉", variant: "outline" as const },
  regular: { label: "Regular", icon: "🥈", variant: "secondary" as const },
  vip: { label: "VIP", icon: "🥇", variant: "default" as const },
  premium: { label: "Premium", icon: "💎", variant: "default" as const },
};

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [visitFilter, setVisitFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isUpcomingBirthday = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    const diffDays = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const filteredClients = clients
    .filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === "all" || client.level === levelFilter;
      
      let matchesVisit = true;
      if (visitFilter !== "all") {
        const lastVisit = new Date(client.lastVisit);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
        if (visitFilter === "week") matchesVisit = diffDays <= 7;
        else if (visitFilter === "month") matchesVisit = diffDays <= 30;
        else if (visitFilter === "inactive") matchesVisit = diffDays > 90;
      }
      
      return matchesSearch && matchesLevel && matchesVisit;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "visits") return b.visits - a.visits;
      if (sortBy === "spent") return b.totalSpent - a.totalSpent;
      if (sortBy === "lastVisit") return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      return 0;
    });

  const stats = {
    total: clients.length,
    vip: clients.filter((c) => c.level === "vip" || c.level === "premium").length,
    new: clients.filter((c) => c.level === "new").length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank");
  };

  const handleExportCSV = () => {
    toast.success("Base de datos exportada exitosamente");
  };

  const handleAddClient = (newClient: Client) => {
    setClients([...clients, newClient]);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(clients.map((c) => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (id: number) => {
    setClients(clients.filter((c) => c.id !== id));
    toast.success("Cliente eliminado");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">CRM y programa de fidelización</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => setIsNewClientOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3"><Users className="h-6 w-6 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Total Clientes</p><p className="font-display text-2xl">{stats.total}</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary/10 p-3"><Star className="h-6 w-6 text-secondary" /></div>
            <div><p className="text-sm text-muted-foreground">VIP / Premium</p><p className="font-display text-2xl">{stats.vip}</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-info/10 p-3"><UserPlus className="h-6 w-6 text-info" /></div>
            <div><p className="text-sm text-muted-foreground">Nuevos</p><p className="font-display text-2xl">{stats.new}</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-success/10 p-3"><TrendingUp className="h-6 w-6 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Ingresos Totales</p><p className="font-display text-2xl">${stats.totalRevenue.toLocaleString()}</p></div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="loyalty">Fidelización</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por nombre, teléfono o email..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Nivel" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Nuevos</SelectItem>
                <SelectItem value="regular">Regulares</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visitFilter} onValueChange={setVisitFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Última visita" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="inactive">Inactivos (+3 meses)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Ordenar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="visits">Más visitas</SelectItem>
                <SelectItem value="spent">Mayor gasto</SelectItem>
                <SelectItem value="lastVisit">Última visita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clients Table */}
          <div className="card-elevated overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Cumpleaños</TableHead>
                  <TableHead className="text-center">Visitas</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const level = levelConfig[client.level];
                  const initials = client.name.split(" ").map((n) => n[0]).join("");
                  return (
                    <TableRow key={client.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{client.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-1"><Phone className="h-3 w-3" />{client.phone}
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-success" onClick={() => handleWhatsApp(client.phone)}><MessageCircle className="h-3 w-3" /></Button>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{client.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {isUpcomingBirthday(client.birthDate) && <Gift className="h-4 w-4 text-secondary" />}
                          <span className="text-sm">{new Date(client.birthDate).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center"><Badge variant="secondary">{client.visits}</Badge></TableCell>
                      <TableCell className="text-right font-semibold">${client.totalSpent.toLocaleString()}</TableCell>
                      <TableCell><div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-3 w-3" />{new Date(client.lastVisit).toLocaleDateString("es-MX")}</div></TableCell>
                      <TableCell><Badge variant={level.variant}>{level.icon} {level.label}</Badge></TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedClient(client); setIsDetailsOpen(true); }}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedClient(client); setIsDetailsOpen(true); }}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteClient(client.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <BirthdayReminders clients={clients} />
            <InactiveClients clients={clients} />
          </div>
        </TabsContent>

        <TabsContent value="loyalty">
          <LoyaltyConfig />
        </TabsContent>
      </Tabs>

      <NewClientModal open={isNewClientOpen} onOpenChange={setIsNewClientOpen} onSave={handleAddClient} />
      <ClientDetailsModal client={selectedClient} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} onUpdate={handleUpdateClient} />
    </div>
  );
}
