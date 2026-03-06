import { useState, useEffect } from "react";
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
  ChevronDown,
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
  preSelectedServiceId?: string;
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

const CATEGORY_ORDER = ["Cortes", "Degradados", "Ondulados", "Tintes", "Otros Servicios"];

export function ReservationModal({ open, onClose, preSelectedServiceId }: ReservationModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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

  // Pre-select service when modal opens with a preSelectedServiceId
  useEffect(() => {
    if (open && preSelectedServiceId) {
      setValue("service_id", preSelectedServiceId);
      // Find the category of the pre-selected service to expand it
      const svc = services.find(s => s.id === preSelectedServiceId);
      if (svc) {
        setExpandedCategory(svc.category);
      }
    }
  }, [open, preSelectedServiceId, services, setValue]);

  const watchedValues = watch();
  const selectedService = services.find((s) => s.id === watchedValues.service_id);
  const selectedBarber = barbers.find((b) => b.id === watchedValues.barber_id);
  const selectedLocation = locations.find((l) => l.id === watchedValues.location_id);

  // Group services by category
  const servicesByCategory: Record<string, typeof services> = {};
  services.forEach((s) => {
    if (!servicesByCategory[s.category]) servicesByCategory[s.category] = [];
    servicesByCategory[s.category].push(s);
  });
  const orderedCategories = CATEGORY_ORDER.filter((c) => servicesByCategory[c]?.length > 0);
  // Add any categories not in CATEGORY_ORDER
  Object.keys(servicesByCategory).forEach((c) => {
    if (!orderedCategories.includes(c)) orderedCategories.push(c);
  });

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

  // Auto-advance when selecting location
  const handleSelectLocation = (id: string) => {
    setValue("location_id", id);
    setTimeout(() => setStep(2), 350);
  };

  // Auto-advance when selecting service
  const handleSelectService = (id: string) => {
    setValue("service_id", id);
    setTimeout(() => setStep(3), 350);
  };

  // Auto-advance when selecting barber
  const handleSelectBarber = (id: string) => {
    setValue("barber_id", id);
    setTimeout(() => setStep(4), 350);
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
    setExpandedCategory(null);
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
            <div className="absolute inset-0 bg-gradient-to-b from-barber-red/10 via-transparent to-transparent" />
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-barber-red to-barber-orange flex items-center justify-center mb-6 mx-auto shadow-[0_0_40px_hsl(358_77%_46%/0.3)]">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-display text-3xl text-barber-text mb-2">¡Reserva Confirmada!</h2>
              <p className="text-barber-muted mb-2">Tu cita ha sido registrada exitosamente.</p>
              <p className="text-barber-muted text-sm mb-8">Te contactaremos por WhatsApp para confirmar los detalles.</p>

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
                className="w-full py-3 bg-gradient-to-r from-barber-red to-barber-orange text-white font-semibold rounded-xl hover:shadow-[0_0_30px_hsl(358_77%_46%/0.3)] transition-all"
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
          <div className="absolute inset-0 bg-gradient-to-r from-barber-red/5 via-barber-orange/5 to-transparent" />
          <div className="relative flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-barber-red to-barber-orange flex items-center justify-center shadow-[0_0_20px_hsl(358_77%_46%/0.2)]">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl text-barber-text">Reservar Cita</h2>
              <p className="text-barber-muted text-xs">Paso {step} de 5 — {STEPS[step - 1].label}</p>
            </div>
          </div>

          {/* Step indicator - clickable dots */}
          <div className="relative flex items-center gap-2">
            {STEPS.map((s) => {
              const StepIcon = s.icon;
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    if (isCompleted) setStep(s.id);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border",
                    isCompleted
                      ? "bg-barber-red/10 border-barber-red/30 text-barber-red cursor-pointer hover:bg-barber-red/20"
                      : isCurrent
                      ? "bg-barber-red text-white border-barber-red shadow-[0_0_15px_hsl(358_77%_46%/0.3)]"
                      : "bg-barber-card border-barber-border text-barber-muted cursor-default"
                  )}
                >
                  <StepIcon className="h-3 w-3" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
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
                      onClick={() => handleSelectLocation(location.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all duration-300 group",
                        watchedValues.location_id === location.id
                          ? "border-barber-red bg-barber-red/10 shadow-[0_0_20px_hsl(358_77%_46%/0.1)]"
                          : "border-barber-border bg-barber-card hover:border-barber-muted"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            watchedValues.location_id === location.id
                              ? "bg-barber-red text-white"
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

            {/* Step 2: Service - grouped by category */}
            {step === 2 && (
              <div className="space-y-3">
                <h3 className="font-display text-lg text-barber-text mb-1">¿Qué servicio deseas?</h3>
                <p className="text-barber-muted text-sm mb-4">Selecciona una categoría y elige tu servicio.</p>

                {/* Selected service indicator */}
                {selectedService && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-barber-red/10 border border-barber-red/30 mb-4">
                    <CheckCircle className="h-4 w-4 text-barber-red shrink-0" />
                    <span className="text-barber-text text-sm font-medium">{selectedService.name}</span>
                    <span className="text-barber-red font-bold ml-auto">S/{selectedService.price}</span>
                  </div>
                )}

                <div className="space-y-2">
                  {orderedCategories.map((category) => {
                    const catServices = servicesByCategory[category];
                    const isExpanded = expandedCategory === category;
                    const hasSelected = catServices.some(s => s.id === watchedValues.service_id);

                    return (
                      <div key={category} className="rounded-xl border border-barber-border overflow-hidden bg-barber-card">
                        {/* Category header */}
                        <button
                          type="button"
                          onClick={() => setExpandedCategory(isExpanded ? null : category)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300",
                            isExpanded
                              ? "bg-barber-red/5 border-b border-barber-border"
                              : "hover:bg-barber-bg/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                              hasSelected ? "bg-barber-red text-white" : "bg-barber-border text-barber-muted"
                            )}>
                              <Scissors className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <span className="text-barber-text font-semibold text-sm">{category}</span>
                              <span className="text-barber-muted text-xs ml-2">({catServices.length})</span>
                            </div>
                          </div>
                          <ChevronDown className={cn(
                            "h-4 w-4 text-barber-muted transition-transform duration-300",
                            isExpanded && "rotate-180"
                          )} />
                        </button>

                        {/* Services list */}
                        {isExpanded && (
                          <div className="divide-y divide-barber-border">
                            {catServices.map((service) => (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => handleSelectService(service.id)}
                                className={cn(
                                  "w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3",
                                  watchedValues.service_id === service.id
                                    ? "bg-barber-red/10"
                                    : "hover:bg-barber-bg/50"
                                )}
                              >
                                {/* Selection indicator */}
                                <div className={cn(
                                  "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all",
                                  watchedValues.service_id === service.id
                                    ? "border-barber-red bg-barber-red"
                                    : "border-barber-border"
                                )}>
                                  {watchedValues.service_id === service.id && (
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-barber-text font-medium text-sm">{service.name}</span>
                                    {service.is_popular && (
                                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-barber-orange">
                                        <Star className="h-2.5 w-2.5 fill-current" /> Popular
                                      </span>
                                    )}
                                  </div>
                                  {service.description && (
                                    <p className="text-barber-muted text-xs mt-0.5 line-clamp-1">{service.description}</p>
                                  )}
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-display text-base font-extrabold text-barber-red">S/{service.price}</span>
                                  <div className="text-barber-muted text-[10px] flex items-center gap-0.5 justify-end">
                                    <Clock className="h-2.5 w-2.5" />
                                    {formatDuration(service.duration_minutes)}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                      onClick={() => handleSelectBarber(barber.id)}
                      className={cn(
                        "text-center p-4 rounded-xl border transition-all duration-300",
                        watchedValues.barber_id === barber.id
                          ? "border-barber-red bg-barber-red/10 shadow-[0_0_20px_hsl(358_77%_46%/0.1)]"
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
                            <span className="font-display text-lg font-extrabold text-barber-red/30">
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

                <div className="space-y-2">
                  <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-barber-red" /> Fecha
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
                        <Calendar className="h-4 w-4 mr-2 text-barber-red" />
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
                        classNames={{
                          caption_label: "text-sm font-medium text-barber-text",
                          nav_button: "h-7 w-7 bg-transparent p-0 text-barber-muted hover:text-barber-text hover:bg-barber-border border border-barber-border rounded-md inline-flex items-center justify-center",
                          head_cell: "text-barber-muted rounded-md w-9 font-normal text-[0.8rem]",
                          day: "h-9 w-9 p-0 font-normal text-barber-text hover:bg-barber-border hover:text-barber-text rounded-md inline-flex items-center justify-center",
                          day_selected: "bg-barber-red text-white hover:bg-barber-red hover:text-white focus:bg-barber-red focus:text-white",
                          day_today: "bg-barber-border text-barber-text font-semibold",
                          day_outside: "text-barber-muted/40",
                          day_disabled: "text-barber-muted/30",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-barber-red" /> Hora
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
                            ? "border-barber-red bg-barber-red text-white shadow-[0_0_15px_hsl(358_77%_46%/0.3)]"
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

                <div className="rounded-xl bg-barber-card border border-barber-border p-4 space-y-2 mb-4">
                  <p className="text-xs uppercase tracking-wider text-barber-muted font-semibold mb-2">Resumen de tu cita</p>
                  {selectedLocation && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-barber-red shrink-0" />
                      <span className="text-barber-text">{selectedLocation.name}</span>
                    </div>
                  )}
                  {selectedService && (
                    <div className="flex items-center gap-2 text-sm">
                      <Scissors className="h-3.5 w-3.5 text-barber-red shrink-0" />
                      <span className="text-barber-text">{selectedService.name}</span>
                      <span className="text-barber-red font-bold ml-auto">S/{selectedService.price}</span>
                    </div>
                  )}
                  {selectedBarber && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3.5 w-3.5 text-barber-red shrink-0" />
                      <span className="text-barber-text">{selectedBarber.full_name}</span>
                    </div>
                  )}
                  {selectedDate && watchedValues.reservation_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-barber-red shrink-0" />
                      <span className="text-barber-text">
                        {format(selectedDate, "d MMM yyyy", { locale: es })} a las {watchedValues.reservation_time}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-barber-red" /> Nombre completo *
                    </label>
                    <Input
                      placeholder="Tu nombre completo"
                      {...register("client_name")}
                      className={cn(
                        "bg-barber-card border-barber-border text-barber-text placeholder:text-barber-muted/50 focus:border-barber-red",
                        errors.client_name && "border-destructive"
                      )}
                    />
                    {errors.client_name && <p className="text-xs text-destructive">{errors.client_name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-barber-red" /> WhatsApp / Teléfono *
                    </label>
                    <Input
                      placeholder="987 654 321"
                      {...register("client_phone")}
                      className={cn(
                        "bg-barber-card border-barber-border text-barber-text placeholder:text-barber-muted/50 focus:border-barber-red",
                        errors.client_phone && "border-destructive"
                      )}
                    />
                    {errors.client_phone && <p className="text-xs text-destructive">{errors.client_phone.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-barber-text text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-barber-red" /> Email (opcional)
                    </label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      {...register("client_email")}
                      className="bg-barber-card border-barber-border text-barber-text placeholder:text-barber-muted/50 focus:border-barber-red"
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
                    ? "bg-gradient-to-r from-barber-red to-barber-orange text-white hover:shadow-[0_0_25px_hsl(358_77%_46%/0.3)]"
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
                className="px-6 rounded-xl font-semibold bg-gradient-to-r from-barber-red to-barber-orange text-white hover:shadow-[0_0_30px_hsl(358_77%_46%/0.3)] transition-all duration-300"
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
