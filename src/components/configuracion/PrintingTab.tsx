import { useState } from "react";
import {
  Printer,
  QrCode,
  FileText,
  Save,
  TestTube,
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export default function PrintingTab() {
  const [printerSettings, setPrinterSettings] = useState({
    printerType: "thermal58",
    connectionMethod: "usb",
    printerName: "POS-58",
  });

  const [receiptSettings, setReceiptSettings] = useState({
    includeLogo: true,
    headerText: "BARBER PRO\nAv. Principal #123, Centro\nTel: +52 55 1234 5678\nRUC: 20123456789",
    footerText: "¡Gracias por tu visita!\nVuelve pronto",
    includeQR: true,
    qrUrl: "https://g.page/barberpro/review",
    includeFiscalData: true,
    fontSize: "medium",
  });

  const [voucherSettings, setVoucherSettings] = useState({
    boletaPrefix: "B001",
    facturaPrefix: "F001",
    notaCreditoPrefix: "NC01",
    currentBoletaNumber: 1234,
    currentFacturaNumber: 456,
    currentNotaNumber: 78,
  });

  const handleTestPrint = () => {
    toast({
      title: "Imprimiendo ticket de prueba",
      description: "El ticket de prueba se está enviando a la impresora",
    });
  };

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Los ajustes de impresión se han actualizado correctamente",
    });
  };

  return (
    <div className="space-y-6">
      {/* Printer Configuration */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Configuración de Impresora
          </CardTitle>
          <CardDescription>
            Configura tu impresora para tickets y recibos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Tipo de Impresora</Label>
              <Select
                value={printerSettings.printerType}
                onValueChange={(value) =>
                  setPrinterSettings({ ...printerSettings, printerType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thermal58">
                    Impresora Térmica 58mm
                  </SelectItem>
                  <SelectItem value="thermal80">
                    Impresora Térmica 80mm
                  </SelectItem>
                  <SelectItem value="a4">Impresora A4 Convencional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Método de Conexión</Label>
              <Select
                value={printerSettings.connectionMethod}
                onValueChange={(value) =>
                  setPrinterSettings({
                    ...printerSettings,
                    connectionMethod: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usb">USB</SelectItem>
                  <SelectItem value="bluetooth">Bluetooth</SelectItem>
                  <SelectItem value="network">Red / IP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nombre / Dirección de Impresora</Label>
              <Input
                value={printerSettings.printerName}
                onChange={(e) =>
                  setPrinterSettings({
                    ...printerSettings,
                    printerName: e.target.value,
                  })
                }
                placeholder="POS-58 o 192.168.1.100"
              />
            </div>
          </div>

          <Button variant="outline" className="gap-2" onClick={handleTestPrint}>
            <TestTube className="h-4 w-4" />
            Probar Impresora
          </Button>
        </CardContent>
      </Card>

      {/* Receipt Customization */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Personalización de Recibo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Incluir Logo en Recibo</p>
                <p className="text-sm text-muted-foreground">
                  Muestra el logo de la barbería en el encabezado
                </p>
              </div>
              <Switch
                checked={receiptSettings.includeLogo}
                onCheckedChange={(checked) =>
                  setReceiptSettings({ ...receiptSettings, includeLogo: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Texto de Encabezado</Label>
              <Textarea
                value={receiptSettings.headerText}
                onChange={(e) =>
                  setReceiptSettings({
                    ...receiptSettings,
                    headerText: e.target.value,
                  })
                }
                rows={4}
                placeholder="Información del negocio..."
              />
            </div>

            <div className="space-y-2">
              <Label>Texto de Pie de Página</Label>
              <Textarea
                value={receiptSettings.footerText}
                onChange={(e) =>
                  setReceiptSettings({
                    ...receiptSettings,
                    footerText: e.target.value,
                  })
                }
                rows={2}
                placeholder="Mensaje de despedida..."
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Incluir Código QR</p>
                <p className="text-sm text-muted-foreground">
                  Para reseñas o redes sociales
                </p>
              </div>
              <Switch
                checked={receiptSettings.includeQR}
                onCheckedChange={(checked) =>
                  setReceiptSettings({ ...receiptSettings, includeQR: checked })
                }
              />
            </div>

            {receiptSettings.includeQR && (
              <div className="space-y-2">
                <Label>URL del Código QR</Label>
                <Input
                  value={receiptSettings.qrUrl}
                  onChange={(e) =>
                    setReceiptSettings({
                      ...receiptSettings,
                      qrUrl: e.target.value,
                    })
                  }
                  placeholder="https://g.page/tu-negocio/review"
                />
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Incluir Datos Fiscales Completos</p>
                <p className="text-sm text-muted-foreground">
                  RUC, dirección fiscal, etc.
                </p>
              </div>
              <Switch
                checked={receiptSettings.includeFiscalData}
                onCheckedChange={(checked) =>
                  setReceiptSettings({
                    ...receiptSettings,
                    includeFiscalData: checked,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Tamaño de Fuente</Label>
              <Select
                value={receiptSettings.fontSize}
                onValueChange={(value) =>
                  setReceiptSettings({ ...receiptSettings, fontSize: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Vista Previa del Recibo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border rounded-lg p-4 bg-card font-mono text-xs mx-auto"
              style={{
                maxWidth:
                  printerSettings.printerType === "thermal58"
                    ? "200px"
                    : printerSettings.printerType === "thermal80"
                    ? "280px"
                    : "100%",
              }}
            >
              {receiptSettings.includeLogo && (
                <div className="text-center mb-2">
                  <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-lg">✂️</span>
                  </div>
                </div>
              )}

              <div className="text-center whitespace-pre-line text-[10px] mb-3">
                {receiptSettings.headerText}
              </div>

              <Separator className="my-2" />

              <div className="text-center text-[10px] text-muted-foreground mb-2">
                BOLETA DE VENTA
                <br />
                B001-0001234
              </div>

              <div className="text-[10px] text-muted-foreground mb-2">
                Fecha: 15/01/2024 10:30
                <br />
                Cajero: Carlos M.
              </div>

              <Separator className="my-2" />

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>1 Corte + Barba</span>
                  <span>$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground ml-2">
                    Barbero: Juan L.
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>1 Pomada Premium</span>
                  <span>$18.00</span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>$36.44</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>IGV (18%):</span>
                  <span>$6.56</span>
                </div>
                <div className="flex justify-between">
                  <span>Propina:</span>
                  <span>$2.00</span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>$45.00</span>
              </div>

              <div className="text-[10px] text-muted-foreground mt-2">
                <div className="flex justify-between">
                  <span>Método:</span>
                  <span>Efectivo</span>
                </div>
                <div className="flex justify-between">
                  <span>Recibido:</span>
                  <span>$50.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Cambio:</span>
                  <span>$5.00</span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="text-center whitespace-pre-line text-[10px]">
                {receiptSettings.footerText}
              </div>

              {receiptSettings.includeQR && (
                <div className="text-center mt-3">
                  <div className="w-16 h-16 bg-muted mx-auto flex items-center justify-center rounded">
                    <QrCode className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-[8px] text-muted-foreground mt-1">
                    Escanea para dejarnos una reseña
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voucher Types */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Tipos de Comprobantes
          </CardTitle>
          <CardDescription>
            Configura la numeración automática de comprobantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium">Boleta de Venta</h4>
              <div className="space-y-2">
                <Label>Prefijo</Label>
                <Input
                  value={voucherSettings.boletaPrefix}
                  onChange={(e) =>
                    setVoucherSettings({
                      ...voucherSettings,
                      boletaPrefix: e.target.value,
                    })
                  }
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Último número: {voucherSettings.currentBoletaNumber}
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium">Factura</h4>
              <div className="space-y-2">
                <Label>Prefijo</Label>
                <Input
                  value={voucherSettings.facturaPrefix}
                  onChange={(e) =>
                    setVoucherSettings({
                      ...voucherSettings,
                      facturaPrefix: e.target.value,
                    })
                  }
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Último número: {voucherSettings.currentFacturaNumber}
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium">Nota de Crédito</h4>
              <div className="space-y-2">
                <Label>Prefijo</Label>
                <Input
                  value={voucherSettings.notaCreditoPrefix}
                  onChange={(e) =>
                    setVoucherSettings({
                      ...voucherSettings,
                      notaCreditoPrefix: e.target.value,
                    })
                  }
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Último número: {voucherSettings.currentNotaNumber}
              </div>
            </div>
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
