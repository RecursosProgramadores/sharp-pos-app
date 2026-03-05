import { useState, useEffect } from "react";
import {
  Bell, Mail, MessageSquare, Smartphone, Save, AlertTriangle,
  Package, DollarSign, Cake, Clock, Wallet, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";

const defaultNotifications = {
  lowStock: { enabled: true, threshold: 5 },
  outOfStock: { enabled: true },
  importantSales: { enabled: true, threshold: 100 },
  birthdays: { enabled: true, threshold: 3 },
  barberDelay: { enabled: true, threshold: 15 },
  excessCash: { enabled: false, threshold: 500 },
  channels: {
    inApp: true,
    email: { enabled: true, address: "" },
    sms: { enabled: false, phone: "" },
    push: { enabled: false },
  },
  frequency: "immediate",
};

export default function NotificationsTab() {
  const { data: saved, isLoading, save, isSaving } = useSettings("notifications", defaultNotifications);
  const [config, setConfig] = useState(defaultNotifications);

  useEffect(() => {
    if (saved) setConfig({ ...defaultNotifications, ...saved });
  }, [saved]);

  const updateAlert = (key: string, field: string, value: boolean | number) => {
    setConfig(prev => ({
      ...prev,
      [key]: { ...(prev as any)[key], [field]: value },
    }));
  };

  const handleSave = () => save(config);

  if (isLoading) return <div className="space-y-6">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>;

  const alertItems = [
    { key: "lowStock", icon: Package, color: "text-warning", label: "Stock Bajo", desc: "Alertar cuando el inventario esté por agotarse", thresholdLabel: "Umbral:", thresholdUnit: "unidades" },
    { key: "outOfStock", icon: Package, color: "text-destructive", label: "Productos Agotados", desc: "Notificar cuando un producto se agote" },
    { key: "importantSales", icon: DollarSign, color: "text-success", label: "Ventas Importantes", desc: "Alertar en ventas grandes", thresholdLabel: "Mayor a:", thresholdUnit: "S/" },
    { key: "birthdays", icon: Cake, color: "text-secondary", label: "Cumpleaños de Clientes", desc: "Recordar cumpleaños próximos", thresholdLabel: "Anticipación:", thresholdUnit: "días" },
    { key: "barberDelay", icon: Clock, color: "text-warning", label: "Barberos con Retraso", desc: "Alertar si un barbero no registra entrada", thresholdLabel: "Tolerancia:", thresholdUnit: "min" },
    { key: "excessCash", icon: Wallet, color: "text-info", label: "Caja con Exceso de Efectivo", desc: "Alertar si hay demasiado efectivo en caja", thresholdLabel: "Máximo:", thresholdUnit: "S/" },
  ];

  return (
    <div className="space-y-6">
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Alertas del Sistema
          </CardTitle>
          <CardDescription>Configura cuándo deseas recibir notificaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alertItems.map(item => {
            const alertData = (config as any)[item.key];
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {alertData.enabled && item.thresholdLabel && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.thresholdLabel}</span>
                      <Input type="number" className="w-20" value={alertData.threshold || 0} onChange={(e) => updateAlert(item.key, "threshold", parseInt(e.target.value) || 0)} />
                      <span className="text-sm">{item.thresholdUnit}</span>
                    </div>
                  )}
                  <Switch checked={alertData.enabled} onCheckedChange={(checked) => updateAlert(item.key, "enabled", checked)} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Canales de Notificación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div><p className="font-medium">Notificaciones In-App</p><p className="text-sm text-muted-foreground">Siempre activas dentro del sistema</p></div>
            </div>
            <Switch checked={config.channels.inApp} disabled />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <div><p className="font-medium">Email</p><p className="text-sm text-muted-foreground">Recibir alertas por correo electrónico</p></div>
            </div>
            <div className="flex items-center gap-4">
              {config.channels.email.enabled && (
                <Input type="email" className="w-60" placeholder="correo@ejemplo.com" value={config.channels.email.address}
                  onChange={(e) => setConfig(prev => ({ ...prev, channels: { ...prev.channels, email: { ...prev.channels.email, address: e.target.value } } }))} />
              )}
              <Switch checked={config.channels.email.enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, channels: { ...prev.channels, email: { ...prev.channels.email, enabled: checked } } }))} />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5" />
              <div><p className="font-medium">SMS</p><p className="text-sm text-muted-foreground">Recibir alertas por mensaje de texto</p></div>
            </div>
            <div className="flex items-center gap-4">
              {config.channels.sms.enabled && (
                <Input type="tel" className="w-48" placeholder="+51 999 999 999" value={config.channels.sms.phone}
                  onChange={(e) => setConfig(prev => ({ ...prev, channels: { ...prev.channels, sms: { ...prev.channels.sms, phone: e.target.value } } }))} />
              )}
              <Switch checked={config.channels.sms.enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, channels: { ...prev.channels, sms: { ...prev.channels.sms, enabled: checked } } }))} />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5" />
              <div><p className="font-medium">Push Notifications</p><p className="text-sm text-muted-foreground">Para app móvil (próximamente)</p></div>
            </div>
            <Switch checked={false} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Frequency */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl">Frecuencia</CardTitle>
          <CardDescription>Define cuándo recibir las notificaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { value: "immediate", label: "Inmediata", desc: "Recibe cada alerta al momento" },
              { value: "daily", label: "Resumen Diario", desc: "Un resumen al final de cada día" },
              { value: "weekly", label: "Resumen Semanal", desc: "Un resumen cada semana" },
            ].map(opt => (
              <label key={opt.value} className={`p-4 border rounded-lg cursor-pointer transition-colors ${config.frequency === opt.value ? "border-primary bg-primary/5" : "hover:border-muted-foreground"}`}>
                <input type="radio" name="frequency" value={opt.value} checked={config.frequency === opt.value}
                  onChange={(e) => setConfig(prev => ({ ...prev, frequency: e.target.value }))} className="sr-only" />
                <p className="font-medium">{opt.label}</p>
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" className="gap-2" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
