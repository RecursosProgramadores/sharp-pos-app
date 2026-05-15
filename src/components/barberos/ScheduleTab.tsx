import { useState, useEffect } from "react";
import { Edit, Grid, List, Loader2, Copy, Clock, Calendar, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useBarbers, useBarberSchedules } from "@/hooks/useBarbers";
import { toast } from "sonner";

const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const dayShortNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const dayIndices = [1, 2, 3, 4, 5, 6, 0]; // Mon=1...Sat=6, Sun=0
const hours = Array.from({ length: 14 }, (_, i) => 8 + i);

const PRESETS = [
  { label: "Turno Completo", start: "09:00", end: "20:00" },
  { label: "Mañana", start: "09:00", end: "14:00" },
  { label: "Tarde/Noche", start: "14:00", end: "21:00" },
  { label: "Intermedio", start: "10:00", end: "19:00" },
];

export function ScheduleTab() {
  const { barbers, isLoading: barbersLoading } = useBarbers();
  const { schedules, isLoading: schedulesLoading, saveBulkSchedule, deleteSchedule } = useBarberSchedules();
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDays, setEditDays] = useState<number[]>([]);
  const [editSchedule, setEditSchedule] = useState({ startTime: "09:00", endTime: "18:00" });

  useEffect(() => {
    if (barbers.length > 0 && !selectedBarberId) {
      setSelectedBarberId(barbers[0].id);
    }
  }, [barbers, selectedBarberId]);

  const isLoading = barbersLoading || schedulesLoading;
  const currentSchedules = schedules[selectedBarberId] || [];

  const getScheduleForDay = (dayOfWeek: number) => {
    return currentSchedules.find((s) => s.day_of_week === dayOfWeek);
  };

  const getCellStatus = (dayOfWeek: number, hour: number): "working" | "off" => {
    const schedule = getScheduleForDay(dayOfWeek);
    if (!schedule) return "off";
    const startHour = parseInt(schedule.start_time.split(":")[0]);
    const endHour = parseInt(schedule.end_time.split(":")[0]);
    if (hour >= startHour && hour < endHour) return "working";
    return "off";
  };

  const openEditModal = (day?: number) => {
    if (day !== undefined) {
      setEditDays([day]);
      const current = getScheduleForDay(day);
      if (current) {
        setEditSchedule({ startTime: current.start_time.slice(0, 5), endTime: current.end_time.slice(0, 5) });
      } else {
        setEditSchedule({ startTime: "09:00", endTime: "20:00" });
      }
    } else {
      setEditDays([]);
      setEditSchedule({ startTime: "09:00", endTime: "20:00" });
    }
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedBarberId || editDays.length === 0) {
      toast.error("Selecciona al menos un día");
      return;
    }
    const success = await saveBulkSchedule(selectedBarberId, editDays, editSchedule.startTime, editSchedule.endTime);
    if (success) {
      setIsEditModalOpen(false);
      setEditDays([]);
    }
  };

  const handleClearDays = async () => {
    if (!selectedBarberId || editDays.length === 0) return;
    for (const day of editDays) {
      await deleteSchedule(selectedBarberId, day);
    }
    toast.success("Horarios eliminados");
    setIsEditModalOpen(false);
    setEditDays([]);
  };

  const toggleDay = (day: number) => {
    setEditDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setEditSchedule({ startTime: preset.start, endTime: preset.end });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando horarios...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Seleccionar Barbero</Label>
            <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
              <SelectTrigger className="w-[220px] bg-background border-border/50 h-10">
                <SelectValue placeholder="Seleccionar barbero" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {b.photoUrl && <AvatarImage src={b.photoUrl} />}
                        <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-bold">
                          {b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{b.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Vista</Label>
            <div className="flex bg-muted p-1 rounded-lg">
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button className="gap-2 h-10 px-6 font-bold shadow-lg shadow-primary/20" onClick={() => openEditModal()}>
          <Calendar className="h-4 w-4" />
          Configurar Semana
        </Button>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex gap-6 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success/70 shadow-sm" />
            <span className="text-muted-foreground">Turno Activo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted shadow-sm" />
            <span className="text-muted-foreground">No Labora / Descanso</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground italic flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> Haz clic en cualquier día para editar su horario individualmente
        </p>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="card-elevated overflow-x-auto p-4 border-border/50">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400 w-24">Hora</th>
                {dayShortNames.map((day, i) => (
                  <th key={day} className="p-4">
                    <button 
                      onClick={() => openEditModal(dayIndices[i])}
                      className="group flex flex-col items-center gap-1 hover:text-primary transition-colors"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">{day}</span>
                      <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {hours.map((hour) => (
                <tr key={hour} className="group hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-[11px] font-mono font-bold text-muted-foreground bg-muted/20 rounded-lg text-center">
                    {hour.toString().padStart(2, "0")}:00
                  </td>
                  {dayIndices.map((dayIdx, i) => {
                    const status = getCellStatus(dayIdx, hour);
                    const schedule = getScheduleForDay(dayIdx);
                    return (
                      <td key={i} className="p-1.5">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                onClick={() => openEditModal(dayIdx)}
                                className={cn(
                                  "h-10 rounded-xl cursor-pointer transition-all duration-300 border",
                                  status === "working" 
                                    ? "bg-success/10 border-success/30 shadow-inner" 
                                    : "bg-muted/30 border-transparent hover:border-muted-foreground/20"
                                )} 
                              >
                                {status === "working" && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-zinc-900 border-zinc-800 text-white p-2">
                              {status === "working" ? (
                                <div className="space-y-1">
                                  <p className="text-xs font-bold">{dayNames[i]}</p>
                                  <p className="text-[10px] opacity-70">Turno: {schedule?.start_time.slice(0,5)} - {schedule?.end_time.slice(0,5)}</p>
                                </div>
                              ) : <p className="text-[10px]">No labora el {dayNames[i]}</p>}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="grid gap-4">
          {barbers.map((barber) => {
            const barberSchedules = schedules[barber.id] || [];
            return (
              <div key={barber.id} className="card-elevated overflow-hidden group">
                <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-center gap-4 lg:w-48 shrink-0">
                    <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-md">
                      {barber.photoUrl && <AvatarImage src={barber.photoUrl} />}
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {barber.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-display font-bold text-sm leading-tight">{barber.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{barber.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    {dayIndices.map((dayIdx, i) => {
                      const schedule = barberSchedules.find((s: any) => s.day_of_week === dayIdx);
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "p-3 rounded-xl border transition-all cursor-pointer group/day",
                            schedule ? "bg-success/5 border-success/20" : "bg-muted/50 border-transparent opacity-60"
                          )}
                          onClick={() => {
                            setSelectedBarberId(barber.id);
                            openEditModal(dayIdx);
                          }}
                        >
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">{dayShortNames[i]}</p>
                          {schedule ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-success" />
                              <span className="text-[11px] font-bold">
                                {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-medium text-zinc-400 italic">Descanso</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="shrink-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setSelectedBarberId(barber.id);
                      openEditModal();
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Refined Luxury-Tech Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md overflow-hidden p-0 rounded-[28px] border-white/5 bg-[#0A0A0A] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Header with subtle elegance */}
          <div className="p-8 pb-6 border-b border-white/[0.03]">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1 w-8 bg-amber-500 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Horarios de Staff</span>
              </div>
              <DialogTitle className="font-display text-3xl tracking-tight text-white">
                Editar <span className="text-amber-500">Jornada</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm mt-1">
                Colaborador: <span className="text-zinc-300 font-semibold">{barbers.find(b => b.id === selectedBarberId)?.name}</span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            {/* Minimalist Day Picker */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Días de Trabajo</Label>
                <button 
                  onClick={() => setEditDays(dayIndices)}
                  className="text-[9px] font-bold text-amber-500/80 hover:text-amber-500 transition-colors uppercase tracking-widest"
                >
                  Marcar todos
                </button>
              </div>
              <div className="flex justify-between gap-2">
                {dayShortNames.map((day, i) => {
                  const isSelected = editDays.includes(dayIndices[i]);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(dayIndices[i])}
                      className={cn(
                        "w-10 h-10 rounded-full text-[10px] font-bold transition-all duration-300 border flex items-center justify-center",
                        isSelected 
                          ? "bg-amber-500 border-amber-400 text-black shadow-[0_5px_15px_rgba(245,158,11,0.3)]" 
                          : "bg-white/[0.03] border-white/5 text-zinc-500 hover:border-white/20"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean Presets */}
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Ajustes Rápidos</Label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className="h-10 px-4 text-[9px] font-bold uppercase tracking-widest border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 rounded-full transition-all text-zinc-400"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selectors - Modern & Spacious */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 space-y-2">
                <Label className="text-[9px] font-bold text-zinc-500 tracking-widest ml-1">ENTRADA</Label>
                <div className="relative">
                  <Input
                    type="time"
                    className="bg-zinc-900/50 border-white/5 h-14 text-center text-xl font-bold rounded-2xl text-white focus:border-amber-500/50 transition-all"
                    value={editSchedule.startTime}
                    onChange={(e) => setEditSchedule((p) => ({ ...p, startTime: e.target.value }))}
                  />
                </div>
              </div>
              <div className="pt-6">
                <div className="w-4 h-[1px] bg-white/10" />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-[9px] font-bold text-zinc-500 tracking-widest ml-1">SALIDA</Label>
                <div className="relative">
                  <Input
                    type="time"
                    className="bg-zinc-900/50 border-white/5 h-14 text-center text-xl font-bold rounded-2xl text-white focus:border-amber-500/50 transition-all"
                    value={editSchedule.endTime}
                    onChange={(e) => setEditSchedule((p) => ({ ...p, endTime: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer with perfect alignment */}
          <div className="p-8 bg-black/40 border-t border-white/[0.03] flex items-center justify-between gap-4">
            <Button 
              variant="ghost" 
              className="h-12 px-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
              onClick={handleClearDays}
              disabled={editDays.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Descanso
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="rounded-2xl h-12 px-6 font-bold text-[10px] uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleEditSave} 
                className="rounded-2xl h-12 px-8 font-bold text-[10px] uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/10 transition-all"
                disabled={editDays.length === 0}
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
