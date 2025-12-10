import { useState } from "react";
import { Calendar, Clock, CheckCircle2, XCircle, AlertTriangle, Download, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BarberAttendance {
  id: number;
  name: string;
  avatar: string;
  scheduledTime: string;
  status: "present" | "absent" | "late" | "halfday" | "pending";
  entryTime?: string;
  exitTime?: string;
  notes?: string;
}

const todayAttendance: BarberAttendance[] = [
  { id: 1, name: "Miguel Ángel", avatar: "MA", scheduledTime: "9:00 AM - 6:00 PM", status: "present", entryTime: "8:55 AM" },
  { id: 2, name: "Juan Carlos", avatar: "JC", scheduledTime: "10:00 AM - 7:00 PM", status: "late", entryTime: "10:25 AM" },
  { id: 3, name: "Pedro Sánchez", avatar: "PS", scheduledTime: "9:00 AM - 6:00 PM", status: "present", entryTime: "8:50 AM", exitTime: "6:05 PM" },
  { id: 4, name: "Roberto Díaz", avatar: "RD", scheduledTime: "11:00 AM - 8:00 PM", status: "pending" },
  { id: 5, name: "Luis Gómez", avatar: "LG", scheduledTime: "9:00 AM - 6:00 PM", status: "absent", notes: "Enfermedad" },
];

const statusConfig = {
  present: { label: "Presente", variant: "success" as const, icon: CheckCircle2, color: "text-success" },
  absent: { label: "Ausente", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
  late: { label: "Tarde", variant: "warning" as const, icon: AlertTriangle, color: "text-warning" },
  halfday: { label: "Medio Día", variant: "info" as const, icon: Clock, color: "text-info" },
  pending: { label: "Sin Marcar", variant: "muted" as const, icon: Clock, color: "text-muted-foreground" },
};

const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
const monthAttendance: Record<number, "present" | "absent" | "late" | "halfday"> = {
  1: "present", 2: "present", 3: "late", 4: "present", 5: "present",
  6: "absent", 7: "present", 8: "present", 9: "present", 10: "late",
  11: "present", 12: "present", 13: "halfday", 14: "present", 15: "present",
};

export function AttendanceTab() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedBarber, setSelectedBarber] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleMarkEntry = (barberId: number) => {
    const now = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    toast.success(`Entrada registrada a las ${now}`);
  };

  const handleMarkExit = (barberId: number) => {
    const now = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    toast.success(`Salida registrada a las ${now}`);
  };

  const handleMarkAllPresent = () => {
    toast.success("Todos los barberos marcados como presentes");
  };

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="daily" className="gap-2">
            <Calendar className="h-4 w-4" />
            Registro Diario
          </TabsTrigger>
          <TabsTrigger value="monthly" className="gap-2">
            <Clock className="h-4 w-4" />
            Historial Mensual
          </TabsTrigger>
        </TabsList>

        {/* Daily View */}
        <TabsContent value="daily" className="mt-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                5 programados
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsManualEntryOpen(true)}>
                Entrada Manual
              </Button>
              <Button variant="outline" onClick={handleMarkAllPresent}>
                Marcar Todos Presentes
              </Button>
            </div>
          </div>

          {/* Barber Cards */}
          <div className="space-y-3">
            {todayAttendance.map((barber) => {
              const status = statusConfig[barber.status];
              const StatusIcon = status.icon;
              return (
                <div
                  key={barber.id}
                  className="card-elevated p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground font-display text-lg">
                        {barber.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{barber.name}</h3>
                        <Badge variant={status.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Horario: {barber.scheduledTime}
                      </p>
                      {barber.entryTime && (
                        <p className="text-sm text-muted-foreground">
                          Entrada: {barber.entryTime}
                          {barber.exitTime && ` → Salida: ${barber.exitTime}`}
                        </p>
                      )}
                      {barber.notes && (
                        <p className="text-sm text-warning mt-1">
                          Nota: {barber.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {barber.status === "pending" && (
                        <Button onClick={() => handleMarkEntry(barber.id)}>
                          Marcar Entrada
                        </Button>
                      )}
                      {(barber.status === "present" || barber.status === "late") && !barber.exitTime && (
                        <Button variant="outline" onClick={() => handleMarkExit(barber.id)}>
                          Registrar Salida
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Notes Input */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <Input
                      placeholder="Agregar observación..."
                      className="text-sm"
                      defaultValue={barber.notes}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Monthly View */}
        <TabsContent value="monthly" className="mt-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(v) => setSelectedMonth(parseInt(v))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedBarber.toString()}
                onValueChange={(v) => setSelectedBarber(parseInt(v))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {todayAttendance.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
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
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar Reporte
              </Button>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Configurar Alertas
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            {/* Calendar Grid */}
            <div className="card-elevated p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for offset */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {monthDays.map((day) => {
                  const attendance = monthAttendance[day];
                  const statusIcon = attendance ? statusConfig[attendance] : null;
                  return (
                    <TooltipProvider key={day}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              "aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-colors",
                              "hover:bg-muted/50 cursor-pointer",
                              day <= 15 ? "bg-muted/20" : "bg-background"
                            )}
                            onClick={() => {
                              setSelectedDay(day);
                              setIsDayDetailOpen(true);
                            }}
                          >
                            <span className="text-sm font-medium">{day}</span>
                            {statusIcon && (
                              <statusIcon.icon className={cn("h-4 w-4", statusIcon.color)} />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {attendance ? (
                            <p>{statusConfig[attendance].label}</p>
                          ) : (
                            <p>Sin registro</p>
                          )}
                        </TooltipContent>
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
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Días Trabajados</span>
                  </div>
                  <span className="font-display text-xl text-success">12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span>Ausencias</span>
                  </div>
                  <span className="font-display text-xl text-destructive">1</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <span>Llegadas Tarde</span>
                  </div>
                  <span className="font-display text-xl text-warning">2</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-info/10">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-info" />
                    <span>Medio Día</span>
                  </div>
                  <span className="font-display text-xl text-info">1</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Puntualidad</span>
                  <span className="font-display text-2xl text-success">87%</span>
                </div>
              </div>
            </div>
          </div>
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
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar barbero" />
                </SelectTrigger>
                <SelectContent>
                  {todayAttendance.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id.toString()}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hora de entrada</label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hora de salida</label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Observaciones</label>
              <Textarea placeholder="Motivo de la corrección..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualEntryOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast.success("Entrada manual registrada");
              setIsManualEntryOpen(false);
            }}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Detail Modal */}
      <Dialog open={isDayDetailOpen} onOpenChange={setIsDayDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Detalle del día {selectedDay}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Estado</span>
                {selectedDay && monthAttendance[selectedDay] && (
                  <Badge variant={statusConfig[monthAttendance[selectedDay]].variant}>
                    {statusConfig[monthAttendance[selectedDay]].label}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="text-sm text-muted-foreground">Entrada</span>
                  <p className="font-medium">9:05 AM</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Salida</span>
                  <p className="font-medium">6:10 PM</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDayDetailOpen(false)}>
              Cerrar
            </Button>
            <Button>Editar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
