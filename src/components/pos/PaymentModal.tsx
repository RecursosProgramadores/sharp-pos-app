import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Banknote, CreditCard, Building2, Smartphone, Split, CheckCircle2, Printer, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethod = "cash" | "card" | "transfer" | "wallet" | "mixed";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (method: PaymentMethod, details: Record<string, unknown>) => void | Promise<void>;
}

const paymentMethods = [
  { id: "cash", label: "Efectivo", icon: Banknote, color: "bg-green-600 hover:bg-green-700" },
  { id: "card", label: "Tarjeta", icon: CreditCard, color: "bg-blue-600 hover:bg-blue-700" },
  { id: "transfer", label: "Transferencia", icon: Building2, color: "bg-purple-600 hover:bg-purple-700" },
  { id: "wallet", label: "Wallet Digital", icon: Smartphone, color: "bg-orange-500 hover:bg-orange-600" },
  { id: "mixed", label: "Pago Mixto", icon: Split, color: "bg-slate-600 hover:bg-slate-700" },
] as const;

const quickAmounts = [10, 20, 50, 100];

export function PaymentModal({ open, onClose, total, onConfirm }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [cashReceived, setCashReceived] = useState("");
  const [cardType, setCardType] = useState("");
  const [lastDigits, setLastDigits] = useState("");
  const [requireSignature, setRequireSignature] = useState(false);
  const [mixedCash, setMixedCash] = useState("");
  const [mixedCard, setMixedCard] = useState("");
  const [printReceipt, setPrintReceipt] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const change = parseFloat(cashReceived) - total;
  const mixedTotal = (parseFloat(mixedCash) || 0) + (parseFloat(mixedCard) || 0);
  const isMixedValid = Math.abs(mixedTotal - total) < 0.01;

  const handleConfirm = () => {
    const details = {
      method,
      cashReceived: method === "cash" ? parseFloat(cashReceived) : undefined,
      change: method === "cash" && change > 0 ? change : undefined,
      cardType: method === "card" ? cardType : undefined,
      lastDigits: method === "card" ? lastDigits : undefined,
      requireSignature: method === "card" ? requireSignature : undefined,
      mixedCash: method === "mixed" ? parseFloat(mixedCash) : undefined,
      mixedCard: method === "mixed" ? parseFloat(mixedCard) : undefined,
      printReceipt,
      sendWhatsApp,
      contactInfo: sendWhatsApp ? contactInfo : undefined,
    };

    setIsSuccess(true);
    
    // Play cash register sound (optional)
    try {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQsAU6zn6ZZVDxhOuPT2mmQJAUu5/vmYYg8OR7kA+5pnCQJEugL8mmoPDkO7Bf2abQkCQL0I/5tuDg0+vwv/m28JAT7BDv+bcQ4MPMQRAJxxCQE7xhQAnHMOCznJFwCddAkAOMsaAJ12DQo2zh0AnncJADbQIACeeg0KNNMjAJ98CQA10iYAoH0NCjPVKQChfwkAM9csAKKBDQoy2i8Ao4IJADLZMQC");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {}

    setTimeout(() => {
      onConfirm(method!, details);
      resetState();
    }, 2000);
  };

  const resetState = () => {
    setMethod(null);
    setCashReceived("");
    setCardType("");
    setLastDigits("");
    setRequireSignature(false);
    setMixedCash("");
    setMixedCard("");
    setPrintReceipt(true);
    setSendWhatsApp(false);
    setContactInfo("");
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6 animate-scale-in">
              <CheckCircle2 className="h-14 w-14 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Pago Completado!</h2>
            <p className="text-muted-foreground text-center">
              Venta procesada exitosamente
            </p>
            {method === "cash" && change > 0 && (
              <p className="text-xl font-display mt-4">
                Cambio: <span className="text-green-600">S/ {change.toFixed(2)}</span>
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Procesar Pago</DialogTitle>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">Total a pagar</p>
            <p className="font-display text-5xl text-primary">S/ {total.toFixed(2)}</p>
          </div>
        </DialogHeader>

        {!method && (
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((pm) => (
              <Button
                key={pm.id}
                variant="outline"
                className={cn(
                  "h-20 flex-col gap-2 text-white border-0",
                  pm.color
                )}
                onClick={() => setMethod(pm.id)}
              >
                <pm.icon className="h-7 w-7" />
                <span className="font-medium">{pm.label}</span>
              </Button>
            ))}
          </div>
        )}

        {method === "cash" && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setMethod(null)} className="mb-2">
              ← Cambiar método
            </Button>
            
            <div className="space-y-2">
              <Label>Monto recibido</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="text-2xl h-14 text-center font-display"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setCashReceived(amount.toString())}
                  className="flex-1"
                >
                  S/ {amount}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCashReceived(Math.ceil(total).toString())}
                className="flex-1"
              >
                Exacto
              </Button>
            </div>

            {parseFloat(cashReceived) >= total && (
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Cambio a entregar</p>
                <p className="text-4xl font-display text-green-600">S/ {change.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        {method === "card" && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setMethod(null)} className="mb-2">
              ← Cambiar método
            </Button>
            
            <div className="space-y-2">
              <Label>Tipo de tarjeta</Label>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tarjeta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                  <SelectItem value="other">Otra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Últimos 4 dígitos (opcional)</Label>
              <Input
                type="text"
                maxLength={4}
                placeholder="0000"
                value={lastDigits}
                onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="signature"
                checked={requireSignature}
                onCheckedChange={(checked) => setRequireSignature(checked as boolean)}
              />
              <Label htmlFor="signature">Solicitar firma</Label>
            </div>
          </div>
        )}

        {method === "transfer" && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setMethod(null)} className="mb-2">
              ← Cambiar método
            </Button>
            
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Esperando confirmación de transferencia</p>
              <p className="font-display text-3xl">S/ {total.toFixed(2)}</p>
            </div>
          </div>
        )}

        {method === "wallet" && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setMethod(null)} className="mb-2">
              ← Cambiar método
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16">Yape</Button>
              <Button variant="outline" className="h-16">Plin</Button>
              <Button variant="outline" className="h-16">Nequi</Button>
              <Button variant="outline" className="h-16">Otro</Button>
            </div>
          </div>
        )}

        {method === "mixed" && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setMethod(null)} className="mb-2">
              ← Cambiar método
            </Button>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <Label>Efectivo</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={mixedCash}
                    onChange={(e) => setMixedCash(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <Label>Tarjeta</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={mixedCard}
                    onChange={(e) => setMixedCard(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={cn(
              "p-3 rounded-lg text-center",
              isMixedValid ? "bg-green-50 dark:bg-green-950" : "bg-destructive/10"
            )}>
              <p className="text-sm">
                Suma: S/ {mixedTotal.toFixed(2)} / S/ {total.toFixed(2)}
              </p>
              {!isMixedValid && mixedTotal > 0 && (
                <p className="text-destructive text-sm">
                  {mixedTotal > total ? "Excede el total" : `Faltan S/ ${(total - mixedTotal).toFixed(2)}`}
                </p>
              )}
            </div>
          </div>
        )}

        {method && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Checkbox
                id="print"
                checked={printReceipt}
                onCheckedChange={(checked) => setPrintReceipt(checked as boolean)}
              />
              <Label htmlFor="print" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Imprimir recibo
              </Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="whatsapp"
                  checked={sendWhatsApp}
                  onCheckedChange={(checked) => setSendWhatsApp(checked as boolean)}
                />
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Enviar recibo por WhatsApp/Email
                </Label>
              </div>
              
              {sendWhatsApp && (
                <Input
                  placeholder="Teléfono o email"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
              )}
            </div>

            <Button
              className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
              onClick={handleConfirm}
              disabled={
                (method === "cash" && parseFloat(cashReceived) < total) ||
                (method === "mixed" && !isMixedValid)
              }
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              CONFIRMAR PAGO Y FINALIZAR
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
