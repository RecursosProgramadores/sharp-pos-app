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
  Scissors,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useLocations, useServices, usePublicBarbers, createReservation, useBarberAvailability } from "@/hooks/usePublicData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Logo from "@/assets/logotayta.png";

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
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
  "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

const STEPS = [
  { id: 1, label: "Servicio", icon: Scissors },
  { id: 2, label: "Barbero", icon: User },
  { id: 3, label: "Fecha", icon: Calendar },
  { id: 4, label: "Datos", icon: Phone },
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

  useEffect(() => {
    if (locations.length > 0) {
      setValue("location_id", locations[0].id);
    }
  }, [locations, setValue]);

  useEffect(() => {
    if (open && preSelectedServiceId) {
      setValue("service_id", preSelectedServiceId);
      const svc = services.find(s => s.id === preSelectedServiceId);
      if (svc) setExpandedCategory(svc.category);
    }
  }, [open, preSelectedServiceId, services, setValue]);

  const watchedValues = watch();
  const { data: bookedSlots = [], isLoading: isLoadingAvailability } = useBarberAvailability(
    watchedValues.barber_id,
    watchedValues.reservation_date
  );
  const selectedService = services.find((s) => s.id === watchedValues.service_id);
  const selectedBarber = barbers.find((b) => b.id === watchedValues.barber_id);
  const selectedLocation = locations.find((l) => l.id === watchedValues.location_id);

  const servicesByCategory: Record<string, typeof services> = {};
  services.forEach((s) => {
    if (!servicesByCategory[s.category]) servicesByCategory[s.category] = [];
    servicesByCategory[s.category].push(s);
  });
  const orderedCategories = CATEGORY_ORDER.filter((c) => servicesByCategory[c]?.length > 0);
  Object.keys(servicesByCategory).forEach((c) => {
    if (!orderedCategories.includes(c)) orderedCategories.push(c);
  });

  const canProceed = () => {
    switch (step) {
      case 1: return !!watchedValues.service_id;
      case 2: return !!watchedValues.barber_id;
      case 3: return !!watchedValues.reservation_date && !!watchedValues.reservation_time;
      case 4: return !!watchedValues.client_name && !!watchedValues.client_phone;
      default: return false;
    }
  };

  const handleSelectService = (id: string) => {
    setValue("service_id", id);
    setTimeout(() => setStep(2), 350);
  };

  const handleSelectBarber = (id: string) => {
    setValue("barber_id", id);
    setTimeout(() => setStep(3), 350);
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

      toast({ title: "¡Reserva confirmada!", description: "Te contactaremos pronto para confirmar tu cita." });
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({ title: "Error", description: "No se pudo crear la reserva. Intenta de nuevo.", variant: "destructive" });
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

  if (!open) return null;

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={handleClose}
        />
        {/* Sheet */}
        <div className="relative w-full sm:max-w-md mx-auto bg-[#050505] border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative flex flex-col items-center py-12 px-6 text-center">
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.4)]">
              <CheckCircle className="h-10 w-10 text-black" />
            </div>
            <h2 className="font-display text-3xl font-black tracking-tighter text-white mb-2">¡Cita Reservada!</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed text-sm">
              Tu sesión ha sido registrada.{" "}
              <span className="text-amber-500/70 font-medium">Te contactaremos por WhatsApp.</span>
            </p>

            <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-5 mb-6 text-left space-y-3">
              {selectedService && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Servicio</span>
                  <span className="text-white font-bold">{selectedService.name}</span>
                </div>
              )}
              {selectedBarber && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Maestro</span>
                  <span className="text-white font-bold">{selectedBarber.full_name}</span>
                </div>
              )}
              {selectedDate && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Fecha</span>
                  <span className="text-white font-bold">{format(selectedDate, "PPP", { locale: es })}</span>
                </div>
              )}
              {watchedValues.reservation_time && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Hora</span>
                  <span className="text-amber-500 font-black tracking-widest">{watchedValues.reservation_time}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleClose}
              className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all text-base"
            >
              FINALIZAR
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Modal ────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Sheet / Dialog */}
      <div className="relative w-full sm:max-w-2xl mx-auto bg-[#050505] border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[93dvh] sm:max-h-[90vh]">

        {/* ── Header ── */}
        <div className="relative shrink-0 px-5 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-5 border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />

          {/* Drag handle (mobile) */}
          <div className="sm:hidden w-10 h-1 rounded-full bg-white/10 mx-auto mb-4" />

          <div className="relative flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-16 sm:w-20 h-auto">
                <img src={Logo} alt="Tayta BarberShop" className="w-full h-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <h2 className="font-display text-lg sm:text-2xl font-black text-white tracking-tight uppercase">Reserva</h2>
                <p className="text-amber-500/70 text-[9px] font-black uppercase tracking-[0.25em]">
                  Paso {step} de 4 — {STEPS[step - 1].label}
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const StepIcon = s.icon;
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => { if (isCompleted) setStep(s.id); }}
                    className={cn(
                      "flex items-center justify-center gap-1.5 w-full py-2 px-2 sm:px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border",
                      isCompleted
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-500 cursor-pointer hover:bg-amber-500/20"
                        : isCurrent
                        ? "bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20"
                        : "bg-white/5 border-white/5 text-zinc-600 cursor-default"
                    )}
                  >
                    <StepIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden sm:inline truncate">{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={cn(
                      "h-px w-3 shrink-0 transition-all duration-700",
                      step > s.id ? "bg-amber-500/40" : "bg-white/5"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 py-6 custom-scrollbar">

            {/* STEP 1: Service */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1">Selecciona un servicio</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm">Elige el estilo que mejor te defina.</p>
                </div>

                <div className="space-y-3">
                  {orderedCategories.map((category) => {
                    const catServices = servicesByCategory[category];
                    const isExpanded = expandedCategory === category;
                    const hasSelected = catServices.some(s => s.id === watchedValues.service_id);

                    return (
                      <div key={category} className="rounded-2xl border border-white/5 overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/10">
                        <button
                          type="button"
                          onClick={() => setExpandedCategory(isExpanded ? null : category)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 transition-all duration-500",
                            isExpanded ? "bg-amber-500/5" : ""
                          )}
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={cn(
                              "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0",
                              hasSelected ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-white/5 text-zinc-500"
                            )}>
                              <Scissors className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div className="text-left">
                              <span className="text-white font-bold text-xs sm:text-sm uppercase tracking-widest">{category}</span>
                              <p className="text-zinc-500 text-[10px] mt-0.5">{catServices.length} opciones disponibles</p>
                            </div>
                          </div>
                          <ChevronDown className={cn(
                            "h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 transition-transform duration-700 shrink-0",
                            isExpanded && "rotate-180 text-amber-500"
                          )} />
                        </button>

                        {isExpanded && (
                          <div className="divide-y divide-white/5 bg-black/20 animate-fade-in">
                            {catServices.map((service) => (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => handleSelectService(service.id)}
                                className={cn(
                                  "w-full text-left px-4 sm:px-6 py-4 transition-all duration-300 flex items-center gap-3 sm:gap-4",
                                  watchedValues.service_id === service.id ? "bg-amber-500/10" : "hover:bg-white/5 active:bg-white/10"
                                )}
                              >
                                <div className={cn(
                                  "w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-500",
                                  watchedValues.service_id === service.id ? "border-amber-500 bg-amber-500" : "border-white/10"
                                )}>
                                  {watchedValues.service_id === service.id && <CheckCircle className="h-3 w-3 text-black" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-white font-medium text-sm">{service.name}</span>
                                    {service.is_popular && (
                                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  {service.description && (
                                    <p className="text-zinc-500 text-xs mt-1 line-clamp-1">{service.description}</p>
                                  )}
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-display text-base sm:text-lg font-black text-amber-500 tracking-tight">S/{service.price}</span>
                                  <div className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 justify-end mt-1">
                                    <Clock className="h-3 w-3" />
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

            {/* STEP 2: Barber */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1">Elige tu barbero</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm">Nuestros expertos maestros están listos para atenderte.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {barbers.map((barber) => (
                    <button
                      key={barber.id}
                      type="button"
                      onClick={() => handleSelectBarber(barber.id)}
                      className={cn(
                        "relative text-center p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border transition-all duration-700 active:scale-95",
                        watchedValues.barber_id === barber.id
                          ? "border-amber-500 bg-amber-500/10 shadow-2xl shadow-amber-500/5 scale-[1.03] z-10"
                          : "border-white/5 bg-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2rem] mx-auto mb-3 overflow-hidden border-2 border-white/10 transition-all duration-700">
                        {barber.photo_url ? (
                          <img
                            src={barber.photo_url}
                            alt={barber.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                            <span className="font-display text-lg sm:text-xl font-black text-white/20 tracking-tighter">
                              {barber.full_name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-white font-bold text-xs sm:text-sm tracking-tight leading-tight">{barber.full_name}</p>
                      <p className="text-amber-500/70 text-[9px] font-black uppercase tracking-[0.2em] mt-1">{barber.specialty || "Professional Barber"}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Date & Time */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1">Fecha y hora</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm">Selecciona el momento perfecto para tu experiencia.</p>
                </div>

                {/* Calendar */}
                <div className="space-y-3">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-500" /> Fecha del servicio
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-md overflow-x-auto">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) setValue("reservation_date", format(date, "yyyy-MM-dd"));
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      className="p-0 pointer-events-auto w-full"
                      classNames={{
                        caption_label: "text-sm font-black text-white tracking-widest uppercase",
                        nav_button: "h-8 w-8 bg-white/5 p-0 text-zinc-400 hover:text-amber-500 hover:bg-white/10 border border-white/5 rounded-xl transition-all",
                        head_cell: "text-zinc-600 rounded-md w-9 sm:w-10 font-bold text-[0.65rem] sm:text-[0.7rem] uppercase tracking-widest",
                        day: "h-9 w-9 sm:h-10 sm:w-10 p-0 font-medium text-white hover:bg-amber-500 hover:text-black rounded-xl inline-flex items-center justify-center transition-all duration-300",
                        day_selected: "bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-black",
                        day_today: "bg-white/10 text-amber-500",
                        day_outside: "text-zinc-800",
                        day_disabled: "text-zinc-800",
                      }}
                    />
                  </div>
                </div>

                {/* Time slots */}
                <div className="space-y-3">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" /> Horarios disponibles
                  </label>
                  <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {isLoadingAvailability && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl">
                        <Loader2 className="h-7 w-7 text-amber-500 animate-spin" />
                      </div>
                    )}
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setValue("reservation_time", time)}
                          className={cn(
                            "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 border relative overflow-hidden active:scale-95",
                            watchedValues.reservation_time === time
                              ? "border-amber-500 bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                              : isBooked
                              ? "border-white/5 bg-white/5 text-zinc-800 cursor-not-allowed grayscale"
                              : "border-white/5 bg-white/5 text-zinc-500 hover:border-white/20 hover:text-white"
                          )}
                        >
                          <span className={cn(isBooked && "line-through opacity-50")}>{time}</span>
                          {isBooked && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[7px] text-amber-500/80 font-black tracking-widest">
                              OCUPADO
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Personal Data */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1">Finalizar reserva</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm">Confirma tus datos para enviarte el recordatorio.</p>
                </div>

                {/* Summary card */}
                <div className="rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-4 sm:p-6 relative overflow-hidden backdrop-blur-2xl">
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <Scissors className="w-16 h-16 text-amber-500" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-3">Resumen del Servicio</p>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white font-black text-base sm:text-xl tracking-tighter">{selectedService?.name}</p>
                      <p className="text-zinc-500 text-xs mt-0.5 italic">{selectedBarber?.full_name}</p>
                    </div>
                    <p className="text-amber-500 font-black text-xl sm:text-2xl tracking-tighter">S/{selectedService?.price}</p>
                  </div>
                  <div className="h-px bg-white/5 mb-3" />
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Calendar className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="text-xs font-medium uppercase tracking-widest">
                        {selectedDate ? format(selectedDate, "d MMM yyyy", { locale: es }) : "---"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="text-xs font-black uppercase tracking-widest text-white">
                        {watchedValues.reservation_time || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Nombre completo</label>
                    <Input
                      {...register("client_name")}
                      className="bg-white/5 border-white/10 text-white h-12 sm:h-14 rounded-2xl focus:border-amber-500 transition-all px-5 text-sm"
                      placeholder="Ingresa tu nombre"
                    />
                    {errors.client_name && <p className="text-xs text-red-500">{errors.client_name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">WhatsApp / Teléfono</label>
                    <Input
                      {...register("client_phone")}
                      className="bg-white/5 border-white/10 text-white h-12 sm:h-14 rounded-2xl focus:border-amber-500 transition-all px-5 text-sm"
                      placeholder="Tu número de contacto"
                      type="tel"
                      inputMode="tel"
                    />
                    {errors.client_phone && <p className="text-xs text-red-500">{errors.client_phone.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Email (Opcional)</label>
                    <Input
                      {...register("client_email")}
                      className="bg-white/5 border-white/10 text-white h-12 sm:h-14 rounded-2xl focus:border-amber-500 transition-all px-5 text-sm"
                      placeholder="tu@correo.com"
                      type="email"
                      inputMode="email"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer Navigation ── */}
          <div className="shrink-0 px-5 sm:px-8 py-4 sm:py-6 border-t border-white/5 flex items-center justify-between gap-3 bg-[#050505]/90 backdrop-blur-xl safe-area-bottom">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(step - 1)}
                className="text-zinc-500 hover:text-white hover:bg-white/5 px-5 sm:px-8 h-12 sm:h-14 rounded-2xl transition-all font-bold uppercase tracking-widest text-xs"
              >
                <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
                Regresar
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                type="button"
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
                className={cn(
                  "px-8 sm:px-12 h-12 sm:h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-700",
                  canProceed()
                    ? "bg-amber-500 text-black hover:bg-amber-600 shadow-xl shadow-amber-500/20"
                    : "bg-white/5 text-zinc-700 cursor-not-allowed"
                )}
              >
                Continuar
                <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !canProceed()}
                className="px-8 sm:px-12 h-12 sm:h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-amber-500 text-black hover:bg-amber-600 shadow-2xl shadow-amber-500/30 transition-all duration-700 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Procesando...</>
                ) : (
                  "Confirmar Cita"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
