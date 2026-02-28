import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, CheckCircle2, XCircle, AlertTriangle, Download, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBarbers, useBarberAttendance, useBarberSchedules } from "@/hooks/useBarbers";
import * as XLSX from "xlsx";

const statusConfig = {
  present: { label: "Presente", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  absent: { label: "Ausente", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  late: { label: "Tarde", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  halfday: { label: "Medio Día", icon: Clock, color: "text-info", bg: "bg-info/10" },
  pending: { label: "Sin Marcar", icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
};

export function AttendanceTab() {
  const { barbers } = useBarbers();
  const { schedules } = useBarberSchedules();
  const { attendance, isLoading, fetchAttendance, fetchMonthlyAttendance, markEntry, markExit, markAbsent, updateAttendanceNotes } = useBarberAttendance();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  // Manual entry form
  const [manualBarberId, setManualBarberId] = useState("");
  const [manualEntry, setManualEntry] = useState("");
  const [manualExit, setManualExit] = useState("");
  const [manualStatus, setManualStatus] = useState("present");
  const [manualNotes, setManualNotes] = useState("");

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate, fetchAttendance]);

  const loadMonthly = useCallback(async () => {
    if (selectedBarberId && selectedBarberId !== "all") {
      const data = await fetchMonthlyAttendance(selectedBarberId, selectedYear, selectedMonth);
      setMonthlyData(data);
    }
  }, [selectedBarberId, selectedYear, selectedMonth, fetchMonthlyAttendance]);

  useEffect(() => {
    loadMonthly();
  }, [loadMonthly]);

  // Build daily view: combine barbers with their attendance
  const dailyView = barbers.map((barber) => {
    const record = attendance.find((a) => a.barber_id === barber.id);
    const barberSchedule = schedules[barber.id] || [];
    const todayDow = new Date(selectedDate).getDay();
    const daySchedule = barberSchedule.find((s: any) => s.day_of_week === todayDow);

    return {
      barber,
      record,
      scheduledStart: daySchedule?.start_time?.slice(0, 5),
      scheduledEnd: daySchedule?.end_time?.slice(0, 5),
      status: record?.status || (daySchedule ? "pending" : "off"),
    };
  }).filter((item) => item.status !== "off" || item.record);

  const handleMarkEntry = async (barberId: string, scheduledStart?: string, scheduledEnd?: string) => {
    const ok = await markEntry(barberId, selectedDate, scheduledStart, scheduledEnd);
    if (ok) fetchAttendance(selectedDate);
  };

  const handleMarkExit = async (barberId: string) => {
    const ok = await markExit(barberId, selectedDate);
    if (ok) fetchAttendance(selectedDate);
  };

  const handleMarkAllPresent = async () => {
    for (const item of dailyView) {
      if (item.status === "pending") {
        await markEntry(item.barber.id, selectedDate, item.scheduledStart, item.scheduledEnd);
      }
    }
    fetchAttendance(selectedDate);
    toast.success("Todos marcados como presentes");
  };

  const handleManualSave = async () => {
    if (!manualBarberId) return;
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("barber_attendance").upsert(
      {
        barber_id: manualBarberId,
        attendance_date: selectedDate,
        entry_time: manualEntry || null,
        exit_time: manualExit || null,
        status: manualStatus,
        notes: manualNotes || null,
      },
      { onConflict: "barber_id,attendance_date" }
    );
    if (error) {
      toast.error("Error al guardar");
      return;
    }
    toast.success("Entrada manual registrada");
    setIsManualEntryOpen(false);
    fetchAttendance(selectedDate);
  };

  const exportExcel = () => {
    const rows = dailyView.map((item) => ({
      Barbero: item.barber.name,
      Estado: statusConfig[item.status as keyof typeof statusConfig]?.label || item.status,
      "Hora Entrada": item.record?.entry_time || "-",
      "Hora Salida": item.record?.exit_time || "-",
      "Horario Programado": item.scheduledStart ? `${item.scheduledStart} - ${item.scheduledEnd}` : "-",
      Notas: item.record?.notes || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
    XLSX.writeFile(wb, `Asistencia_${selectedDate}.xlsx`);
    toast.success("Excel exportado");
  };

  // Monthly summary
  const monthlySummary = {
    present: monthlyData.filter((d) => d.status === "present").length,
    absent: monthlyData.filter((d) => d.status === "absent").length,
    late: monthlyData.filter((d) => d.status === "late").length,
    halfday: monthlyData.filter((d) => d.status === "halfday").length,
  };
  const totalDays = monthlySummary.present + monthlySummary.absent + monthlySummary.late + monthlySummary.halfday;
  const punctuality = totalDays > 0 ? Math.round(((monthlySummary.present) / totalDays) * 100) : 0;

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Calendar days
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthlyMap: Record<number, string> = {};
  for (const d of monthlyData) {
    const day = parseInt(d.attendance_date.split("-")[2]);
    monthlyMap[day] = d.status;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="daily" className="gap-2"><Calendar className="h-4 w-4" />Registro Diario</TabsTrigger>
          <TabsTrigger value="monthly" className="gap-2"><Clock className="h-4 w-4" />Historial Mensual</TabsTrigger>
        </TabsList>

        {/* Daily View */}
        <TabsContent value="daily" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-auto" />
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {dailyView.length} programados
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsManualEntryOpen(true)}>Entrada Manual</Button>
              <Button variant="outline" onClick={handleMarkAllPresent}>Marcar Todos Presentes</Button>
              <Button variant="outline" className="gap-2" onClick={exportExcel}><Download className="h-4 w-4" />Excel</Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {dailyView.map((item) => {
                const st = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = st.icon;
                return (
                  <div key={item.barber.id} className="card-elevated p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-primary/20">
                        {item.barber.photoUrl && <AvatarImage src={item.barber.photoUrl} />}
                        <AvatarFallback className="bg-primary text-primary-foreground font-display text-lg">
                          {item.barber.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{item.barber.name}</h3>
                          <Badge variant="outline" className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {st.label}
                          </Badge>
                        </div>
                        {item.scheduledStart && (
                          <p className="text-sm text-muted-foreground mt-1">Horario: {item.scheduledStart} - {item.scheduledEnd}</p>
                        )}
                        {item.record?.entry_time && (
                          <p className="text-sm text-muted-foreground">
                            Entrada: {item.record.entry_time.slice(0, 5)}
                            {item.record.exit_time && ` → Salida: ${item.record.exit_time.slice(0, 5)}`}
                          </p>
                        )}
                        {item.record?.notes && (
                          <p className="text-sm text-warning mt-1">Nota: {item.record.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {item.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleMarkEntry(item.barber.id, item.scheduledStart, item.scheduledEnd)}>
                              Marcar Entrada
                            </Button>
                            <Button size="sm" variant="destructive" onClick={async () => {
                              await markAbsent(item.barber.id, selectedDate);
                              fetchAttendance(selectedDate);
                            }}>Ausente</Button>
                          </>
                        )}
                        {(item.status === "present" || item.status === "late") && !item.record?.exit_time && (
                          <Button variant="outline" size="sm" onClick={() => handleMarkExit(item.barber.id)}>
                            Registrar Salida
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {dailyView.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No hay barberos programados para este día.</div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Monthly View */}
        <TabsContent value="monthly" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {months.map((month, i) => <SelectItem key={i} value={i.toString()}>{month}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Seleccionar barbero" /></SelectTrigger>
                <SelectContent>
                  {barbers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {b.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedBarberId && selectedBarberId !== "all" ? (
            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
              {/* Calendar Grid */}
              <div className="card-elevated p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
                  {monthDays.map((day) => {
                    const status = monthlyMap[day] as keyof typeof statusConfig | undefined;
                    const stConfig = status ? statusConfig[status] : null;
                    return (
                      <TooltipProvider key={day}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className={cn(
                              "aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-colors hover:bg-muted/50 cursor-pointer",
                              stConfig ? stConfig.bg : "bg-background"
                            )}>
                              <span className="text-sm font-medium">{day}</span>
                              {stConfig && <stConfig.icon className={cn("h-4 w-4", stConfig.color)} />}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>{stConfig ? stConfig.label : "Sin registro"}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="card-elevated p-4 space-y-4">
                <h4 className="font-medium">Resumen del Mes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-success" /><span>Días Trabajados</span></div>
                    <span className="font-display text-xl text-success">{monthlySummary.present}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                    <div className="flex items-center gap-2"><XCircle className="h-5 w-5 text-destructive" /><span>Ausencias</span></div>
                    <span className="font-display text-xl text-destructive">{monthlySummary.absent}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                    <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" /><span>Llegadas Tarde</span></div>
                    <span className="font-display text-xl text-warning">{monthlySummary.late}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-info/10">
                    <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-info" /><span>Medio Día</span></div>
                    <span className="font-display text-xl text-info">{monthlySummary.halfday}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Puntualidad</span>
                    <span className={cn("font-display text-2xl", punctuality >= 80 ? "text-success" : punctuality >= 60 ? "text-warning" : "text-destructive")}>{punctuality}%</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Selecciona un barbero para ver su historial mensual.</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Manual Entry Modal */}
      <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Entrada Manual</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Barbero</label>
              <Select value={manualBarberId} onValueChange={setManualBarberId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar barbero" /></SelectTrigger>
                <SelectContent>
                  {barbers.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={manualStatus} onValueChange={setManualStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Presente</SelectItem>
                  <SelectItem value="late">Tarde</SelectItem>
                  <SelectItem value="absent">Ausente</SelectItem>
                  <SelectItem value="halfday">Medio Día</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hora de entrada</label>
                <Input type="time" value={manualEntry} onChange={(e) => setManualEntry(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hora de salida</label>
                <Input type="time" value={manualExit} onChange={(e) => setManualExit(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Observaciones</label>
              <Textarea placeholder="Motivo..." value={manualNotes} onChange={(e) => setManualNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualEntryOpen(false)}>Cancelar</Button>
            <Button onClick={handleManualSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
