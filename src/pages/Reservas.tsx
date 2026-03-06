import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Scissors,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Filter,
  Search,
  ShoppingCart,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useReservations, useUpdateReservationStatus, useDeleteReservation } from "@/hooks/useReservations";
import { useToast } from "@/hooks/use-toast";
import type { Reservation } from "@/types/reservation";
import { sendAppointmentReminder } from "@/lib/whatsapp";

export default function Reservas() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: reservations = [], isLoading } = useReservations();
  const updateStatus = useUpdateReservationStatus();
  const deleteReservation = useDeleteReservation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [satisfactionRating, setSatisfactionRating] = useState<number>(5);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "secondary", label: "Pendiente" },
      confirmed: { variant: "default", label: "Confirmada" },
      completed: { variant: "outline", label: "Completada" },
      cancelled: { variant: "destructive", label: "Cancelada" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Hoy";
    if (isTomorrow(date)) return "Mañana";
    return format(date, "EEE d MMM", { locale: es });
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.client_phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todayReservations = filteredReservations.filter((r) =>
    isToday(parseISO(r.reservation_date))
  );
  const upcomingReservations = filteredReservations.filter(
    (r) => !isPast(parseISO(r.reservation_date)) && !isToday(parseISO(r.reservation_date))
  );
  const pastReservations = filteredReservations.filter((r) =>
    isPast(parseISO(r.reservation_date)) && !isToday(parseISO(r.reservation_date))
  );

  const handleStatusChange = async (id: string, status: string, rating?: number) => {
    try {
      await updateStatus.mutateAsync({ id, status, satisfaction_rating: rating });
      toast({
        title: "Estado actualizado",
        description: `La reserva fue marcada como ${status}`,
      });
      setSelectedReservation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReservation.mutateAsync(id);
      toast({
        title: "Reserva eliminada",
        description: "La reserva fue eliminada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la reserva",
        variant: "destructive",
      });
    }
  };

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedReservation(reservation)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {reservation.reservation_time}
            </div>
            {getStatusBadge(reservation.status)}
          </div>
          <span className="text-xs text-muted-foreground">
            {getDateLabel(reservation.reservation_date)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">{reservation.client_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {reservation.client_phone}
          </div>
          {reservation.service && (
            <div className="flex items-center gap-2 text-sm">
              <Scissors className="h-4 w-4 text-primary" />
              <span>{reservation.service.name}</span>
              <span className="text-primary font-semibold">
                S/ {reservation.service.price}
              </span>
            </div>
          )}
          {reservation.barber && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-5 w-5 rounded-full bg-muted overflow-hidden">
                {reservation.barber.photo_url ? (
                  <img
                    src={reservation.barber.photo_url}
                    alt={reservation.barber.full_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-1" />
                )}
              </div>
              <span>{reservation.barber.full_name}</span>
            </div>
          )}
          {reservation.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{reservation.location.name}</span>
            </div>
          )}
          {reservation.satisfaction_rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < reservation.satisfaction_rating!
                      ? "fill-warning text-warning"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            Reservas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las citas de tus clientes desde la página web
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reservations.filter((r) => r.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayReservations.length}</p>
              <p className="text-sm text-muted-foreground">Hoy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reservations.filter((r) => r.status === "confirmed").length}
              </p>
              <p className="text-sm text-muted-foreground">Confirmadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reservations.filter((r) => r.status === "completed").length}
              </p>
              <p className="text-sm text-muted-foreground">Completadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="confirmed">Confirmadas</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reservations Tabs */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="today">
          <TabsList>
            <TabsTrigger value="today" className="gap-2">
              Hoy
              <Badge variant="secondary" className="ml-1">
                {todayReservations.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-2">
              Próximas
              <Badge variant="secondary" className="ml-1">
                {upcomingReservations.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              Pasadas
              <Badge variant="secondary" className="ml-1">
                {pastReservations.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-6">
            {todayReservations.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay reservas para hoy</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {todayReservations.map((r) => (
                  <ReservationCard key={r.id} reservation={r} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingReservations.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay reservas próximas</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingReservations.map((r) => (
                  <ReservationCard key={r.id} reservation={r} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastReservations.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay reservas pasadas</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastReservations.map((r) => (
                  <ReservationCard key={r.id} reservation={r} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Reservation Detail Modal */}
      <Dialog
        open={!!selectedReservation}
        onOpenChange={() => setSelectedReservation(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Detalle de Reserva
            </DialogTitle>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado:</span>
                {getStatusBadge(selectedReservation.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{selectedReservation.client_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedReservation.client_phone}
                    </p>
                    {selectedReservation.client_email && (
                      <p className="text-sm text-muted-foreground">
                        {selectedReservation.client_email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {format(parseISO(selectedReservation.reservation_date), "EEEE d 'de' MMMM", {
                        locale: es,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedReservation.reservation_time}
                    </p>
                  </div>
                </div>

                {selectedReservation.service && (
                  <div className="flex items-center gap-3">
                    <Scissors className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{selectedReservation.service.name}</p>
                      <p className="text-sm text-primary font-semibold">
                        S/ {selectedReservation.service.price}
                      </p>
                    </div>
                  </div>
                )}

                {selectedReservation.barber && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
                      {selectedReservation.barber.photo_url ? (
                        <img
                          src={selectedReservation.barber.photo_url}
                          alt={selectedReservation.barber.full_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-full w-full p-1.5" />
                      )}
                    </div>
                    <p className="font-medium">{selectedReservation.barber.full_name}</p>
                  </div>
                )}

                {selectedReservation.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p>{selectedReservation.location.name}</p>
                  </div>
                )}
              </div>

              {/* Rating for completion */}
              {selectedReservation.status === "confirmed" && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">
                    Calificación del servicio:
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSatisfactionRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= satisfactionRating
                              ? "fill-warning text-warning"
                              : "text-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="flex-col gap-2 sm:flex-row">
                {/* WhatsApp Reminder Button - always visible for pending/confirmed */}
                {(selectedReservation.status === "pending" || selectedReservation.status === "confirmed") && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto gap-2 text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => {
                      const svc = selectedReservation.service;
                      const barber = selectedReservation.barber;
                      const loc = selectedReservation.location;
                      sendAppointmentReminder({
                        clientName: selectedReservation.client_name,
                        clientPhone: selectedReservation.client_phone,
                        serviceName: svc?.name || "Servicio",
                        barberName: barber?.full_name || "Por asignar",
                        time: selectedReservation.reservation_time,
                        locationName: loc?.name,
                      });
                      toast({
                        title: "WhatsApp abierto",
                        description: "Se abrió WhatsApp con el recordatorio pre-escrito",
                      });
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Recordar por WhatsApp
                  </Button>
                )}

                {selectedReservation.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() =>
                        handleStatusChange(selectedReservation.id, "cancelled")
                      }
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      className="w-full sm:w-auto"
                      onClick={() =>
                        handleStatusChange(selectedReservation.id, "confirmed")
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar
                    </Button>
                  </>
                )}
                {selectedReservation.status === "confirmed" && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto gap-2"
                      onClick={() => {
                        setSelectedReservation(null);
                        navigate("/admin/pos?reservation=" + selectedReservation.id);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Cobrar en POS
                    </Button>
                    <Button
                      className="w-full sm:w-auto bg-success hover:bg-success/90"
                      onClick={() =>
                        handleStatusChange(
                          selectedReservation.id,
                          "completed",
                          satisfactionRating
                        )
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar Completada
                    </Button>
                  </>
                )}
                {selectedReservation.status === "cancelled" && (
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={() => handleDelete(selectedReservation.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
