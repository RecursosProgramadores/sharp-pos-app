import { useState } from "react";
import {
  Phone,
  Mail,
  Calendar,
  Edit,
  Gift,
  Star,
  TrendingUp,
  Award,
  MessageCircle,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

interface ClientDetailsModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (client: Client) => void;
}

const levelConfig = {
  new: { label: "Nuevo", icon: "🥉", color: "bg-muted" },
  regular: { label: "Regular", icon: "🥈", color: "bg-secondary/20" },
  vip: { label: "VIP", icon: "🥇", color: "bg-primary/20" },
  premium: { label: "Premium", icon: "💎", color: "bg-info/20" },
};

const visitHistory = [
  { id: 1, date: "2024-01-15", service: "Corte + Barba", barber: "Carlos Mendoza", amount: 25, paymentMethod: "Efectivo" },
  { id: 2, date: "2024-01-02", service: "Fade", barber: "Miguel Torres", amount: 20, paymentMethod: "Tarjeta" },
  { id: 3, date: "2023-12-18", service: "Corte Clásico", barber: "Carlos Mendoza", amount: 15, paymentMethod: "Efectivo" },
  { id: 4, date: "2023-12-05", service: "Barba", barber: "Roberto García", amount: 12, paymentMethod: "Transferencia" },
  { id: 5, date: "2023-11-20", service: "Corte + Barba", barber: "Carlos Mendoza", amount: 25, paymentMethod: "Efectivo" },
];

const spendingData = [
  { month: "Ago", amount: 45 },
  { month: "Sep", amount: 60 },
  { month: "Oct", amount: 35 },
  { month: "Nov", amount: 50 },
  { month: "Dic", amount: 75 },
  { month: "Ene", amount: 45 },
];

// Removed hardcoded rewards and pointsHistory - now fetched from DB

export function ClientDetailsModal({
  client,
  open,
  onOpenChange,
  onUpdate,
}: ClientDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Client | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const queryClient = useQueryClient();

  // Fetch loyalty config from DB
  const { data: loyaltyConfig } = useQuery({
    queryKey: ["business-settings", "loyalty"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_settings")
        .select("setting_value")
        .eq("setting_key", "loyalty")
        .single();
      if (error) return null;
      return data?.setting_value as any;
    },
    enabled: open,
  });

  // Fetch barbers for preferences tab
  const { data: dbBarbers = [] } = useQuery({
    queryKey: ["barbers-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("barbers")
        .select("id, full_name")
        .eq("active", true)
        .order("full_name");
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  // Fetch services for preferences tab
  const { data: dbServices = [] } = useQuery({
    queryKey: ["services-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("name")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data.map(s => s.name);
    },
    enabled: open,
  });

  const rewards = (loyaltyConfig?.rewards || []).filter((r: any) => r.active);
  const nextRewardPoints = rewards.length > 0
    ? Math.min(...rewards.map((r: any) => r.pointsRequired))
    : 50;

  if (!client) return null;

  const level = levelConfig[client.level];
  const initials = client.name.split(" ").map((n) => n[0]).join("");
  const progressToReward = Math.min((client.points / nextRewardPoints) * 100, 100);

  const handleEdit = () => {
    setEditData({ ...client });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData) {
      onUpdate(editData);
      setIsEditing(false);
      toast.success("Cliente actualizado");
    }
  };

  const handleServiceToggle = (service: string) => {
    if (!editData) return;
    const currentServices = editData.preferredServices || [];
    setEditData({
      ...editData,
      preferredServices: currentServices.includes(service)
        ? currentServices.filter((s) => s !== service)
        : [...currentServices, service],
    });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("¡Hola! Te escribimos desde la barbería...");
    window.open(`https://wa.me/${client.phone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  const handleRedeemReward = async (reward: { name: string; pointsRequired: number }) => {
    if (client.points < reward.pointsRequired) {
      toast.error("No tienes suficientes puntos");
      return;
    }
    setIsRedeeming(true);
    try {
      const newPoints = client.points - reward.pointsRequired;
      const { error } = await supabase
        .from("clients")
        .update({ points: newPoints })
        .eq("id", (client as any).id ?? "");
      if (error) throw error;
      toast.success(`Recompensa "${reward.name}" canjeada exitosamente`);
      // Update local state
      onUpdate({ ...client, points: newPoints });
      queryClient.invalidateQueries({ queryKey: ["pos-clients"] });
    } catch (err: any) {
      toast.error("Error al canjear: " + err.message);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                {client.photo ? (
                  <AvatarImage src={client.photo} alt={client.name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="font-display text-2xl flex items-center gap-2">
                  {client.name}
                  <Badge className={`${level.color} text-foreground`}>
                    {level.icon} {level.label}
                  </Badge>
                </DialogTitle>
                <p className="text-muted-foreground">
                  Cliente desde {new Date(client.lastVisit).toLocaleDateString("es-MX", { year: "numeric", month: "long" })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleWhatsApp}>
                <MessageCircle className="h-4 w-4" />
              </Button>
              {!isEditing ? (
                <Button variant="outline" size="icon" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="icon" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="font-display text-2xl text-primary">{client.visits}</p>
            <p className="text-xs text-muted-foreground">Total Visitas</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="font-display text-2xl text-secondary">${client.totalSpent}</p>
            <p className="text-xs text-muted-foreground">Gasto Total</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="font-display text-2xl text-info">{client.points}</p>
            <p className="text-xs text-muted-foreground">Puntos</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">
              {new Date(client.lastVisit).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
            </p>
            <p className="text-xs text-muted-foreground">Última Visita</p>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            <TabsTrigger value="loyalty">Fidelización</TabsTrigger>
          </TabsList>

          {/* Tab: Información */}
          <TabsContent value="info" className="space-y-4 pt-4">
            {isEditing && editData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre Completo</Label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de Nacimiento</Label>
                    <Input
                      type="date"
                      value={editData.birthDate}
                      onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notas</Label>
                  <Textarea
                    value={editData.notes || ""}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    placeholder="Preferencias, alergias, notas especiales..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{client.email || "No registrado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Gift className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cumpleaños</p>
                      <p className="font-medium">
                        {client.birthDate 
                          ? new Date(client.birthDate).toLocaleDateString("es-MX", { day: "2-digit", month: "long" })
                          : "No registrado"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Barbero Preferido</p>
                      <p className="font-medium">{client.preferredBarber || "Sin preferencia"}</p>
                    </div>
                  </div>
                </div>
                {client.notes && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Notas</p>
                    <p>{client.notes}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Tab: Historial */}
          <TabsContent value="history" className="space-y-4 pt-4">
            <div className="h-48">
              <p className="text-sm font-medium mb-2">Gasto Mensual</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`$${value}`, "Gasto"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Barbero</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead>Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitHistory.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell>
                        {new Date(visit.date).toLocaleDateString("es-MX")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{visit.service}</Badge>
                      </TableCell>
                      <TableCell>{visit.barber}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ${visit.amount}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{visit.paymentMethod}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Tab: Preferencias */}
          <TabsContent value="preferences" className="space-y-4 pt-4">
            {isEditing && editData ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Servicios Favoritos</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dbServices.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${service}`}
                          checked={(editData.preferredServices || []).includes(service)}
                          onCheckedChange={() => handleServiceToggle(service)}
                        />
                        <label htmlFor={`edit-${service}`} className="text-sm cursor-pointer">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Barbero Preferido</Label>
                  <Select
                    value={editData.preferredBarber || ""}
                    onValueChange={(value) => setEditData({ ...editData, preferredBarber: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar barbero" />
                    </SelectTrigger>
                    <SelectContent>
                      {dbBarbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.full_name}>
                          {barber.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-3">Servicios Favoritos</p>
                  <div className="flex flex-wrap gap-2">
                    {(client.preferredServices || ["Corte + Barba", "Fade"]).map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Barbero Preferido</p>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(client.preferredBarber || "CM").split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{client.preferredBarber || "Carlos Mendoza"}</p>
                  </div>
                </div>
                {client.notes && (
                  <div>
                    <p className="text-sm font-medium mb-2">Notas Especiales</p>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p>{client.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Tab: Fidelización */}
          <TabsContent value="loyalty" className="space-y-6 pt-4">
            {/* Points Progress */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Puntos Acumulados</span>
                </div>
                <span className="font-display text-2xl text-primary">{client.points}</span>
              </div>
              <Progress value={progressToReward} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                {nextRewardPoints - client.points} puntos más para tu próxima recompensa
              </p>
            </div>

            {/* Available Rewards */}
            <div>
              <p className="font-medium mb-3">Recompensas Disponibles</p>
              {rewards.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay recompensas configuradas aún.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {rewards.map((reward: any) => (
                    <div
                      key={reward.id}
                      className={`p-3 rounded-lg border ${
                        client.points >= reward.pointsRequired
                          ? "bg-success/10 border-success/30"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{reward.name}</span>
                        <Badge variant={client.points >= reward.pointsRequired ? "default" : "outline"}>
                          {reward.pointsRequired} pts
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{reward.description}</p>
                      <Button
                        size="sm"
                        variant={client.points >= reward.pointsRequired ? "default" : "outline"}
                        className="w-full"
                        disabled={client.points < reward.pointsRequired || isRedeeming}
                        onClick={() => handleRedeemReward(reward)}
                      >
                        {isRedeeming ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                        Canjear
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Points Summary */}
            <div>
              <p className="font-medium mb-3">Resumen</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm">Puntos acumulados</span>
                  <span className="font-display text-lg text-success">⭐ {client.points}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm">Nivel actual</span>
                  <Badge className={`${level.color} text-foreground`}>{level.icon} {level.label}</Badge>
                </div>
              </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
