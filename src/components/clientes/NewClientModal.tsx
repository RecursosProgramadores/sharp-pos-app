import { useState } from "react";
import { X, Upload, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface NewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: any) => void;
}

const services = [
  "Corte Clásico",
  "Fade",
  "Barba",
  "Diseño",
  "Corte + Barba",
  "Tratamiento Capilar",
  "Coloración",
];

const barbers = [
  { id: 1, name: "Carlos Mendoza" },
  { id: 2, name: "Miguel Torres" },
  { id: 3, name: "Roberto García" },
  { id: 4, name: "Juan Pérez" },
];

export function NewClientModal({ open, onOpenChange, onSave }: NewClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    preferredServices: [] as string[],
    preferredBarber: "",
    notes: "",
    photo: "",
  });

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredServices: prev.preferredServices.includes(service)
        ? prev.preferredServices.filter((s) => s !== service)
        : [...prev.preferredServices, service],
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("El teléfono es obligatorio");
      return;
    }
    
    onSave({
      ...formData,
      id: Date.now(),
      visits: 0,
      totalSpent: 0,
      lastVisit: new Date().toISOString().split("T")[0],
      level: "new",
      points: 0,
    });
    
    setFormData({
      name: "",
      phone: "",
      email: "",
      birthDate: "",
      preferredServices: [],
      preferredBarber: "",
      notes: "",
      photo: "",
    });
    
    toast.success("Cliente registrado exitosamente");
    onOpenChange(false);
  };

  const initials = formData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Nuevo Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Photo Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-dashed border-primary/30">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {initials || <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Subir Foto
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG. Máx 2MB
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  placeholder="+52 55 1234 5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Para recordatorios y descuentos especiales
              </p>
            </div>
          </div>

          {/* Preferred Services */}
          <div className="space-y-3">
            <Label>Servicios Preferidos</Label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.preferredServices.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
                  <label
                    htmlFor={service}
                    className="text-sm cursor-pointer"
                  >
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Barber */}
          <div className="grid gap-2">
            <Label htmlFor="barber">Barbero Preferido</Label>
            <Select
              value={formData.preferredBarber}
              onValueChange={(value) => setFormData({ ...formData, preferredBarber: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar barbero" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.name}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Observaciones / Notas</Label>
            <Textarea
              id="notes"
              placeholder="Alergias, preferencias especiales, estilo favorito..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Guardar Cliente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
