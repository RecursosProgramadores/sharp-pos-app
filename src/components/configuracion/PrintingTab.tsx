import { useState, useEffect } from "react";
import {
  Printer, QrCode, FileText, Save, TestTube, Loader2, Upload, Trash2,
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
    qrImageUrl: "",
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

const defaultBusinessInfo = {
  name: "Tayta BarberShop",
  tagline: "",
  taxId: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  mapUrl: "",
  logoUrl: "",
};

export default function PrintingTab() {
  const { data: saved, isLoading, save, isSaving } = useSettings("printing", defaultPrinting);
  const { data: businessInfo } = useSettings("business_info", defaultBusinessInfo);
  const [config, setConfig] = useState(defaultPrinting);

  useEffect(() => {
    if (saved) setConfig({ ...defaultPrinting, ...saved, receipt: { ...defaultPrinting.receipt, ...(saved as any).receipt }, vouchers: { ...defaultPrinting.vouchers, ...(saved as any).vouchers } });
  }, [saved]);

  const handleTestPrint = () => {
    toast({ title: "Imprimiendo ticket de prueba", description: "El ticket de prueba se está enviando a la impresora" });
  };

  const handleSave = () => save(config);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({
          ...prev,
          receipt: { ...prev.receipt, qrImageUrl: reader.result as string }
        }));
        toast({ title: "Imagen cargada", description: "El código QR ha sido actualizado." });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <div className="space-y-6">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>;

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  const bInfo = (businessInfo || defaultBusinessInfo) as typeof defaultBusinessInfo;
  const receiptWidth = config.printerType === "thermal58" ? "220px" : config.printerType === "thermal80" ? "300px" : "100%";

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

      {/* Receipt Customization + Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-elevated">
          <CardHeader><CardTitle className="font-display text-xl flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Personalización de Recibo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Incluir Logo en Recibo</p><p className="text-sm text-muted-foreground">Muestra el logo en el encabezado</p></div>
              <Switch checked={config.receipt.includeLogo} onCheckedChange={(v) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, includeLogo: v } }))} />
            </div>
            {config.receipt.includeLogo && !bInfo.logoUrl && (
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg">
                ⚠ No has subido un logo. Ve a "Información del Negocio" para subir uno.
              </p>
            )}
            <Separator />
            <div className="space-y-2">
              <Label>Texto de Encabezado</Label>
              <Textarea value={config.receipt.headerText} onChange={(e) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, headerText: e.target.value } }))} rows={3} />
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
              <div className="space-y-4 pt-2">
                <Label>Imagen del Código QR</Label>
                <div className="flex flex-col gap-4">
                  {config.receipt.qrImageUrl ? (
                    <div className="relative w-32 h-32 rounded-xl border border-dashed border-muted-foreground/20 overflow-hidden group">
                      <img src={config.receipt.qrImageUrl} alt="QR Code" className="w-full h-full object-contain p-2" />
                      <button
                        onClick={() => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, qrImageUrl: "" } }))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="qr-upload"
                      />
                      <label
                        htmlFor="qr-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/20 rounded-2xl cursor-pointer hover:bg-muted/50 transition-all gap-2"
                      >
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Subir imagen del QR</span>
                      </label>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground italic">O pega la URL de la imagen directamente</Label>
                    <Input
                      value={config.receipt.qrImageUrl}
                      onChange={(e) => setConfig(prev => ({ ...prev, receipt: { ...prev.receipt, qrImageUrl: e.target.value } }))}
                      placeholder="https://ejemplo.com/mi-qr.png"
                      className="text-xs"
                    />
                  </div>
                </div>
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

        {/* Professional Receipt Preview */}
        <Card className="card-elevated">
          <CardHeader><CardTitle className="font-display text-xl">Vista Previa del Recibo</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <div
              className="bg-white text-black rounded-lg shadow-lg border border-gray-200 p-5 font-mono"
              style={{ width: receiptWidth, maxWidth: "100%" }}
            >
              {/* Logo & Header */}
              {config.receipt.includeLogo && (
                <div className="text-center mb-3">
                  {bInfo.logoUrl ? (
                    <img src={bInfo.logoUrl} alt="Logo" className="h-14 w-14 object-contain mx-auto mb-1 rounded" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-lg mx-auto mb-1 flex items-center justify-center">
                      <span className="text-2xl">✂️</span>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center mb-3">
                <p className="font-bold text-sm tracking-wide">{config.receipt.headerText || bInfo.name}</p>
                {config.receipt.includeFiscalData && bInfo.address && (
                  <p className="text-[9px] text-gray-500 mt-0.5">{bInfo.address}</p>
                )}
                {config.receipt.includeFiscalData && bInfo.taxId && (
                  <p className="text-[9px] text-gray-500">RUC: {bInfo.taxId}</p>
                )}
                {bInfo.phone && (
                  <p className="text-[9px] text-gray-500">Tel: {bInfo.phone}</p>
                )}
              </div>

              <div className="border-t border-dashed border-gray-300 my-2" />

              {/* Ticket Info */}
              <div className="text-center mb-1">
                <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-wider">Boleta de Venta</p>
                <p className="text-[10px] font-bold">{config.vouchers.boletaPrefix}-{String(config.vouchers.currentBoletaNumber).padStart(7, "0")}</p>
              </div>

              <div className="flex justify-between text-[9px] text-gray-500">
                <span>Fecha: {dateStr}</span>
                <span>{timeStr}</span>
              </div>
              <div className="text-[9px] text-gray-500 mb-1">
                <div className="flex justify-between"><span>Cliente:</span><span>Juan Pérez</span></div>
                <div className="flex justify-between"><span>Barbero:</span><span>Carlos M.</span></div>
              </div>

              <div className="border-t border-dashed border-gray-300 my-2" />

              {/* Items */}
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between text-[8px] font-semibold text-gray-400 uppercase">
                  <span>Descripción</span>
                  <span>Importe</span>
                </div>
                <div className="flex justify-between">
                  <span>1× Corte + Barba</span>
                  <span>S/ 25.00</span>
                </div>
                <div className="flex justify-between">
                  <span>1× Pomada Premium</span>
                  <span>S/ 18.00</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 my-2" />

              {/* Totals */}
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between"><span>Subtotal:</span><span>S/ 43.00</span></div>
                <div className="flex justify-between text-gray-400"><span>Descuento:</span><span>S/ 0.00</span></div>
              </div>

              <div className="border-t border-gray-300 my-1.5" />

              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL:</span>
                <span>S/ 43.00</span>
              </div>

              <div className="border-t border-dashed border-gray-300 my-2" />

              <div className="flex justify-between text-[10px]">
                <span>Pago:</span>
                <span className="font-semibold">EFECTIVO</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Recibido:</span>
                <span>S/ 50.00</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                <span>Cambio:</span>
                <span>S/ 7.00</span>
              </div>

              <div className="border-t border-dashed border-gray-300 my-2" />

              {/* Footer */}
              <div className="text-center text-[10px] text-gray-500 whitespace-pre-line">
                {config.receipt.footerText}
              </div>

              {/* QR Code Section */}
              {config.receipt.includeQR && (
                <div className="text-center mt-3">
                  {config.receipt.qrImageUrl ? (
                    <>
                      <img
                        src={config.receipt.qrImageUrl}
                        alt="QR Code"
                        className="w-16 h-16 mx-auto object-contain"
                      />
                      <p className="text-[8px] text-gray-400 mt-1">Escanea para dejarnos una reseña</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 mx-auto flex items-center justify-center rounded border border-gray-200">
                        <QrCode className="h-10 w-10 text-gray-300" />
                      </div>
                      <p className="text-[8px] text-gray-400 mt-1">Sube una imagen de QR para mostrarla</p>
                    </>
                  )}
                </div>
              )}

              <div className="text-center text-[8px] text-gray-300 mt-3">
                {dateStr} {timeStr}
              </div>
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
