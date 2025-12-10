import { useState } from "react";
import { Edit, Copy, List, Grid, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const barbers = [
  { id: 1, name: "Miguel Ángel", avatar: "MA" },
  { id: 2, name: "Juan Carlos", avatar: "JC" },
  { id: 3, name: "Pedro Sánchez", avatar: "PS" },
  { id: 4, name: "Roberto Díaz", avatar: "RD" },
  { id: 5, name: "Luis Gómez", avatar: "LG" },
];

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const hours = Array.from({ length: 14 }, (_, i) => 8 + i); // 8:00 to 21:00

const schedulesData: Record<number, Record<string, { start: number; end: number; breakStart?: number; breakEnd?: number }>> = {
  1: {
    Lun: { start: 9, end: 18, breakStart: 13, breakEnd: 14 },
    Mar: { start: 9, end: 18, breakStart: 13, breakEnd: 14 },
    Mié: { start: 9, end: 18, breakStart: 13, breakEnd: 14 },
    Jue: { start: 9, end: 18, breakStart: 13, breakEnd: 14 },
    Vie: { start: 9, end: 18, breakStart: 13, breakEnd: 14 },
    Sáb: { start: 9, end: 15 },
  },
  2: {
    Lun: { start: 10, end: 19 },
    Mar: { start: 10, end: 19 },
    Mié: { start: 10, end: 19 },
    Jue: { start: 10, end: 19 },
    Vie: { start: 10, end: 20 },
    Sáb: { start: 10, end: 18 },
  },
};

export function ScheduleTab() {
  const [selectedBarber, setSelectedBarber] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDays, setEditDays] = useState<string[]>([]);
  const [editSchedule, setEditSchedule] = useState({
    startTime: "09:00",
    endTime: "18:00",
    hasBreak: false,
    breakStart: "13:00",
    breakEnd: "14:00",
  });

  const currentSchedule = schedulesData[selectedBarber] || {};

  const getCellStatus = (day: string, hour: number): "working" | "break" | "off" => {
    const schedule = currentSchedule[day];
    if (!schedule) return "off";
    if (hour < schedule.start || hour >= schedule.end) return "off";
    if (schedule.breakStart && hour >= schedule.breakStart && hour < schedule.breakEnd!) {
      return "break";
    }
    return "working";
  };

  const handleEditSave = () => {
    toast.success("Horario actualizado correctamente");
    setIsEditModalOpen(false);
  };

  const toggleDay = (day: string) => {
    setEditDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={selectedBarber.toString()}
            onValueChange={(v) => setSelectedBarber(parseInt(v))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {barbers.map((barber) => (
                <SelectItem key={barber.id} value={barber.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {barber.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {barber.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
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
          <div className="w-4 h-4 rounded bg-warning/70" />
          <span>Break</span>
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
                <th className="p-3 text-left text-sm font-medium text-muted-foreground w-20">
                  Hora
                </th>
                {days.map((day) => (
                  <th key={day} className="p-3 text-center text-sm font-medium">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour} className="border-b border-border/50">
                  <td className="p-2 text-sm text-muted-foreground">
                    {hour.toString().padStart(2, "0")}:00
                  </td>
                  {days.map((day) => {
                    const status = getCellStatus(day, hour);
                    const schedule = currentSchedule[day];
                    return (
                      <td key={day} className="p-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "h-8 rounded cursor-pointer transition-colors",
                                  status === "working" && "bg-success/70 hover:bg-success/80",
                                  status === "break" && "bg-warning/70 hover:bg-warning/80",
                                  status === "off" && "bg-muted hover:bg-muted/80"
                                )}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              {status === "working" && (
                                <p>Turno: {schedule?.start}:00 - {schedule?.end}:00</p>
                              )}
                              {status === "break" && (
                                <p>Break: {schedule?.breakStart}:00 - {schedule?.breakEnd}:00</p>
                              )}
                              {status === "off" && <p>No labora</p>}
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
            const schedule = schedulesData[barber.id] || {};
            return (
              <div key={barber.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {barber.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 grid grid-cols-7 gap-2">
                    {days.map((day) => {
                      const daySchedule = schedule[day];
                      return (
                        <div key={day} className="text-center">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            {day}
                          </p>
                          {daySchedule ? (
                            <Badge variant="success" className="text-xs">
                              {daySchedule.start}:00-{daySchedule.end}:00
                            </Badge>
                          ) : (
                            <Badge variant="muted" className="text-xs">
                              -
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Editar Horarios
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Day Selection */}
            <div className="space-y-2">
              <Label>Días de la semana</Label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={editDays.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hora de entrada</Label>
                <Input
                  type="time"
                  value={editSchedule.startTime}
                  onChange={(e) =>
                    setEditSchedule((prev) => ({ ...prev, startTime: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Hora de salida</Label>
                <Input
                  type="time"
                  value={editSchedule.endTime}
                  onChange={(e) =>
                    setEditSchedule((prev) => ({ ...prev, endTime: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Break */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasBreak"
                  checked={editSchedule.hasBreak}
                  onCheckedChange={(checked) =>
                    setEditSchedule((prev) => ({ ...prev, hasBreak: !!checked }))
                  }
                />
                <Label htmlFor="hasBreak" className="cursor-pointer">
                  Tiene break
                </Label>
              </div>

              {editSchedule.hasBreak && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label>Inicio break</Label>
                    <Input
                      type="time"
                      value={editSchedule.breakStart}
                      onChange={(e) =>
                        setEditSchedule((prev) => ({ ...prev, breakStart: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fin break</Label>
                    <Input
                      type="time"
                      value={editSchedule.breakEnd}
                      onChange={(e) =>
                        setEditSchedule((prev) => ({ ...prev, breakEnd: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Copy from another barber */}
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full gap-2">
                <Copy className="h-4 w-4" />
                Copiar horario de otro barbero
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSave}>
              Aplicar a días seleccionados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
