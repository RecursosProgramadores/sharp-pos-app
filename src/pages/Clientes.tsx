import { useState } from "react";
import {
  Plus,
  Search,
  Download,
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewClientModal } from "@/components/clientes/NewClientModal";
import { ClientDetailsModal } from "@/components/clientes/ClientDetailsModal";
import { BirthdayReminders } from "@/components/clientes/BirthdayReminders";
import { InactiveClients } from "@/components/clientes/InactiveClients";
import { LoyaltyConfig } from "@/components/clientes/LoyaltyConfig";
import { CampaignBuilder } from "@/components/clientes/CampaignBuilder";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";
import { levelConfig } from "@/types/client";
import type { Client } from "@/types/client";

export default function Clientes() {
  const { clients, loading, addClient, updateClient, deleteClient, uploadPhoto } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [visitFilter, setVisitFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isUpcomingBirthday = (birthDate: string | null) => {
    if (!birthDate) return false;
    const today = new Date();
    const birth = new Date(birthDate);
    const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    const diffDays = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const filteredClients = clients
    .filter((client) => {
      const matchesSearch = client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLevel = levelFilter === "all" || client.level === levelFilter;
      
      let matchesVisit = true;
      if (visitFilter !== "all" && client.last_visit) {
        const lastVisit = new Date(client.last_visit);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
        if (visitFilter === "week") matchesVisit = diffDays <= 7;
        else if (visitFilter === "month") matchesVisit = diffDays <= 30;
        else if (visitFilter === "inactive") matchesVisit = diffDays > 90;
      }
      
      return matchesSearch && matchesLevel && matchesVisit;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.full_name.localeCompare(b.full_name);
      if (sortBy === "visits") return b.visits - a.visits;
      if (sortBy === "spent") return b.total_spent - a.total_spent;
      if (sortBy === "lastVisit") {
        const aDate = a.last_visit ? new Date(a.last_visit).getTime() : 0;
        const bDate = b.last_visit ? new Date(b.last_visit).getTime() : 0;
        return bDate - aDate;
      }
      return 0;
    });

  const stats = {
    total: clients.length,
    vip: clients.filter((c) => c.level === "vip" || c.level === "premium").length,
    new: clients.filter((c) => c.level === "new").length,
    totalRevenue: clients.reduce((sum, c) => sum + c.total_spent, 0),
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank");
  };

  const handleExportCSV = () => {
    try {
      const headers = ["Nombre", "Teléfono", "Email", "Nivel", "Visitas", "Total Gastado", "Puntos", "Última Visita", "Cumpleaños"];
      const rows = clients.map(c => [
        c.full_name,
        c.phone,
        c.email || "",
        c.level,
        c.visits,
        c.total_spent,
        c.points,
        c.last_visit || "",
        c.birth_date || "",
      ]);
      const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clientes_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Base de datos exportada exitosamente");
    } catch {
      toast.error("Error al exportar");
    }
  };

  const handleDeleteClient = async (id: string) => {
    await deleteClient(id);
  };

  const renderSatisfactionStars = (rating: number | null) => {
    if (!rating) return <span className="text-muted-foreground text-xs">Sin calificar</span>;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  <TableHead>Barbero</TableHead>
                  <TableHead className="text-center">Satisfacción</TableHead>
                  <TableHead className="text-center">Visitas</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No hay clientes registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => {
                    const level = levelConfig[client.level];
                    const initials = client.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2);
                    return (
                      <TableRow key={client.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                              {client.photo_url ? (
                                <AvatarImage src={client.photo_url} alt={client.full_name} />
                              ) : null}
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{client.full_name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm flex items-center gap-1">
                              <Phone className="h-3 w-3" />{client.phone}
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-success" onClick={() => handleWhatsApp(client.phone)}>
                                <MessageCircle className="h-3 w-3" />
                              </Button>
                            </p>
                            {client.email && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />{client.email}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {client.birth_date ? (
                            <div className="flex items-center gap-1">
                              {isUpcomingBirthday(client.birth_date) && <Gift className="h-4 w-4 text-secondary" />}
                              <span className="text-sm">
                                {new Date(client.birth_date).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{client.preferred_barber_name || "-"}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {renderSatisfactionStars(client.satisfaction_rating)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{client.visits}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">${client.total_spent.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={level.variant}>{level.icon} {level.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedClient(client); setIsDetailsOpen(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedClient(client); setIsDetailsOpen(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteClient(client.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <BirthdayReminders clients={clients.map(c => ({
              id: parseInt(c.id.slice(0, 8), 16),
              name: c.full_name,
              email: c.email || "",
              phone: c.phone,
              birthDate: c.birth_date || "",
              lastVisit: c.last_visit || "",
              visits: c.visits,
              totalSpent: c.total_spent,
              level: c.level,
              points: c.points,
            }))} />
            <InactiveClients clients={clients.map(c => ({
              id: parseInt(c.id.slice(0, 8), 16),
              name: c.full_name,
              email: c.email || "",
              phone: c.phone,
              birthDate: c.birth_date || "",
              lastVisit: c.last_visit || "",
              visits: c.visits,
              totalSpent: c.total_spent,
              level: c.level,
              points: c.points,
            }))} />
          </div>
        </TabsContent>

        <TabsContent value="loyalty">
          <LoyaltyConfig />
        </TabsContent>
      </Tabs>

      <NewClientModal 
        open={isNewClientOpen} 
        onOpenChange={setIsNewClientOpen} 
        onSave={addClient}
        uploadPhoto={uploadPhoto}
      />
      <ClientDetailsModal 
        client={selectedClient ? {
          id: parseInt(selectedClient.id.slice(0, 8), 16),
          name: selectedClient.full_name,
          email: selectedClient.email || "",
          phone: selectedClient.phone,
          birthDate: selectedClient.birth_date || "",
          lastVisit: selectedClient.last_visit || "",
          visits: selectedClient.visits,
          totalSpent: selectedClient.total_spent,
          level: selectedClient.level,
          photo: selectedClient.photo_url || undefined,
          preferredBarber: selectedClient.preferred_barber_name,
          preferredServices: selectedClient.preferred_services,
          notes: selectedClient.notes || undefined,
          points: selectedClient.points,
        } : null} 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        onUpdate={(updatedClient) => {
          if (selectedClient) {
            updateClient(selectedClient.id, {
              full_name: updatedClient.name,
              phone: updatedClient.phone,
              email: updatedClient.email,
              birth_date: updatedClient.birthDate,
              notes: updatedClient.notes || "",
              preferred_services: updatedClient.preferredServices || [],
            });
          }
        }} 
      />
    </div>
  );
}
