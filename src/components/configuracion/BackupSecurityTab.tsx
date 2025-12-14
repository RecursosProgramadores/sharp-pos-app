import { useState } from "react";
import {
  Shield,
  Database,
  Download,
  Upload,
  Clock,
  Key,
  Eye,
  FileJson,
  FileSpreadsheet,
  FileText,
  Save,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export default function BackupSecurityTab() {
  const [backupSettings, setBackupSettings] = useState({
    frequency: "daily",
    time: "03:00",
    lastBackup: "2024-01-15 03:00:00",
  });

  const [exportFormat, setExportFormat] = useState("csv");

  const [securitySettings, setSecuritySettings] = useState({
    passwordExpiry: { enabled: true, days: 90 },
    twoFactor: false,
    autoLogout: { enabled: true, minutes: 30 },
    logFailedAttempts: true,
  });

  const [privacyPolicy, setPrivacyPolicy] = useState(
    "Política de privacidad de Barber Pro.\n\nSus datos personales serán tratados de forma confidencial..."
  );

  const handleManualBackup = () => {
    toast({
      title: "Backup en progreso",
      description: "Se está creando el respaldo de datos...",
    });
    setTimeout(() => {
      toast({
        title: "Backup completado",
        description: "El respaldo se ha descargado correctamente",
      });
    }, 2000);
  };

  const handleExport = (module: string) => {
    toast({
      title: `Exportando ${module}`,
      description: `Los datos de ${module} se están descargando en formato ${exportFormat.toUpperCase()}`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Los ajustes de seguridad se han actualizado correctamente",
    });
  };

  return (
    <div className="space-y-6">
      {/* Backup Configuration */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Respaldo de Datos
          </CardTitle>
          <CardDescription>
            Configura backups automáticos y manuales del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Frecuencia de Backup Automático</Label>
              <Select
                value={backupSettings.frequency}
                onValueChange={(value) =>
                  setBackupSettings({ ...backupSettings, frequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hora del Backup</Label>
              <Input
                type="time"
                value={backupSettings.time}
                onChange={(e) =>
                  setBackupSettings({ ...backupSettings, time: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Último Backup Exitoso</Label>
              <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{backupSettings.lastBackup}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="gap-2" onClick={handleManualBackup}>
              <Download className="h-4 w-4" />
              Crear Backup Manual Ahora
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Restaurar desde Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Exportación de Datos
          </CardTitle>
          <CardDescription>
            Exporta módulos individuales en el formato de tu preferencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Formato de Exportación</Label>
            <RadioGroup
              value={exportFormat}
              onValueChange={setExportFormat}
              className="flex gap-4"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="csv" />
                <FileSpreadsheet className="h-4 w-4" />
                <span>CSV</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="excel" />
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="json" />
                <FileJson className="h-4 w-4" />
                <span>JSON</span>
              </label>
            </RadioGroup>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleExport("Barberos")}
            >
              <Download className="h-4 w-4" />
              Exportar Barberos
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleExport("Productos")}
            >
              <Download className="h-4 w-4" />
              Exportar Productos
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleExport("Ventas")}
            >
              <Download className="h-4 w-4" />
              Exportar Ventas
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleExport("Clientes")}
            >
              <Download className="h-4 w-4" />
              Exportar Clientes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Configuración de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Password Expiry */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Cambio de Contraseña Periódico</p>
                <p className="text-sm text-muted-foreground">
                  Requiere cambio de contraseña cada cierto tiempo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {securitySettings.passwordExpiry.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Cada</span>
                  <Input
                    type="number"
                    className="w-20"
                    value={securitySettings.passwordExpiry.days}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordExpiry: {
                          ...securitySettings.passwordExpiry,
                          days: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                  <span className="text-sm">días</span>
                </div>
              )}
              <Switch
                checked={securitySettings.passwordExpiry.enabled}
                onCheckedChange={(checked) =>
                  setSecuritySettings({
                    ...securitySettings,
                    passwordExpiry: {
                      ...securitySettings.passwordExpiry,
                      enabled: checked,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  Autenticación de Dos Factores (2FA)
                </p>
                <p className="text-sm text-muted-foreground">
                  Añade una capa extra de seguridad al iniciar sesión
                </p>
              </div>
            </div>
            <Switch
              checked={securitySettings.twoFactor}
              onCheckedChange={(checked) =>
                setSecuritySettings({ ...securitySettings, twoFactor: checked })
              }
            />
          </div>

          {/* Auto Logout */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Cierre de Sesión Automático</p>
                <p className="text-sm text-muted-foreground">
                  Cerrar sesión tras inactividad
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {securitySettings.autoLogout.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tras</span>
                  <Input
                    type="number"
                    className="w-20"
                    value={securitySettings.autoLogout.minutes}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        autoLogout: {
                          ...securitySettings.autoLogout,
                          minutes: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                  <span className="text-sm">min</span>
                </div>
              )}
              <Switch
                checked={securitySettings.autoLogout.enabled}
                onCheckedChange={(checked) =>
                  setSecuritySettings({
                    ...securitySettings,
                    autoLogout: {
                      ...securitySettings.autoLogout,
                      enabled: checked,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Log Failed Attempts */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Registrar Intentos Fallidos</p>
                <p className="text-sm text-muted-foreground">
                  Guarda un log de intentos de login fallidos
                </p>
              </div>
            </div>
            <Switch
              checked={securitySettings.logFailedAttempts}
              onCheckedChange={(checked) =>
                setSecuritySettings({
                  ...securitySettings,
                  logFailedAttempts: checked,
                })
              }
            />
          </div>

          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Ver Log de Seguridad
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Política de Privacidad
          </CardTitle>
          <CardDescription>
            Texto que se mostrará a los clientes sobre el manejo de sus datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            rows={6}
            placeholder="Ingresa la política de privacidad de tu negocio..."
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">
              Los clientes aceptan compartir su información para el programa de
              fidelización
            </span>
          </label>
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
