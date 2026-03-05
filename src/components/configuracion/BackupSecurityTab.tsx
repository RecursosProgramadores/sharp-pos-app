import { useState, useEffect } from "react";
import {
  Shield, Database, Download, Upload, Clock, Key, Eye,
  FileJson, FileSpreadsheet, FileText, Save, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

const defaultSecurity = {
  passwordExpiry: { enabled: true, days: 90 },
  twoFactor: false,
  autoLogout: { enabled: true, minutes: 30 },
  logFailedAttempts: true,
  privacyPolicy: "Política de privacidad de Tayta BarberShop.\n\nSus datos personales serán tratados de forma confidencial.",
};

export default function BackupSecurityTab() {
  const { data: saved, isLoading, save, isSaving } = useSettings("security", defaultSecurity);
  const [config, setConfig] = useState(defaultSecurity);
  const [exportFormat, setExportFormat] = useState("csv");
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    if (saved) setConfig({ ...defaultSecurity, ...saved, passwordExpiry: { ...defaultSecurity.passwordExpiry, ...(saved as any).passwordExpiry }, autoLogout: { ...defaultSecurity.autoLogout, ...(saved as any).autoLogout } });
  }, [saved]);

  const handleSave = () => save(config);

  const handleExport = async (module: string) => {
    setExporting(module);
    try {
      let data: any[] = [];
      let filename = module.toLowerCase();

      switch (module) {
        case "Barberos": {
          const { data: d } = await supabase.from("barbers").select("full_name, phone, email, specialty, active, hire_date, commission_percentage, work_type");
          data = d || [];
          break;
        }
        case "Productos": {
          const { data: d } = await supabase.from("products").select("name, category, stock, min_stock, purchase_price, sale_price, sku, barcode, active");
          data = d || [];
          break;
        }
        case "Ventas": {
          const { data: haircuts } = await supabase.from("haircuts").select("service_name, price, payment_method, created_at");
          const { data: sales } = await supabase.from("sales").select("total, payment_method, created_at");
          data = [
            ...(haircuts || []).map(h => ({ tipo: "Servicio", detalle: h.service_name, monto: h.price, metodo_pago: h.payment_method, fecha: h.created_at })),
            ...(sales || []).map(s => ({ tipo: "Producto", detalle: "Venta de productos", monto: s.total, metodo_pago: s.payment_method, fecha: s.created_at })),
          ];
          break;
        }
        case "Clientes": {
          const { data: d } = await supabase.from("clients").select("full_name, phone, email, visits, total_spent, points, level, last_visit, birth_date");
          data = d || [];
          break;
        }
      }

      if (data.length === 0) {
        toast({ title: "Sin datos", description: `No hay datos de ${module} para exportar`, variant: "destructive" });
        return;
      }

      if (exportFormat === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        downloadBlob(blob, `${filename}.json`);
      } else if (exportFormat === "csv" || exportFormat === "excel") {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, module);
        if (exportFormat === "csv") {
          const csv = XLSX.utils.sheet_to_csv(ws);
          const blob = new Blob([csv], { type: "text/csv" });
          downloadBlob(blob, `${filename}.csv`);
        } else {
          XLSX.writeFile(wb, `${filename}.xlsx`);
        }
      }

      toast({ title: "Exportación completada", description: `${module} exportado en formato ${exportFormat.toUpperCase()}` });
    } catch (error) {
      toast({ title: "Error al exportar", description: "Ocurrió un error durante la exportación", variant: "destructive" });
    } finally {
      setExporting(null);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleManualBackup = async () => {
    toast({ title: "Generando backup...", description: "Recopilando todos los datos del sistema" });
    try {
      const tables = ["barbers", "products", "clients", "services", "haircuts", "sales", "sale_items", "reservations"];
      const backup: Record<string, any> = { exportDate: new Date().toISOString(), version: "1.0" };
      for (const table of tables) {
        const { data } = await supabase.from(table as any).select("*");
        backup[table] = data || [];
      }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      downloadBlob(blob, `backup-tayta-${new Date().toISOString().split("T")[0]}.json`);
      toast({ title: "Backup completado", description: "El archivo de respaldo se ha descargado" });
    } catch {
      toast({ title: "Error", description: "Error al generar el backup", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="space-y-6">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Backup */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2"><Database className="h-5 w-5 text-primary" />Respaldo de Datos</CardTitle>
          <CardDescription>Descarga un backup completo de todos los datos del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="gap-2" onClick={handleManualBackup}><Download className="h-4 w-4" />Crear Backup Manual Ahora</Button>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2"><Download className="h-5 w-5 text-primary" />Exportación de Datos</CardTitle>
          <CardDescription>Exporta módulos individuales en tu formato preferido</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Formato de Exportación</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="csv" /><FileSpreadsheet className="h-4 w-4" /><span>CSV</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="excel" /><FileSpreadsheet className="h-4 w-4" /><span>Excel</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="json" /><FileJson className="h-4 w-4" /><span>JSON</span></label>
            </RadioGroup>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {["Barberos", "Productos", "Ventas", "Clientes"].map(m => (
              <Button key={m} variant="outline" className="gap-2" onClick={() => handleExport(m)} disabled={exporting === m}>
                {exporting === m ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Exportar {m}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="card-elevated">
        <CardHeader><CardTitle className="font-display text-xl flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Configuración de Seguridad</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div><p className="font-medium">Cambio de Contraseña Periódico</p><p className="text-sm text-muted-foreground">Requiere cambio cada cierto tiempo</p></div>
            </div>
            <div className="flex items-center gap-4">
              {config.passwordExpiry.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Cada</span>
                  <Input type="number" className="w-20" value={config.passwordExpiry.days} onChange={(e) => setConfig(prev => ({ ...prev, passwordExpiry: { ...prev.passwordExpiry, days: parseInt(e.target.value) || 0 } }))} />
                  <span className="text-sm">días</span>
                </div>
              )}
              <Switch checked={config.passwordExpiry.enabled} onCheckedChange={(v) => setConfig(prev => ({ ...prev, passwordExpiry: { ...prev.passwordExpiry, enabled: v } }))} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div><p className="font-medium">Autenticación de Dos Factores (2FA)</p><p className="text-sm text-muted-foreground">Capa extra de seguridad</p></div>
            </div>
            <Switch checked={config.twoFactor} onCheckedChange={(v) => setConfig(prev => ({ ...prev, twoFactor: v }))} />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div><p className="font-medium">Cierre de Sesión Automático</p><p className="text-sm text-muted-foreground">Cerrar sesión tras inactividad</p></div>
            </div>
            <div className="flex items-center gap-4">
              {config.autoLogout.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tras</span>
                  <Input type="number" className="w-20" value={config.autoLogout.minutes} onChange={(e) => setConfig(prev => ({ ...prev, autoLogout: { ...prev.autoLogout, minutes: parseInt(e.target.value) || 0 } }))} />
                  <span className="text-sm">min</span>
                </div>
              )}
              <Switch checked={config.autoLogout.enabled} onCheckedChange={(v) => setConfig(prev => ({ ...prev, autoLogout: { ...prev.autoLogout, enabled: v } }))} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div><p className="font-medium">Registrar Intentos Fallidos</p><p className="text-sm text-muted-foreground">Log de intentos de login fallidos</p></div>
            </div>
            <Switch checked={config.logFailedAttempts} onCheckedChange={(v) => setConfig(prev => ({ ...prev, logFailedAttempts: v }))} />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Política de Privacidad</CardTitle>
          <CardDescription>Texto sobre el manejo de datos de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={config.privacyPolicy} onChange={(e) => setConfig(prev => ({ ...prev, privacyPolicy: e.target.value }))} rows={6} />
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
