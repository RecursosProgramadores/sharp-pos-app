import { useState } from "react";
import { Plus, FileText, DollarSign, Calendar, Loader2, XCircle, CheckCircle2, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBarbers, useChairRentals } from "@/hooks/useBarbers";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const statusConfig = {
  active: { label: "Activo", color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  expired: { label: "Vencido", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  cancelled: { label: "Cancelado", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

export function ChairRentalsTab() {
  const { barbers } = useBarbers();
  const { rentals, payments, isLoading, createRental, registerPayment, cancelRental, fetchPayments } = useChairRentals();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<string>("");

  // New rental form
  const [form, setForm] = useState({
    barber_id: "",
    chair_number: 1,
    weekly_rate: 0,
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    contract_notes: "",
    payment_day: "monday",
    deposit_amount: 0,
  });

  // Payment form
  const [payForm, setPayForm] = useState({
    amount: 0,
    week_start: "",
    week_end: "",
    payment_method: "cash",
    notes: "",
  });

  const handleCreateRental = async () => {
    if (!form.barber_id) { toast.error("Selecciona un barbero"); return; }
    if (form.weekly_rate <= 0) { toast.error("Ingresa una tarifa válida"); return; }
    const ok = await createRental({
      ...form,
      end_date: form.end_date || undefined,
      contract_notes: form.contract_notes || undefined,
    });
    if (ok) {
      setIsNewOpen(false);
      setForm({ barber_id: "", chair_number: 1, weekly_rate: 0, start_date: new Date().toISOString().split("T")[0], end_date: "", contract_notes: "", payment_day: "monday", deposit_amount: 0 });
    }
  };

  const handleRegisterPayment = async () => {
    if (!selectedRentalId || payForm.amount <= 0) { toast.error("Datos incompletos"); return; }
    if (!payForm.week_start || !payForm.week_end) { toast.error("Selecciona el período de la semana"); return; }
    const ok = await registerPayment({
      rental_id: selectedRentalId,
      ...payForm,
    });
    if (ok) {
      setIsPaymentOpen(false);
      setPayForm({ amount: 0, week_start: "", week_end: "", payment_method: "cash", notes: "" });
    }
  };

  const openPayment = (rentalId: string, weeklyRate: number) => {
    setSelectedRentalId(rentalId);
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    setPayForm({
      amount: weeklyRate,
      week_start: monday.toISOString().split("T")[0],
      week_end: sunday.toISOString().split("T")[0],
      payment_method: "cash",
      notes: "",
    });
    setIsPaymentOpen(true);
  };

  const exportExcel = () => {
    const rows = rentals.map((r: any) => ({
      Barbero: r.barbers?.full_name || "-",
      "Silla #": r.chair_number,
      "Tarifa Semanal": `$${r.weekly_rate}`,
      Inicio: r.start_date,
      Fin: r.end_date || "Indefinido",
      Estado: statusConfig[r.status as keyof typeof statusConfig]?.label || r.status,
      Depósito: `$${r.deposit_amount || 0}`,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alquileres");
    XLSX.writeFile(wb, "Alquileres_Sillas.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Contratos de Alquiler de Sillas", 14, 22);
    autoTable(doc, {
      startY: 32,
      head: [["Barbero", "Silla", "Tarifa/Sem", "Inicio", "Estado"]],
      body: rentals.map((r: any) => [
        r.barbers?.full_name || "-",
        `#${r.chair_number}`,
        `$${r.weekly_rate}`,
        r.start_date,
        statusConfig[r.status as keyof typeof statusConfig]?.label || r.status,
      ]),
    });
    doc.save("Alquileres_Sillas.pdf");
  };

  const activeRentals = rentals.filter((r: any) => r.status === "active");
  const totalWeeklyIncome = activeRentals.reduce((sum: number, r: any) => sum + Number(r.weekly_rate), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando alquileres...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setIsNewOpen(true)}><Plus className="h-4 w-4" />Nuevo Contrato</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={exportExcel}><FileText className="h-4 w-4" />Excel</Button>
          <Button variant="outline" className="gap-2" onClick={exportPDF}><FileText className="h-4 w-4" />PDF</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contratos Activos</p>
              <p className="font-display text-3xl">{activeRentals.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10"><Armchair className="h-6 w-6 text-success" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ingreso Semanal</p>
              <p className="font-display text-3xl">${totalWeeklyIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10"><DollarSign className="h-6 w-6 text-primary" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Contratos</p>
              <p className="font-display text-3xl">{rentals.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-info/10"><FileText className="h-6 w-6 text-info" /></div>
          </div>
        </div>
      </div>

      {/* Rental Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rentals.map((rental: any) => {
          const st = statusConfig[rental.status as keyof typeof statusConfig] || statusConfig.active;
          const rentalPayments = payments.filter((p: any) => p.rental_id === rental.id);
          return (
            <div key={rental.id} className={cn("card-elevated p-5 border-l-4", st.border)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    {rental.barbers?.photo_url && <AvatarImage src={rental.barbers.photo_url} />}
                    <AvatarFallback className="bg-primary text-primary-foreground font-display">
                      {rental.barbers?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{rental.barbers?.full_name || "N/A"}</h3>
                    <Badge variant="outline" className={cn("text-xs", st.color)}>{st.label}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Silla</p>
                  <p className="font-display text-2xl">#{rental.chair_number}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa Semanal</span>
                  <span className="font-semibold text-primary">${Number(rental.weekly_rate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inicio</span>
                  <span>{new Date(rental.start_date).toLocaleDateString("es-MX")}</span>
                </div>
                {rental.end_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fin</span>
                    <span>{new Date(rental.end_date).toLocaleDateString("es-MX")}</span>
                  </div>
                )}
                {rental.deposit_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Depósito</span>
                    <span>${Number(rental.deposit_amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pagos registrados</span>
                  <span>{rentalPayments.length}</span>
                </div>
              </div>

              {rental.contract_notes && (
                <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">{rental.contract_notes}</p>
              )}

              <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                {rental.status === "active" && (
                  <>
                    <Button size="sm" className="flex-1 gap-1" onClick={() => openPayment(rental.id, Number(rental.weekly_rate))}>
                      <DollarSign className="h-3.5 w-3.5" />Registrar Pago
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="gap-1">
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Cancelar contrato?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Se cancelará el contrato de alquiler de silla #{rental.chair_number} para {rental.barbers?.full_name}. Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, mantener</AlertDialogCancel>
                          <AlertDialogAction onClick={() => cancelRental(rental.id)}>Sí, cancelar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {rentals.length === 0 && (
        <div className="text-center py-12">
          <Armchair className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No hay contratos de alquiler. ¡Crea el primero!</p>
        </div>
      )}

      {/* New Rental Dialog */}
      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Nuevo Contrato de Alquiler</DialogTitle>
            <DialogDescription>Configura el alquiler semanal de una silla para un barbero.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Barbero *</Label>
              <Select value={form.barber_id} onValueChange={(v) => setForm((p) => ({ ...p, barber_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar barbero" /></SelectTrigger>
                <SelectContent>
                  {barbers.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Número de Silla *</Label>
                <Input type="number" min={1} value={form.chair_number} onChange={(e) => setForm((p) => ({ ...p, chair_number: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="space-y-2">
                <Label>Tarifa Semanal ($) *</Label>
                <Input type="number" min={0} value={form.weekly_rate || ""} onChange={(e) => setForm((p) => ({ ...p, weekly_rate: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Inicio *</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Fecha Fin (opcional)</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Día de Pago</Label>
                <Select value={form.payment_day} onValueChange={(v) => setForm((p) => ({ ...p, payment_day: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Lunes</SelectItem>
                    <SelectItem value="friday">Viernes</SelectItem>
                    <SelectItem value="saturday">Sábado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Depósito ($)</Label>
                <Input type="number" min={0} value={form.deposit_amount || ""} onChange={(e) => setForm((p) => ({ ...p, deposit_amount: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notas del Contrato</Label>
              <Textarea placeholder="Condiciones, acuerdos especiales..." value={form.contract_notes} onChange={(e) => setForm((p) => ({ ...p, contract_notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateRental}>Crear Contrato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Registrar Pago Semanal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Semana Desde</Label>
                <Input type="date" value={payForm.week_start} onChange={(e) => setPayForm((p) => ({ ...p, week_start: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Semana Hasta</Label>
                <Input type="date" value={payForm.week_end} onChange={(e) => setPayForm((p) => ({ ...p, week_end: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monto ($)</Label>
                <Input type="number" min={0} value={payForm.amount || ""} onChange={(e) => setPayForm((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Select value={payForm.payment_method} onValueChange={(v) => setPayForm((p) => ({ ...p, payment_method: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea placeholder="Observaciones..." value={payForm.notes} onChange={(e) => setPayForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Cancelar</Button>
            <Button onClick={handleRegisterPayment}>Registrar Pago</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
