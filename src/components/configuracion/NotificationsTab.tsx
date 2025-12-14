import { useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  AlertTriangle,
  Package,
  DollarSign,
  Cake,
  Clock,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface NotificationConfig {
  enabled: boolean;
  threshold?: number;
}

export default function NotificationsTab() {
  const [alerts, setAlerts] = useState({
    lowStock: { enabled: true, threshold: 5 },
    outOfStock: { enabled: true },
    importantSales: { enabled: true, threshold: 100 },
    birthdays: { enabled: true, threshold: 3 },
    barberDelay: { enabled: true, threshold: 15 },
    excessCash: { enabled: false, threshold: 500 },
  });

  const [channels, setChannels] = useState({
    inApp: true,
    email: { enabled: true, address: "admin@barberpro.com" },
    sms: { enabled: false, phone: "" },
    push: { enabled: false },
  });

  const [frequency, setFrequency] = useState("immediate");

  const updateAlert = (
    key: keyof typeof alerts,
    field: "enabled" | "threshold",
    value: boolean | number
  ) => {
    setAlerts((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Las preferencias de notificación se han actualizado",
    });
  };

  return (
    <div className="space-y-6">
      {/* System Alerts */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Alertas del Sistema
          </CardTitle>
          <CardDescription>
            Configura cuándo deseas recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Low Stock */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium">Stock Bajo</p>
                <p className="text-sm text-muted-foreground">
                  Alertar cuando el inventario esté por agotarse
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {alerts.lowStock.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Umbral:</span>
                  <Input
                    type="number"
                    className="w-20"
                    value={alerts.lowStock.threshold}
                    onChange={(e) =>
                      updateAlert(
                        "lowStock",
                        "threshold",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <span className="text-sm">unidades</span>
                </div>
              )}
              <Switch
                checked={alerts.lowStock.enabled}
                onCheckedChange={(checked) =>
                  updateAlert("lowStock", "enabled", checked)
                }
              />
            </div>
          </div>

          {/* Out of Stock */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium">Productos Agotados</p>
                <p className="text-sm text-muted-foreground">
                  Notificar cuando un producto se agote
                </p>
              </div>
            </div>
            <Switch
              checked={alerts.outOfStock.enabled}
              onCheckedChange={(checked) =>
                updateAlert("outOfStock", "enabled", checked)
              }
            />
          </div>

          {/* Important Sales */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium">Ventas Importantes</p>
                <p className="text-sm text-muted-foreground">
                  Alertar en ventas grandes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {alerts.importantSales.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Mayor a:</span>
                  <Input
                    type="number"
                    className="w-24"
                    value={alerts.importantSales.threshold}
                    onChange={(e) =>
                      updateAlert(
                        "importantSales",
                        "threshold",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <span className="text-sm">$</span>
                </div>
              )}
              <Switch
                checked={alerts.importantSales.enabled}
                onCheckedChange={(checked) =>
                  updateAlert("importantSales", "enabled", checked)
                }
              />
            </div>
          </div>

          {/* Birthdays */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Cake className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-medium">Cumpleaños de Clientes</p>
                <p className="text-sm text-muted-foreground">
                  Recordar cumpleaños próximos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {alerts.birthdays.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Anticipación:
                  </span>
                  <Input
                    type="number"
                    className="w-16"
                    value={alerts.birthdays.threshold}
                    onChange={(e) =>
                      updateAlert(
                        "birthdays",
                        "threshold",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <span className="text-sm">días</span>
                </div>
              )}
              <Switch
                checked={alerts.birthdays.enabled}
                onCheckedChange={(checked) =>
                  updateAlert("birthdays", "enabled", checked)
                }
              />
            </div>
          </div>

          {/* Barber Delay */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium">Barberos con Retraso</p>
                <p className="text-sm text-muted-foreground">
                  Alertar si un barbero no registra entrada
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {alerts.barberDelay.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Tolerancia:
                  </span>
                  <Input
                    type="number"
                    className="w-16"
                    value={alerts.barberDelay.threshold}
                    onChange={(e) =>
                      updateAlert(
                        "barberDelay",
                        "threshold",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <span className="text-sm">min</span>
                </div>
              )}
              <Switch
                checked={alerts.barberDelay.enabled}
                onCheckedChange={(checked) =>
                  updateAlert("barberDelay", "enabled", checked)
                }
              />
            </div>
          </div>

          {/* Excess Cash */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-info" />
              <div>
                <p className="font-medium">Caja con Exceso de Efectivo</p>
                <p className="text-sm text-muted-foreground">
                  Alertar si hay demasiado efectivo en caja
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {alerts.excessCash.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Máximo:
                  </span>
                  <Input
                    type="number"
                    className="w-24"
                    value={alerts.excessCash.threshold}
                    onChange={(e) =>
                      updateAlert(
                        "excessCash",
                        "threshold",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <span className="text-sm">$</span>
                </div>
              )}
              <Switch
                checked={alerts.excessCash.enabled}
                onCheckedChange={(checked) =>
                  updateAlert("excessCash", "enabled", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Canales de Notificación
          </CardTitle>
          <CardDescription>
            Elige cómo deseas recibir las alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* In-App */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <p className="font-medium">Notificaciones In-App</p>
                <p className="text-sm text-muted-foreground">
                  Siempre activas dentro del sistema
                </p>
              </div>
            </div>
            <Switch checked={channels.inApp} disabled />
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  Recibir alertas por correo electrónico
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {channels.email.enabled && (
                <Input
                  type="email"
                  className="w-60"
                  placeholder="correo@ejemplo.com"
                  value={channels.email.address}
                  onChange={(e) =>
                    setChannels({
                      ...channels,
                      email: { ...channels.email, address: e.target.value },
                    })
                  }
                />
              )}
              <Switch
                checked={channels.email.enabled}
                onCheckedChange={(checked) =>
                  setChannels({
                    ...channels,
                    email: { ...channels.email, enabled: checked },
                  })
                }
              />
            </div>
          </div>

          {/* SMS */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5" />
              <div>
                <p className="font-medium">SMS</p>
                <p className="text-sm text-muted-foreground">
                  Recibir alertas por mensaje de texto (requiere integración)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {channels.sms.enabled && (
                <Input
                  type="tel"
                  className="w-48"
                  placeholder="+52 55 1234 5678"
                  value={channels.sms.phone}
                  onChange={(e) =>
                    setChannels({
                      ...channels,
                      sms: { ...channels.sms, phone: e.target.value },
                    })
                  }
                />
              )}
              <Switch
                checked={channels.sms.enabled}
                onCheckedChange={(checked) =>
                  setChannels({
                    ...channels,
                    sms: { ...channels.sms, enabled: checked },
                  })
                }
              />
            </div>
          </div>

          {/* Push */}
          <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Para app móvil (próximamente)
                </p>
              </div>
            </div>
            <Switch checked={channels.push.enabled} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Frequency */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl">Frecuencia</CardTitle>
          <CardDescription>
            Define cuándo recibir las notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                frequency === "immediate"
                  ? "border-primary bg-primary/5"
                  : "hover:border-muted-foreground"
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value="immediate"
                checked={frequency === "immediate"}
                onChange={(e) => setFrequency(e.target.value)}
                className="sr-only"
              />
              <p className="font-medium">Inmediata</p>
              <p className="text-sm text-muted-foreground">
                Recibe cada alerta al momento
              </p>
            </label>

            <label
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                frequency === "daily"
                  ? "border-primary bg-primary/5"
                  : "hover:border-muted-foreground"
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={frequency === "daily"}
                onChange={(e) => setFrequency(e.target.value)}
                className="sr-only"
              />
              <p className="font-medium">Resumen Diario</p>
              <p className="text-sm text-muted-foreground">
                Un resumen al final de cada día
              </p>
            </label>

            <label
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                frequency === "weekly"
                  ? "border-primary bg-primary/5"
                  : "hover:border-muted-foreground"
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value="weekly"
                checked={frequency === "weekly"}
                onChange={(e) => setFrequency(e.target.value)}
                className="sr-only"
              />
              <p className="font-medium">Resumen Semanal</p>
              <p className="text-sm text-muted-foreground">
                Un resumen cada semana
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" className="gap-2" onClick={handleSave}>
          <Save className="h-5 w-5" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
