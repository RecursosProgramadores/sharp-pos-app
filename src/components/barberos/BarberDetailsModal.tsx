import { useState } from "react";
import { X, Edit, Star, Scissors, DollarSign, TrendingUp, Phone, Mail, IdCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import type { Barber } from "./BarberCard";

interface BarberDetailsModalProps {
  barber: Barber | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const performanceData = [
  { month: "Jul", cortes: 42 },
  { month: "Ago", cortes: 38 },
  { month: "Sep", cortes: 55 },
  { month: "Oct", cortes: 48 },
  { month: "Nov", cortes: 62 },
  { month: "Dic", cortes: 45 },
];

const attendanceData = {
  present: 22,
  absent: 2,
  late: 3,
  halfDay: 1,
};

const recentServices = [
  { id: 1, date: "2024-01-15", time: "10:30", service: "Corte Clásico", client: "Carlos Mendoza", amount: 30 },
  { id: 2, date: "2024-01-15", time: "09:15", service: "Fade + Barba", client: "Roberto García", amount: 55 },
  { id: 3, date: "2024-01-14", time: "17:45", service: "Barba Completa", client: "Luis Pérez", amount: 25 },
  { id: 4, date: "2024-01-14", time: "16:00", service: "Corte Moderno", client: "Fernando López", amount: 35 },
  { id: 5, date: "2024-01-14", time: "14:30", service: "Fade Degradado", client: "Diego Ramírez", amount: 40 },
  { id: 6, date: "2024-01-13", time: "11:00", service: "Corte + Diseño", client: "Mario Sánchez", amount: 50 },
];

const statusConfig = {
  active: { label: "Activo", variant: "success" as const },
  inactive: { label: "Inactivo", variant: "muted" as const },
  vacation: { label: "Vacaciones", variant: "warning" as const },
};

export function BarberDetailsModal({ barber, open, onOpenChange }: BarberDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!barber) return null;

  const status = statusConfig[barber.status];

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-display text-2xl">
                  {barber.name.split(" ")[0][0]}
                  {barber.name.split(" ")[1]?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-display text-2xl">{barber.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <Badge variant="outline">{barber.specialty}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {renderStars(barber.rating)}
                  <span className="font-medium">{barber.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({barber.reviewCount} reseñas)
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-primary/10">
                <Scissors className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-display text-2xl">{barber.totalCuts}</p>
                <p className="text-xs text-muted-foreground">Total Cortes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-display text-2xl">${barber.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Ingresos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-info/10">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="font-display text-2xl">{Math.round(barber.totalCuts / 30)}</p>
                <p className="text-xs text-muted-foreground">Promedio/Día</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="p-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="services">Servicios</TabsTrigger>
              <TabsTrigger value="performance">Rendimiento</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <IdCard className="h-4 w-4" /> DNI
                  </p>
                  {isEditing ? (
                    <Input defaultValue={barber.dni} />
                  ) : (
                    <p className="font-medium">{barber.dni}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Teléfono
                  </p>
                  {isEditing ? (
                    <Input defaultValue={barber.phone} />
                  ) : (
                    <p className="font-medium">{barber.phone}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </p>
                  {isEditing ? (
                    <Input defaultValue={barber.email} />
                  ) : (
                    <p className="font-medium">{barber.email}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Fecha de Ingreso
                  </p>
                  <p className="font-medium">
                    {new Date(barber.hireDate).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3">Resumen de Asistencia (Este Mes)</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-success/10 text-center">
                    <p className="font-display text-2xl text-success">{attendanceData.present}</p>
                    <p className="text-xs text-muted-foreground">Presente</p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10 text-center">
                    <p className="font-display text-2xl text-destructive">{attendanceData.absent}</p>
                    <p className="text-xs text-muted-foreground">Ausente</p>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 text-center">
                    <p className="font-display text-2xl text-warning">{attendanceData.late}</p>
                    <p className="text-xs text-muted-foreground">Tarde</p>
                  </div>
                  <div className="p-3 rounded-lg bg-info/10 text-center">
                    <p className="font-display text-2xl text-info">{attendanceData.halfDay}</p>
                    <p className="text-xs text-muted-foreground">Medio Día</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="mt-4">
              <div className="space-y-2">
                {barber.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Duración: {service.duration} min
                      </p>
                    </div>
                    {isEditing ? (
                      <Input
                        type="number"
                        defaultValue={service.price}
                        className="w-24"
                      />
                    ) : (
                      <span className="font-display text-xl text-primary">
                        ${service.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="mt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorCortes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value: number) => [`${value} cortes`, "Cortes"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="cortes"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorCortes)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-4">
              <div className="space-y-2">
                {recentServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {new Date(service.date).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">{service.time}</p>
                      </div>
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-sm text-muted-foreground">{service.client}</p>
                      </div>
                    </div>
                    <span className="font-display text-lg text-success">
                      ${service.amount}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
