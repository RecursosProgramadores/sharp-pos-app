import { useState } from "react";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Contrast,
  Languages,
  LayoutDashboard,
  RotateCcw,
  Save,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const dashboardWidgets = [
  { id: "revenue", name: "Ingresos del Día", visible: true },
  { id: "sales", name: "Ventas Totales", visible: true },
  { id: "clients", name: "Clientes Atendidos", visible: true },
  { id: "barbers", name: "Estado de Barberos", visible: true },
  { id: "chart", name: "Gráfico de Ingresos", visible: true },
  { id: "recent", name: "Ventas Recientes", visible: true },
  { id: "alerts", name: "Alertas del Sistema", visible: false },
  { id: "ranking", name: "Ranking de Barberos", visible: true },
];

export default function AppearanceTab() {
  const [theme, setTheme] = useState("light");
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState("es-pe");
  const [widgets, setWidgets] = useState(dashboardWidgets);

  const [colors, setColors] = useState({
    primary: "#D21A20",
    secondary: "#F96C1A",
    background: "#FAFAFA",
    text: "#1E293B",
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.classList.remove("dark", "high-contrast");
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
    toast({
      title: "Tema actualizado",
      description: `Se ha cambiado al tema ${
        newTheme === "light" ? "claro" : newTheme === "dark" ? "oscuro" : "automático"
      }`,
    });
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    setHighContrast(enabled);
    document.documentElement.classList.toggle("high-contrast", enabled);
    toast({
      title: enabled ? "Alto contraste activado" : "Alto contraste desactivado",
    });
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, visible: !w.visible } : w))
    );
  };

  const handleReset = () => {
    setTheme("light");
    setHighContrast(false);
    setLanguage("es-pe");
    setColors({
      primary: "#D21A20",
      secondary: "#F96C1A",
      background: "#FAFAFA",
      text: "#1E293B",
    });
    setWidgets(dashboardWidgets);
    document.documentElement.classList.remove("dark", "high-contrast");
    toast({
      title: "Configuración restaurada",
      description: "Se han restaurado los valores por defecto",
    });
  };

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Las preferencias de apariencia se han actualizado",
    });
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Tema de la Aplicación
          </CardTitle>
          <CardDescription>
            Elige el modo de visualización preferido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`p-6 border rounded-xl transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:border-muted-foreground"
              }`}
            >
              <Sun className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
              <p className="font-medium">Claro</p>
              <p className="text-sm text-muted-foreground">
                Fondo blanco, texto oscuro
              </p>
            </button>

            <button
              onClick={() => handleThemeChange("dark")}
              className={`p-6 border rounded-xl transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:border-muted-foreground"
              }`}
            >
              <Moon className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <p className="font-medium">Oscuro</p>
              <p className="text-sm text-muted-foreground">
                Fondo oscuro, texto claro
              </p>
            </button>

            <button
              onClick={() => handleThemeChange("system")}
              className={`p-6 border rounded-xl transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:border-muted-foreground"
              }`}
            >
              <Monitor className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium">Automático</p>
              <p className="text-sm text-muted-foreground">
                Según tu sistema operativo
              </p>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Contrast className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Modo de Alto Contraste</p>
                <p className="text-sm text-muted-foreground">
                  Mayor legibilidad para accesibilidad
                </p>
              </div>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={handleHighContrastToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Colores Personalizados
          </CardTitle>
          <CardDescription>
            Personaliza los colores de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Color Primario</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) =>
                    setColors({ ...colors, primary: e.target.value })
                  }
                  className="h-10 w-14 rounded-lg cursor-pointer border border-border"
                />
                <Input
                  value={colors.primary}
                  onChange={(e) =>
                    setColors({ ...colors, primary: e.target.value })
                  }
                  className="flex-1 font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color Secundario</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) =>
                    setColors({ ...colors, secondary: e.target.value })
                  }
                  className="h-10 w-14 rounded-lg cursor-pointer border border-border"
                />
                <Input
                  value={colors.secondary}
                  onChange={(e) =>
                    setColors({ ...colors, secondary: e.target.value })
                  }
                  className="flex-1 font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color de Fondo</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colors.background}
                  onChange={(e) =>
                    setColors({ ...colors, background: e.target.value })
                  }
                  className="h-10 w-14 rounded-lg cursor-pointer border border-border"
                />
                <Input
                  value={colors.background}
                  onChange={(e) =>
                    setColors({ ...colors, background: e.target.value })
                  }
                  className="flex-1 font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color de Texto</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colors.text}
                  onChange={(e) =>
                    setColors({ ...colors, text: e.target.value })
                  }
                  className="h-10 w-14 rounded-lg cursor-pointer border border-border"
                />
                <Input
                  value={colors.text}
                  onChange={(e) =>
                    setColors({ ...colors, text: e.target.value })
                  }
                  className="flex-1 font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            Idioma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es-pe">Español (Perú)</SelectItem>
                <SelectItem value="es-mx">Español (México)</SelectItem>
                <SelectItem value="es-es">Español (España)</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Widgets */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Preferencias del Dashboard
          </CardTitle>
          <CardDescription>
            Elige qué widgets mostrar en el dashboard principal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <span className="font-medium">{widget.name}</span>
                </div>
                <Switch
                  checked={widget.visible}
                  onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Restaurar Configuración por Defecto
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Restaurar configuración?</AlertDialogTitle>
              <AlertDialogDescription>
                Esto restablecerá todos los ajustes de apariencia a sus valores
                originales. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>
                Restaurar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button size="lg" className="gap-2" onClick={handleSave}>
          <Save className="h-5 w-5" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
