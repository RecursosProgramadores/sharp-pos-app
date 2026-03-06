import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Scissors,
  MapPin,
  CheckCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocations, useServices, usePublicBarbers, createReservation } from "@/hooks/usePublicData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const reservationSchema = z.object({
  client_name: z.string().min(2, "Nombre muy corto"),
  client_phone: z.string().min(9, "Teléfono inválido"),
  client_email: z.string().email("Email inválido").optional().or(z.literal("")),
  service_id: z.string().min(1, "Selecciona un servicio"),
  barber_id: z.string().min(1, "Selecciona un barbero"),
  location_id: z.string().min(1, "Selecciona una sede"),
  reservation_date: z.string().min(1, "Selecciona una fecha"),
  reservation_time: z.string().min(1, "Selecciona una hora"),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
}

const timeSlots = [
  "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
  "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

const STEPS = [
  { id: 1, label: "Sede", icon: MapPin },
  { id: 2, label: "Servicio", icon: Scissors },
  { id: 3, label: "Barbero", icon: User },
  { id: 4, label: "Fecha", icon: Calendar },
  { id: 5, label: "Datos", icon: Phone },
];

export function ReservationModal({ open, onClose }: ReservationModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { data: locations = [] } = useLocations();
  const { data: services = [] } = useServices();
  const { data: barbers = [] } = usePublicBarbers();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      client_name: "",
      client_phone: "",
      client_email: "",
      service_id: "",
      barber_id: "",
      location_id: "",
      reservation_date: "",
      reservation_time: "",
    },
  });

  const watchedValues = watch();
  const selectedService = services.find((s) => s.id === watchedValues.service_id);
  const selectedBarber = barbers.find((b) => b.id === watchedValues.barber_id);
  const selectedLocation = locations.find((l) => l.id === watchedValues.location_id);

  const canProceed = () => {
    switch (step) {
      case 1: return !!watchedValues.location_id;
      case 2: return !!watchedValues.service_id;
      case 3: return !!watchedValues.barber_id;
      case 4: return !!watchedValues.reservation_date && !!watchedValues.reservation_time;
      case 5: return !!watchedValues.client_name && !!watchedValues.client_phone;
      default: return false;
    }
  };

  const onSubmit = async (data: ReservationFormData) => {
    try {
      setIsSubmitting(true);
      await createReservation({
        client_name: data.client_name,
        client_phone: data.client_phone,
        client_email: data.client_email || undefined,
        service_id: data.service_id,
        barber_id: data.barber_id,
        location_id: data.location_id,
        reservation_date: data.reservation_date,
        reservation_time: data.reservation_time,
      });
      setSuccess(true);

      // Auto-send WhatsApp confirmation
      const svc = services.find(s => s.id === data.service_id);
      const barber = barbers.find(b => b.id === data.barber_id);
      const loc = locations.find(l => l.id === data.location_id);
      if (svc && barber && loc) {
        const { sendReservationConfirmation } = await import("@/lib/whatsapp");
        sendReservationConfirmation({
          clientName: data.client_name,
          clientPhone: data.client_phone,
          serviceName: svc.name,
          barberName: barber.full_name,
          date: selectedDate ? format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es }) : data.reservation_date,
          time: data.reservation_time,
          locationName: loc.name,
        });
      }

      toast({
        title: "¡Reserva confirmada!",
        description: "Te contactaremos pronto para confirmar tu cita.",
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la reserva. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSuccess(false);
    setSelectedDate(undefined);
    setStep(1);
    onClose();
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  // Success state
  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md p-0 border-barber-border bg-barber-bg overflow-hidden">
          <div className="relative flex flex-col items-center py-12 px-8 text-center">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 mx-auto shadow-[0_0_40px_hsl(358_77%_46%/0.3)]">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-display text-3xl text-barber-text mb-2">¡Reserva Confirmada!</h2>
              <p className="text-barber-muted mb-2">
                Tu cita ha sido registrada exitosamente.
              </p>
              <p className="text-barber-muted text-sm mb-8">
                Te contactaremos por WhatsApp para confirmar los detalles.
              </p>

              {/* Summary card */}
              <div className="w-full rounded-xl bg-barber-card border border-barber-border p-4 mb-6 text-left space-y-2">
                {selectedService && (
                  <div className="flex justify-between text-sm">
                    <span className="text-barber-muted">Servicio</span>
                    <span className="text-barber-text font-medium">{selectedService.name}</span>
                  </div>
                )}
                {selectedBarber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-barber-muted">Barbero</span>
                    <span className="text-barber-text font-medium">{selectedBarber.full_name}</span>
                  </div>
                )}
                {selectedDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-barber-muted">Fecha</span>
                    <span className="text-barber-text font-medium">{format(selectedDate, "PPP", { locale: es })}</span>
                  </div>
                )}
                {watchedValues.reservation_time && (
                  <div className="flex justify-between text-sm">
                    <span className="text-barber-muted">Hora</span>
                    <span className="text-barber-text font-medium">{watchedValues.reservation_time}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleClose}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_hsl(358_77%_46%/0.3)] transition-all"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 border-barber-border bg-barber-bg overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-barber-border">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent" />
          <div className="relative flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_hsl(358_77%_46%/0.2)]">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl text-barber-text">Reservar Cita</h2>
              <p className="text-barber-muted text-xs">Paso {step} de 5 — {STEPS[step - 1].label}</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="relative flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center">
                <div
                  className={cn(
                    "h-1.5 w-full rounded-full transition-all duration-500",
                    step > s.id
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : step === s.id
                      ? "bg-primary/60"
                      : "bg-barber-border"
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[60vh]">
          <div className="px-6 py-5">
            {/* Step 1: Location */}
            {step === 1 && (
              <div className="space-y-3">
                <h3 className="font-display text-lg text-barber-text mb-1">¿A qué sede asistirás?</h3>
                <p className="text-barber-muted text-sm mb-4">Selecciona la sucursal más cercana a ti.</p>
                <div className="grid gap-3">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => setValue("location_id", location.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all duration-300 group",
                        watchedValues.location_id === location.id
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(358_77%_46%/0.1)]"
                          : "border-barber-border bg-barber-card hover:border-barber-muted"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            watchedValues.location_id === location.id
                              ? "bg-primary text-white"
                              : "bg-barber-border text-barber-muted"
                          )}
                        >
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-barber-text font-semibold">{location.name}</p>
                          <p className="text-barber-muted text-sm">{location.address}</p>
                          {location.schedule && (
                            <p className="text-barber-muted text-xs mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {location.schedule}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                  {locations.length === 0 && (
                    <p className="text-barber-muted text-center py-8">No hay sedes disponibles aún.</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Service */}
            {step === 2 && (
              <div className="space-y-3">
                <h3 className="font-display text-lg text-barber-text mb-1">¿Qué servicio deseas?</h3>
                <p className="text-barber-muted text-sm mb-4">Todos incluyen lavado, cepillado y productos premium.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setValue("service_id", service.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden",
                        watchedValues.service_id === service.id
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(358_77%_46%/0.1)]"
                          : "border-barber-border bg-barber-card hover:border-barber-muted"
                      )}
                    >
                      {service.is_popular && (
                        <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
                          <Star className="h-3 w-3 fill-current" /> Popular
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-widest text-barber-muted font-semibold">
                        {service.category}
                      </span>
                      <p className="text-barber-text font-semibold mt-0.5 leading-tight">{service.name}</p>
                      {service.description && (
                        <p className="text-barber-muted text-xs mt-1 line-clamp-2">{service.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-barber-border">
                        <span className="text-barber-muted text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatDuration(service.duration_minutes)}
                        </span>
                        <span className="font-display text-lg font-extrabold text-primary">S/{service.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Barber */}
            {step === 3 && (
              <div className="space-y-3">
                <h3 className="font-display text-lg text-barber-text mb-1">Elige tu barbero</h3>
                <p className="text-barber-muted text-sm mb-4">Nuestros maestros del oficio a tu servicio.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {barbers.map((barber) => (
                    <button
                      key={barber.id}
                      type="button"
                      onClick={() => setValue("barber_id", barber.id)}
                      className={cn(
                        "text-center p-4 rounded-xl border transition-all duration-300",
                        watchedValues.barber_id === barber.id
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(358_77%_46%/0.1)]"
                          : "border-barber-border bg-barber-card hover:border-barber-muted"
                      )}
                    >
                      <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-barber-border">
                        {barber.photo_url ? (
                          <img
                            src={barber.photo_url}
                            alt={barber.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-barber-card to-barber-bg flex items-center justify-center">
                            <span className="font-display text-lg font-extrabold text-primary/30">
                              {barber.full_name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-barber-text font-semibold text-sm">{barber.full_name}</p>
                      {barber.specialty && (
                        <p className="text-barber-muted text-xs mt-0.5">{barber.specialty}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Date & Time */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg text-barber-text mb-1">¿Cuándo te viene mejor?</h3>
                  <p className="text-barber-muted text-sm mb-4">Selecciona fecha y hora para tu cita.</p>
                </div>

                {/* Date picker */}
                <div className="space-y-2">
                  <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Fecha
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-barber-card border-barber-border text-barber-text hover:bg-barber-card hover:border-barber-muted",
                          !selectedDate && "text-barber-muted",
                          errors.reservation_date && "border-destructive"
                        )}
                      >
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        {selectedDate
                          ? format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })
                          : "Selecciona una fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-barber-card border-barber-border" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          if (date) {
                            setValue("reservation_date", format(date, "yyyy-MM-dd"));
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time slots */}
                <div className="space-y-2">
                  <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Hora
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setValue("reservation_time", time)}
                        className={cn(
                          "py-2.5 px-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                          watchedValues.reservation_time === time
                            ? "border-primary bg-primary text-white shadow-[0_0_15px_hsl(358_77%_46%/0.3)]"
                            : "border-barber-border bg-barber-card text-barber-muted hover:border-barber-muted hover:text-barber-text"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Personal data */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-lg text-barber-text mb-1">Tus datos de contacto</h3>
                  <p className="text-barber-muted text-sm mb-4">Para confirmar tu reserva por WhatsApp.</p>
                </div>

                {/* Summary */}
                <div className="rounded-xl bg-barber-card border border-barber-border p-4 space-y-2 mb-4">
                  <p className="text-xs uppercase tracking-wider text-barber-muted font-semibold mb-2">Resumen de tu cita</p>
                  {selectedLocation && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-barber-text">{selectedLocation.name}</span>
                    </div>
                  )}
                  {selectedService && (
                    <div className="flex items-center gap-2 text-sm">
                      <Scissors className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-barber-text">{selectedService.name}</span>
                      <span className="text-primary font-bold ml-auto">S/{selectedService.price}</span>
                    </div>
                  )}
                  {selectedBarber && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-barber-text">{selectedBarber.full_name}</span>
                    </div>
                  )}
                  {selectedDate && watchedValues.reservation_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-barber-text">
                        {format(selectedDate, "d MMM yyyy", { locale: es })} a las {watchedValues.reservation_time}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" /> Nombre completo *
                    </label>
                    <Input
                      placeholder="Tu nombre completo"
                      {...register("client_name")}
                      className={cn(
                        "bg-barber-card border-barber-border text-barber-text placeholder:text-barber-muted/50 focus:border-primary",
                        errors.client_name && "border-destructive"
                      )}
                    />
                    {errors.client_name && <p className="text-xs text-destructive">{errors.client_name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" /> WhatsApp / Teléfono *
                    </label>
                    <Input
                      placeholder="987 654 321"
                      {...register("client_phone")}
                      className={cn(
                        "bg-barber-card border-barber-border text-barber-text placeholder:text-barber-muted/50 focus:border-primary",
                        errors.client_phone && "border-destructive"
                      )}
                    />
                    {errors.client_phone && <p className="text-xs text-destructive">{errors.client_phone.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" /> Email (opcional)
                    </label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      {...register("client_email")}
                      className="bg-barber-card border-barber-border text-barber-text placeholder:text-barber-muted/50 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer navigation */}
          <div className="px-6 py-4 border-t border-barber-border flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(step - 1)}
                className="text-barber-muted hover:text-barber-text"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Atrás
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button
                type="button"
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
                className={cn(
                  "px-6 rounded-xl font-semibold transition-all duration-300",
                  canProceed()
                    ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_25px_hsl(358_77%_46%/0.3)]"
                    : "bg-barber-border text-barber-muted cursor-not-allowed"
                )}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !canProceed()}
                className="px-6 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_30px_hsl(358_77%_46%/0.3)] transition-all duration-300"
              >
                {isSubmitting ? (
                  <>Procesando...</>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Confirmar Reserva
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
