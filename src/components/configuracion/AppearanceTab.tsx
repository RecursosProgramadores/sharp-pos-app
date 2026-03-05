import { useState, useEffect } from "react";
import {
  Palette, Sun, Moon, Monitor, Contrast, Languages,
  LayoutDashboard, RotateCcw, Save, GripVertical, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";

const defaultAppearance = {
  theme: "light",
  highContrast: false,
  language: "es-pe",
  colors: { primary: "#D21A20", secondary: "#F96C1A", background: "#FAFAFA", text: "#1E293B" },
  widgets: { revenue: true, sales: true, clients: true, barbers: true, chart: true, recent: true, alerts: true, ranking: true },
};

const widgetNames: Record<string, string> = {
  revenue: "Ingresos del Día", sales: "Ventas Totales", clients: "Clientes Atendidos",
  barbers: "Estado de Barberos", chart: "Gráfico de Ingresos", recent: "Ventas Recientes",
  alerts: "Alertas del Sistema", ranking: "Ranking de Barberos",
};

export default function AppearanceTab() {
  const { data: saved, isLoading, save, isSaving } = useSettings("appearance", defaultAppearance);
  const [config, setConfig] = useState(defaultAppearance);

  useEffect(() => {
    if (saved) setConfig({ ...defaultAppearance, ...saved });
  }, [saved]);

  const handleThemeChange = (newTheme: string) => {
    setConfig(prev => ({ ...prev, theme: newTheme }));
    document.documentElement.classList.remove("dark", "high-contrast");
    if (newTheme === "dark") document.documentElement.classList.add("dark");
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    setConfig(prev => ({ ...prev, highContrast: enabled }));
    document.documentElement.classList.toggle("high-contrast", enabled);
  };

  const toggleWidget = (id: string) => {
    setConfig(prev => ({ ...prev, widgets: { ...prev.widgets, [id]: !(prev.widgets as any)[id] } }));
  };

  const handleReset = () => {
    setConfig(defaultAppearance);
    document.documentElement.classList.remove("dark", "high-contrast");
    save(defaultAppearance);
  };

  const handleSave = () => save(config);

  if (isLoading) return <div className="space-y-6">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Tema de la Aplicación</CardTitle>
          <CardDescription>Elige el modo de visualización preferido</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { id: "light", icon: Sun, color: "text-yellow-500", label: "Claro", desc: "Fondo blanco, texto oscuro" },
              { id: "dark", icon: Moon, color: "text-blue-500", label: "Oscuro", desc: "Fondo oscuro, texto claro" },
              { id: "system", icon: Monitor, color: "text-muted-foreground", label: "Automático", desc: "Según tu sistema operativo" },
            ].map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => handleThemeChange(t.id)}
                  className={`p-6 border rounded-xl transition-all ${config.theme === t.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-muted-foreground"}`}>
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${t.color}`} />
                  <p className="font-medium">{t.label}</p>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Contrast className="h-5 w-5 text-muted-foreground" />
              <div><p className="font-medium">Modo de Alto Contraste</p><p className="text-sm text-muted-foreground">Mayor legibilidad para accesibilidad</p></div>
            </div>
            <Switch checked={config.highContrast} onCheckedChange={handleHighContrastToggle} />
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl">Colores Personalizados</CardTitle>
          <CardDescription>Personaliza los colores de la aplicación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            {Object.entries({ primary: "Color Primario", secondary: "Color Secundario", background: "Color de Fondo", text: "Color de Texto" }).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <div className="flex gap-2">
                  <input type="color" value={(config.colors as any)[key]} onChange={(e) => setConfig(prev => ({ ...prev, colors: { ...prev.colors, [key]: e.target.value } }))} className="h-10 w-14 rounded-lg cursor-pointer border border-border" />
                  <Input value={(config.colors as any)[key]} onChange={(e) => setConfig(prev => ({ ...prev, colors: { ...prev.colors, [key]: e.target.value } }))} className="flex-1 font-mono uppercase" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="card-elevated">
        <CardHeader><CardTitle className="font-display text-xl flex items-center gap-2"><Languages className="h-5 w-5 text-primary" />Idioma</CardTitle></CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Select value={config.language} onValueChange={(v) => setConfig(prev => ({ ...prev, language: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="es-pe">Español (Perú)</SelectItem>
                <SelectItem value="es-mx">Español (México)</SelectItem>
                <SelectItem value="es-es">Español (España)</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Widgets */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2"><LayoutDashboard className="h-5 w-5 text-primary" />Preferencias del Dashboard</CardTitle>
          <CardDescription>Elige qué widgets mostrar en el dashboard principal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(widgetNames).map(([id, name]) => (
              <div key={id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{name}</span>
                </div>
                <Switch checked={(config.widgets as any)[id] ?? true} onCheckedChange={() => toggleWidget(id)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2"><RotateCcw className="h-4 w-4" />Restaurar por Defecto</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Restaurar configuración?</AlertDialogTitle>
              <AlertDialogDescription>Esto restablecerá todos los ajustes de apariencia a sus valores originales.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Restaurar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button size="lg" className="gap-2" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
