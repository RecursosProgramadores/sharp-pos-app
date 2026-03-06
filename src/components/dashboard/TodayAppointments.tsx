import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useTodayReservations } from "@/hooks/useReservations";
import { sendAppointmentReminder } from "@/lib/whatsapp";

const BUSINESS_PHONE = "51922223165";

export function TodayAppointments() {
  const { data: reservations, isLoading } = useTodayReservations();
  const { toast } = useToast();
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [sendingAll, setSendingAll] = useState(false);

  // Only pending/confirmed
  const upcoming = (reservations || []).filter(
    (r) => r.status === "pending" || r.status === "confirmed"
  );

  const handleSendReminder = (reservation: any) => {
    sendAppointmentReminder({
      clientName: reservation.client_name,
      clientPhone: reservation.client_phone,
      serviceName: reservation.service?.name || "Servicio",
      barberName: reservation.barber?.full_name || "Por asignar",
      time: reservation.reservation_time?.slice(0, 5),
      locationName: reservation.location?.name,
      businessName: "Tayta Barbershop",
    });
    setSentIds((prev) => new Set(prev).add(reservation.id));
    toast({
      title: "WhatsApp abierto",
      description: `Recordatorio listo para ${reservation.client_name}`,
    });
  };

  const handleMassReminder = () => {
    if (upcoming.length === 0) return;
    setSendingAll(true);

    // Build a single message with all appointments for the business WhatsApp
    const lines = upcoming.map(
      (r, i) =>
        `${i + 1}. *${r.client_name}* — ${r.reservation_time?.slice(0, 5)} — ${r.service?.name || "Servicio"} (${r.barber?.full_name || "Sin barbero"})`
    );

    const message = `📋 *Tayta Barbershop — Citas de Hoy*\n📅 ${format(new Date(), "EEEE d 'de' MMMM", { locale: es })}\n\n${lines.join("\n")}\n\n✅ Total: ${upcoming.length} cita(s) pendiente(s)\n\n_Envía este resumen a cada cliente o usa los botones individuales._`;

    const url = `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    toast({
      title: "Resumen de citas enviado",
      description: `Se preparó el recordatorio masivo para ${upcoming.length} cita(s)`,
    });
    setSendingAll(false);
  };

  const getTimeStatus = (time: string) => {
    const now = new Date();
    const [h, m] = time.split(":").map(Number);
    const apptTime = new Date();
    apptTime.setHours(h, m, 0, 0);
    const diffMin = Math.round((apptTime.getTime() - now.getTime()) / 60000);

    if (diffMin < 0) return { label: "Pasada", variant: "muted" as const };
    if (diffMin <= 30) return { label: `En ${diffMin} min`, variant: "destructive" as const };
    if (diffMin <= 60) return { label: `En ${diffMin} min`, variant: "warning" as const };
    return { label: `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`, variant: "secondary" as const };
  };

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Citas de Hoy
          </h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
          </p>
        </div>
        {upcoming.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-success border-success/30 hover:bg-success/10"
            onClick={handleMassReminder}
            disabled={sendingAll}
          >
            {sendingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Recordatorio Masivo</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {upcoming.length}
            </Badge>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-3 opacity-60" />
          <p className="text-muted-foreground text-sm">
            No hay citas pendientes para hoy
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            ¡Todo despejado! 🎉
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {upcoming
            .sort((a, b) => (a.reservation_time || "").localeCompare(b.reservation_time || ""))
            .map((reservation) => {
              const timeStatus = getTimeStatus(reservation.reservation_time || "00:00");
              const initials = reservation.client_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const isSent = sentIds.has(reservation.id);

              return (
                <div
                  key={reservation.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  {/* Time */}
                  <div className="flex flex-col items-center min-w-[52px]">
                    <span className="text-sm font-bold tabular-nums">
                      {reservation.reservation_time?.slice(0, 5)}
                    </span>
                    <Badge variant={timeStatus.variant} className="text-[10px] px-1.5 py-0">
                      {timeStatus.label}
                    </Badge>
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-9 w-9 border-2 border-primary/20 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {reservation.client_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {reservation.service && (
                        <span className="flex items-center gap-1">
                          <Scissors className="h-3 w-3" />
                          {reservation.service.name}
                        </span>
                      )}
                      {reservation.barber && (
                        <span className="truncate">· {reservation.barber.full_name}</span>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <Button
                    size="icon"
                    variant={isSent ? "ghost" : "outline"}
                    className={`shrink-0 h-8 w-8 ${
                      isSent
                        ? "text-success"
                        : "text-success border-success/30 hover:bg-success/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendReminder(reservation);
                    }}
                    title={isSent ? "Recordatorio enviado" : "Enviar recordatorio por WhatsApp"}
                  >
                    {isSent ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
