import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, User, Phone, Mail, Scissors, MapPin, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
];

export function ReservationModal({ open, onClose }: ReservationModalProps) {
  const { toast } = useToast();
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

  const watchedServiceId = watch("service_id");
  const selectedService = services.find(s => s.id === watchedServiceId);

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
    onClose();
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-8 text-center">
            <div className="rounded-full bg-success/10 p-4 mb-4">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h2 className="font-display text-2xl mb-2">¡Reserva Confirmada!</h2>
            <p className="text-muted-foreground mb-6">
              Te hemos enviado los detalles a tu teléfono. Nos vemos pronto.
            </p>
            <Button onClick={handleClose} className="w-full">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            Reservar Cita
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client_name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre completo *
              </Label>
              <Input
                id="client_name"
                placeholder="Tu nombre"
                {...register("client_name")}
                className={errors.client_name ? "border-destructive" : ""}
              />
              {errors.client_name && (
                <p className="text-sm text-destructive">{errors.client_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Teléfono *
              </Label>
              <Input
                id="client_phone"
                placeholder="987 654 321"
                {...register("client_phone")}
                className={errors.client_phone ? "border-destructive" : ""}
              />
              {errors.client_phone && (
                <p className="text-sm text-destructive">{errors.client_phone.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="client_email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo electrónico (opcional)
              </Label>
              <Input
                id="client_email"
                type="email"
                placeholder="tu@email.com"
                {...register("client_email")}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Sede *
            </Label>
            <Select onValueChange={(value) => setValue("location_id", value)}>
              <SelectTrigger className={errors.location_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecciona una sede" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    <div className="flex flex-col">
                      <span>{location.name}</span>
                      <span className="text-xs text-muted-foreground">{location.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location_id && (
              <p className="text-sm text-destructive">{errors.location_id.message}</p>
            )}
          </div>

          {/* Service */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Servicio *
            </Label>
            <Select onValueChange={(value) => setValue("service_id", value)}>
              <SelectTrigger className={errors.service_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{service.name}</span>
                      <span className="text-primary font-semibold">S/ {service.price}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedService && (
              <p className="text-sm text-muted-foreground">
                ⏱ {selectedService.duration_minutes} min • {selectedService.description}
              </p>
            )}
            {errors.service_id && (
              <p className="text-sm text-destructive">{errors.service_id.message}</p>
            )}
          </div>

          {/* Barber */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Barbero *
            </Label>
            <Select onValueChange={(value) => setValue("barber_id", value)}>
              <SelectTrigger className={errors.barber_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecciona un barbero" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    <div className="flex items-center gap-2">
                      {barber.photo_url ? (
                        <img
                          src={barber.photo_url}
                          alt={barber.full_name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-3 w-3" />
                        </div>
                      )}
                      <span>{barber.full_name}</span>
                      {barber.specialty && (
                        <span className="text-xs text-muted-foreground">• {barber.specialty}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.barber_id && (
              <p className="text-sm text-destructive">{errors.barber_id.message}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                      errors.reservation_date && "border-destructive"
                    )}
                  >
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: es })
                    ) : (
                      "Selecciona una fecha"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
                  />
                </PopoverContent>
              </Popover>
              {errors.reservation_date && (
                <p className="text-sm text-destructive">{errors.reservation_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hora *
              </Label>
              <Select onValueChange={(value) => setValue("reservation_time", value)}>
                <SelectTrigger className={errors.reservation_time ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecciona hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.reservation_time && (
                <p className="text-sm text-destructive">{errors.reservation_time.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Procesando...</>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Confirmar Reserva
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
