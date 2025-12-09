import { useState } from "react";
import {
  Store,
  Clock,
  DollarSign,
  Bell,
  Palette,
  Shield,
  Save,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const services = [
  { id: 1, name: "Corte Clásico", price: 25, duration: 30 },
  { id: 2, name: "Fade Degradado", price: 35, duration: 45 },
  { id: 3, name: "Corte + Barba", price: 45, duration: 60 },
  { id: 4, name: "Barba Completa", price: 20, duration: 25 },
  { id: 5, name: "Afeitado Tradicional", price: 15, duration: 20 },
  { id: 6, name: "Tratamiento Capilar", price: 30, duration: 30 },
];

export default function Configuracion() {
  const [notifications, setNotifications] = useState({
    newSale: true,
    lowStock: true,
    newClient: false,
    dailyReport: true,
  });

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Los cambios se han aplicado correctamente",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            Configuración
          </h1>
          <p className="text-muted-foreground mt-1">
            Personaliza tu sistema de gestión
          </p>
        </div>
        <Button className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Info */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle className="font-display text-xl">
                Información del Negocio
              </CardTitle>
            </div>
            <CardDescription>Datos básicos de tu barbería</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="businessName">Nombre de la Barbería</Label>
              <Input id="businessName" defaultValue="Barber Pro" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" defaultValue="Av. Principal #123, Centro" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" defaultValue="+52 55 1234 5678" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="contacto@barberpro.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="font-display text-xl">
                Horario de Atención
              </CardTitle>
            </div>
            <CardDescription>Define tu horario de trabajo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Hora de Apertura</Label>
                <Select defaultValue="09:00">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 7).map((hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Hora de Cierre</Label>
                <Select defaultValue="20:00">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 12).map((hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Días de Operación</Label>
              <div className="flex flex-wrap gap-2">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, i) => (
                  <Button
                    key={day}
                    variant={i < 6 ? "default" : "outline"}
                    size="sm"
                    className="w-12"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="card-elevated lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle className="font-display text-xl">
                  Servicios y Precios
                </CardTitle>
              </div>
              <Button size="sm" variant="secondary" className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Servicio
              </Button>
            </div>
            <CardDescription>Gestiona tus servicios disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">${service.price}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {service.duration} min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="font-display text-xl">
                Notificaciones
              </CardTitle>
            </div>
            <CardDescription>Configura tus alertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nueva venta</p>
                <p className="text-sm text-muted-foreground">
                  Notificar cada transacción
                </p>
              </div>
              <Switch
                checked={notifications.newSale}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, newSale: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stock bajo</p>
                <p className="text-sm text-muted-foreground">
                  Alertar cuando haya poco inventario
                </p>
              </div>
              <Switch
                checked={notifications.lowStock}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, lowStock: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nuevo cliente</p>
                <p className="text-sm text-muted-foreground">
                  Cuando se registre un cliente
                </p>
              </div>
              <Switch
                checked={notifications.newClient}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, newClient: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reporte diario</p>
                <p className="text-sm text-muted-foreground">
                  Resumen al final del día
                </p>
              </div>
              <Switch
                checked={notifications.dailyReport}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, dailyReport: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="font-display text-xl">
                Seguridad
              </CardTitle>
            </div>
            <CardDescription>Configuración de acceso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button variant="outline" className="w-full mt-2">
              Cambiar Contraseña
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
