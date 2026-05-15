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
  "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
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

  // Auto-select location if only one exists or when locations load
  useEffect(() => {
    if (locations.length > 0) {
      // For single location businesses, we use the first one
      setValue("location_id", locations[0].id);
    }
  }, [locations, setValue]);

  // Pre-select service when modal opens with a preSelectedServiceId
  useEffect(() => {
    if (open && preSelectedServiceId) {
      setValue("service_id", preSelectedServiceId);
      const svc = services.find(s => s.id === preSelectedServiceId);
      if (svc) {
        setExpandedCategory(svc.category);
      }
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

  // Group services by category
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

  // Auto-advance logic
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
        <DialogContent className="sm:max-w-md p-0 border-white/10 bg-[#050505] overflow-hidden">
          <div className="relative flex flex-col items-center py-16 px-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent" />
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center mb-8 mx-auto shadow-[0_0_50px_rgba(245,158,11,0.4)]">
                <CheckCircle className="h-12 w-12 text-black" />
              </div>
              <h2 className="font-display text-4xl font-black tracking-tighter text-white mb-3">¡Cita Reservada!</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Tu sesión ha sido registrada. <br />
                <span className="text-amber-500/70 font-medium uppercase tracking-widest text-[10px]">Te contactaremos por WhatsApp</span>
              </p>

              <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-6 mb-8 text-left space-y-3 backdrop-blur-md">
                {selectedService && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Servicio</span>
                    <span className="text-white font-bold tracking-tight">{selectedService.name}</span>
                  </div>
                )}
                {selectedBarber && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Maestro</span>
                    <span className="text-white font-bold tracking-tight">{selectedBarber.full_name}</span>
                  </div>
                )}
                {selectedDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Fecha</span>
                    <span className="text-white font-bold tracking-tight">{format(selectedDate, "PPP", { locale: es })}</span>
                  </div>
                )}
                {watchedValues.reservation_time && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Hora</span>
                    <span className="text-amber-500 font-black tracking-widest uppercase">{watchedValues.reservation_time}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleClose}
                className="w-full py-7 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl shadow-xl shadow-amber-500/10 transition-all text-lg"
              >
                FINALIZAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 border-white/10 bg-[#050505] overflow-hidden max-h-[92vh] shadow-3xl shadow-black">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent opacity-50" />
          <div className="relative flex items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-24 h-auto -ml-2">
                <img src={Logo} alt="Tayta BarberShop" className="w-full h-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
              </div>
              <div className="h-10 w-px bg-white/10 mx-2" />
              <div>
                <h2 className="font-display text-2xl font-black text-white tracking-tight uppercase">Reserva</h2>
                <p className="text-amber-500/70 text-[9px] font-black uppercase tracking-[0.3em]">Paso {step} de 4 — {STEPS[step - 1].label}</p>
              </div>
            </div>
          </div>

          {/* Step indicator */}
          <div className="relative flex items-center gap-3">
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
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border",
                    isCompleted
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500 cursor-pointer hover:bg-amber-500/20"
                      : isCurrent
                      ? "bg-amber-500 text-black border-amber-500 shadow-xl shadow-amber-500/20"
                      : "bg-white/5 border-white/5 text-zinc-600 cursor-default"
                  )}
                >
                  <StepIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[60vh] custom-scrollbar">
          <div className="px-8 py-8">
            {/* Step 1: Service */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">Selecciona un servicio</h3>
                  <p className="text-zinc-500 text-sm">Elige el estilo que mejor te defina.</p>
                </div>

                <div className="space-y-4">
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
                            "w-full flex items-center justify-between px-6 py-5 transition-all duration-500",
                            isExpanded ? "bg-amber-500/5" : ""
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                              hasSelected ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-white/5 text-zinc-500"
                            )}>
                              <Scissors className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                              <span className="text-white font-bold text-sm uppercase tracking-widest">{category}</span>
                              <p className="text-zinc-500 text-[10px] mt-0.5">{catServices.length} opciones disponibles</p>
                            </div>
                          </div>
                          <ChevronDown className={cn(
                            "h-5 w-5 text-zinc-600 transition-transform duration-700",
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
                                  "w-full text-left px-6 py-4 transition-all duration-300 flex items-center gap-4 group",
                                  watchedValues.service_id === service.id ? "bg-amber-500/10" : "hover:bg-white/5"
                                )}
                              >
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-500",
                                  watchedValues.service_id === service.id ? "border-amber-500 bg-amber-500 shadow-glow" : "border-white/10"
                                )}>
                                  {watchedValues.service_id === service.id && <CheckCircle className="h-3 w-3 text-black" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3">
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
                                  <span className="font-display text-lg font-black text-amber-500 tracking-tight">S/{service.price}</span>
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

            {/* Step 2: Barber */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">Elige tu barbero</h3>
                  <p className="text-zinc-500 text-sm">Nuestros expertos maestros están listos para atenderte.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {barbers.map((barber) => (
                    <button
                      key={barber.id}
                      type="button"
                      onClick={() => handleSelectBarber(barber.id)}
                      className={cn(
                        "relative text-center p-6 rounded-[2rem] border transition-all duration-700 group",
                        watchedValues.barber_id === barber.id
                          ? "border-amber-500 bg-amber-500/10 shadow-2xl shadow-amber-500/5 scale-105 z-10"
                          : "border-white/5 bg-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="w-24 h-24 rounded-[2rem] mx-auto mb-4 overflow-hidden border-2 border-white/10 group-hover:border-amber-500/50 transition-all duration-700">
                        {barber.photo_url ? (
                          <img
                            src={barber.photo_url}
                            alt={barber.full_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                            <span className="font-display text-xl font-black text-white/20 tracking-tighter">
                              {barber.full_name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-white font-bold text-sm tracking-tight">{barber.full_name}</p>
                      <p className="text-amber-500/70 text-[9px] font-black uppercase tracking-[0.2em] mt-2">{barber.specialty || "Professional Barber"}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">Fecha y hora</h3>
                  <p className="text-zinc-500 text-sm">Selecciona el momento perfecto para tu experiencia.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-500" /> Fecha del servicio
                    </label>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-md">
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
                        className="p-0 pointer-events-auto"
                        classNames={{
                          caption_label: "text-sm font-black text-white tracking-widest uppercase",
                          nav_button: "h-8 w-8 bg-white/5 p-0 text-zinc-400 hover:text-amber-500 hover:bg-white/10 border border-white/5 rounded-xl transition-all",
                          head_cell: "text-zinc-600 rounded-md w-10 font-bold text-[0.7rem] uppercase tracking-widest",
                          day: "h-10 w-10 p-0 font-medium text-white hover:bg-amber-500 hover:text-black rounded-xl inline-flex items-center justify-center transition-all duration-300",
                          day_selected: "bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-black",
                          day_today: "bg-white/10 text-amber-500",
                          day_outside: "text-zinc-800",
                          day_disabled: "text-zinc-800",
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" /> Horarios disponibles
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative">
                      {isLoadingAvailability && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl">
                          <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
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
                              "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 border relative overflow-hidden",
                              watchedValues.reservation_time === time
                                ? "border-amber-500 bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                                : isBooked
                                ? "border-white/5 bg-white/5 text-zinc-800 cursor-not-allowed grayscale"
                                : "border-white/5 bg-white/5 text-zinc-500 hover:border-white/20 hover:text-white"
                            )}
                          >
                            <span className={cn(isBooked && "line-through opacity-50")}>{time}</span>
                            {isBooked && (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[8px] text-amber-500/80 font-black tracking-widest">
                                OCUPADO
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Final Details */}
            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">Finalizar reserva</h3>
                  <p className="text-zinc-500 text-sm">Confirma tus datos para enviarte el recordatorio.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4 order-2 lg:order-1">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Nombre completo</label>
                        <Input
                          {...register("client_name")}
                          className="bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:border-amber-500 transition-all px-6"
                          placeholder="Ingresa tu nombre"
                        />
                        {errors.client_name && <p className="text-xs text-red-500 mt-1">{errors.client_name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">WhatsApp / Teléfono</label>
                        <Input
                          {...register("client_phone")}
                          className="bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:border-amber-500 transition-all px-6"
                          placeholder="Tu número de contacto"
                        />
                        {errors.client_phone && <p className="text-xs text-red-500 mt-1">{errors.client_phone.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Email (Opcional)</label>
                        <Input
                          {...register("client_email")}
                          className="bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:border-amber-500 transition-all px-6"
                          placeholder="tu@correo.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="order-1 lg:order-2">
                    <div className="rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-8 space-y-6 backdrop-blur-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Scissors className="w-24 h-24 text-amber-500" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Resumen del Servicio</h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-black text-xl tracking-tighter">{selectedService?.name}</p>
                            <p className="text-zinc-500 text-xs mt-1 italic">{selectedBarber?.full_name}</p>
                          </div>
                          <p className="text-amber-500 font-black text-2xl tracking-tighter">S/{selectedService?.price}</p>
                        </div>
                        
                        <div className="h-px bg-white/5" />
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-zinc-400">
                            <Calendar className="h-4 w-4 text-amber-500" />
                            <span className="text-xs font-medium uppercase tracking-widest">
                              {selectedDate ? format(selectedDate, "d MMM yyyy", { locale: es }) : "---"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-zinc-400">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-white">
                              {watchedValues.reservation_time || "---"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="px-8 py-8 border-t border-white/5 flex items-center justify-between gap-6 bg-[#050505]/80 backdrop-blur-xl">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(step - 1)}
                className="text-zinc-500 hover:text-white hover:bg-white/5 px-8 h-14 rounded-2xl transition-all font-bold uppercase tracking-widest text-xs"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
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
                  "px-12 h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-700",
                  canProceed()
                    ? "bg-amber-500 text-black hover:bg-amber-600 shadow-xl shadow-amber-500/20"
                    : "bg-white/5 text-zinc-700 cursor-not-allowed"
                )}
              >
                Continuar
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !canProceed()}
                className="px-12 h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-amber-500 text-black hover:bg-amber-600 shadow-2xl shadow-amber-500/30 transition-all duration-700"
              >
                {isSubmitting ? "Procesando..." : "Confirmar Cita"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
