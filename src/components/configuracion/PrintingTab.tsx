import { useState, useEffect } from "react";
import {
  Printer, QrCode, FileText, Save, TestTube, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "@/hooks/use-toast";

const defaultPrinting = {
  printerType: "thermal58",
  connectionMethod: "usb",
  printerName: "POS-58",
  receipt: {
    includeLogo: true,
    headerText: "TAYTA BARBERSHOP",
    footerText: "¡Gracias por tu visita!\nVuelve pronto",
    includeQR: true,
    qrUrl: "",
    includeFiscalData: true,
    fontSize: "medium",
  },
  vouchers: {
    boletaPrefix: "B001",
    facturaPrefix: "F001",
    notaCreditoPrefix: "NC01",
    currentBoletaNumber: 1,
    currentFacturaNumber: 1,
    currentNotaNumber: 1,
  },
};

export default function PrintingTab() {
  const { data: saved, isLoading, save, isSaving } = useSettings("printing", defaultPrinting);
  const [config, setConfig] = useState(defaultPrinting);

  useEffect(() => {
    if (saved) setConfig({ ...defaultPrinting, ...saved, receipt: { ...defaultPrinting.receipt, ...(saved as any).receipt }, vouchers: { ...defaultPrinting.vouchers, ...(saved as any).vouchers } });
  }, [saved]);

  const handleTestPrint = () => {
    toast({ title: "Imprimiendo ticket de prueba", description: "El ticket de prueba se está enviando a la impresora" });
  };

  const handleSave = () => save(config);

  if (isLoading) return <div className="space-y-6">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Printer Configuration */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2"><Printer className="h-5 w-5 text-primary" />Configuración de Impresora</CardTitle>
          <CardDescription>Configura tu impresora para tickets y recibos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Tipo de Impresora</Label>
              <Select value={config.printerType} onValueChange={(v) => setConfig(prev => ({ ...prev, printerType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="thermal58">Impresora Térmica 58mm</SelectItem>
                  <SelectItem value="thermal80">Impresora Térmica 80mm</SelectItem>
                  <SelectItem value="a4">Impresora A4 Convencional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Método de Conexión</Label>
              <Select value={config.connectionMethod} onValueChange={(v) => setConfig(prev => ({ ...prev, connectionMethod: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="usb">USB</SelectItem>
                  <SelectItem value="bluetooth">Bluetooth</SelectItem>
                  <SelectItem value="network">Red / IP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nombre / Dirección</Label>
              <Input value={config.printerName} onChange={(e) => setConfig(prev => ({ ...prev, printerName: e.target.value }))} placeholder="POS-58 o 192.168.1.100" />
            </div>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleTestPrint}><TestTube className="h-4 w-4" />Probar Impresora</Button>
        </CardContent>
      </Card>

      {/* Receipt Customization */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-elevated">
          <CardHeader><CardTitle className="font-display text-xl flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Personalización de Recibo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Incluir Logo en Recibo</p><p className="text-sm text-muted-foreground">Muestra el logo en el encabezado</p></div>
              <Switch checked={config.receipt.includeLogo} onCheckedChange={(v) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, includeLogo: v } }))} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Texto de Encabezado</Label>
              <Textarea value={config.receipt.headerText} onChange={(e) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, headerText: e.target.value } }))} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Texto de Pie de Página</Label>
              <Textarea value={config.receipt.footerText} onChange={(e) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, footerText: e.target.value } }))} rows={2} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Incluir Código QR</p><p className="text-sm text-muted-foreground">Para reseñas o redes sociales</p></div>
              <Switch checked={config.receipt.includeQR} onCheckedChange={(v) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, includeQR: v } }))} />
            </div>
            {config.receipt.includeQR && (
              <div className="space-y-2">
                <Label>URL del Código QR</Label>
                <Input value={config.receipt.qrUrl} onChange={(e) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, qrUrl: e.target.value } }))} placeholder="https://g.page/tu-negocio/review" />
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Datos Fiscales Completos</p><p className="text-sm text-muted-foreground">RUC, dirección fiscal, etc.</p></div>
              <Switch checked={config.receipt.includeFiscalData} onCheckedChange={(v) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, includeFiscalData: v } }))} />
            </div>
            <div className="space-y-2">
              <Label>Tamaño de Fuente</Label>
              <Select value={config.receipt.fontSize} onValueChange={(v) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, fontSize: v } }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequeño</SelectItem>
                  <SelectItem value="medium">Mediano</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Preview */}
        <Card className="card-elevated">
          <CardHeader><CardTitle className="font-display text-xl">Vista Previa del Recibo</CardTitle></CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-card font-mono text-xs mx-auto" style={{ maxWidth: config.printerType === "thermal58" ? "200px" : config.printerType === "thermal80" ? "280px" : "100%" }}>
              {config.receipt.includeLogo && (
                <div className="text-center mb-2"><div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center"><span className="text-lg">✂️</span></div></div>
              )}
              <div className="text-center whitespace-pre-line text-[10px] mb-3">{config.receipt.headerText}</div>
              <Separator className="my-2" />
              <div className="text-center text-[10px] text-muted-foreground mb-2">BOLETA DE VENTA<br />{config.vouchers.boletaPrefix}-{String(config.vouchers.currentBoletaNumber).padStart(7, "0")}</div>
              <Separator className="my-2" />
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between"><span>1 Corte + Barba</span><span>S/ 25.00</span></div>
                <div className="flex justify-between"><span>1 Pomada Premium</span><span>S/ 18.00</span></div>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold"><span>TOTAL:</span><span>S/ 43.00</span></div>
              <Separator className="my-2" />
              <div className="text-center whitespace-pre-line text-[10px]">{config.receipt.footerText}</div>
              {config.receipt.includeQR && (
                <div className="text-center mt-3">
                  <div className="w-16 h-16 bg-muted mx-auto flex items-center justify-center rounded"><QrCode className="h-10 w-10 text-muted-foreground" /></div>
                  <p className="text-[8px] text-muted-foreground mt-1">Escanea para dejarnos una reseña</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voucher Types */}
      <Card className="card-elevated">
        <CardHeader><CardTitle className="font-display text-xl">Tipos de Comprobantes</CardTitle><CardDescription>Configura la numeración automática de comprobantes</CardDescription></CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { key: "boleta", prefix: "boletaPrefix", number: "currentBoletaNumber", label: "Boleta de Venta" },
              { key: "factura", prefix: "facturaPrefix", number: "currentFacturaNumber", label: "Factura" },
              { key: "nota", prefix: "notaCreditoPrefix", number: "currentNotaNumber", label: "Nota de Crédito" },
            ].map(v => (
              <div key={v.key} className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">{v.label}</h4>
                <div className="space-y-2">
                  <Label>Prefijo</Label>
                  <Input value={(config.vouchers as any)[v.prefix]} onChange={(e) => setConfig(prev => ({ ...prev, vouchers: { ...prev.vouchers, [v.prefix]: e.target.value } }))} />
                </div>
                <div className="text-sm text-muted-foreground">Último número: {(config.vouchers as any)[v.number]}</div>
              </div>
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
