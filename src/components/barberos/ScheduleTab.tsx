import { useState, useEffect } from "react";
import { Edit, Grid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useBarbers, useBarberSchedules } from "@/hooks/useBarbers";

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const dayIndices = [1, 2, 3, 4, 5, 6, 0]; // Mon=1...Sat=6, Sun=0
const hours = Array.from({ length: 14 }, (_, i) => 8 + i);

export function ScheduleTab() {
  const { barbers, isLoading: barbersLoading } = useBarbers();
  const { schedules, isLoading: schedulesLoading, saveBulkSchedule } = useBarberSchedules();
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

  const handleEditSave = async () => {
    if (!selectedBarberId || editDays.length === 0) return;
    await saveBulkSchedule(selectedBarberId, editDays, editSchedule.startTime, editSchedule.endTime);
    setIsEditModalOpen(false);
    setEditDays([]);
  };

  const toggleDay = (day: number) => {
    setEditDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar barbero" />
            </SelectTrigger>
            <SelectContent>
              {barbers.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {b.photoUrl && <AvatarImage src={b.photoUrl} />}
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

          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button className="gap-2" onClick={() => setIsEditModalOpen(true)}>
          <Edit className="h-4 w-4" />
          Editar Horarios
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/70" />
          <span>Turno Activo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted" />
          <span>No Labora</span>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="card-elevated overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left text-sm font-medium text-muted-foreground w-20">Hora</th>
                {dayNames.map((day) => (
                  <th key={day} className="p-3 text-center text-sm font-medium">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour} className="border-b border-border/50">
                  <td className="p-2 text-sm text-muted-foreground">{hour.toString().padStart(2, "0")}:00</td>
                  {dayIndices.map((dayIdx, i) => {
                    const status = getCellStatus(dayIdx, hour);
                    const schedule = getScheduleForDay(dayIdx);
                    return (
                      <td key={i} className="p-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={cn(
                                "h-8 rounded cursor-pointer transition-colors",
                                status === "working" ? "bg-success/70 hover:bg-success/80" : "bg-muted hover:bg-muted/80"
                              )} />
                            </TooltipTrigger>
                            <TooltipContent>
                              {status === "working" ? (
                                <p>Turno: {schedule?.start_time} - {schedule?.end_time}</p>
                              ) : <p>No labora</p>}
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
        <div className="card-elevated divide-y divide-border">
          {barbers.map((barber) => {
            const barberSchedules = schedules[barber.id] || [];
            return (
              <div key={barber.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    {barber.photoUrl && <AvatarImage src={barber.photoUrl} />}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {barber.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 grid grid-cols-7 gap-2">
                    {dayIndices.map((dayIdx, i) => {
                      const schedule = barberSchedules.find((s: any) => s.day_of_week === dayIdx);
                      return (
                        <div key={i} className="text-center">
                          <p className="text-xs font-medium text-muted-foreground mb-1">{dayNames[i]}</p>
                          {schedule ? (
                            <Badge variant="outline" className="text-xs">
                              {schedule.start_time.slice(0, 5)}-{schedule.end_time.slice(0, 5)}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">-</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => {
                    setSelectedBarberId(barber.id);
                    setIsEditModalOpen(true);
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {barbers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No hay barberos registrados para asignar horarios.
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Editar Horarios</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Barbero</Label>
              <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {barbers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Días de la semana</Label>
              <div className="flex flex-wrap gap-2">
                {dayNames.map((day, i) => (
                  <Button
                    key={day}
                    variant={editDays.includes(dayIndices[i]) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(dayIndices[i])}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hora de entrada</Label>
                <Input
                  type="time"
                  value={editSchedule.startTime}
                  onChange={(e) => setEditSchedule((p) => ({ ...p, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora de salida</Label>
                <Input
                  type="time"
                  value={editSchedule.endTime}
                  onChange={(e) => setEditSchedule((p) => ({ ...p, endTime: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditSave} disabled={editDays.length === 0}>
              Aplicar a días seleccionados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
