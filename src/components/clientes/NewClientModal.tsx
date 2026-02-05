import { useState, useRef, useEffect } from "react";
import { Upload, User, Camera, Star } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/types/client";
import type { ClientFormData } from "@/types/client";

interface Barber {
  id: string;
  full_name: string;
}

interface NewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: ClientFormData) => Promise<boolean>;
  uploadPhoto: (file: File) => Promise<string | null>;
}

const initialFormData: ClientFormData = {
  full_name: "",
  phone: "",
  email: "",
  birth_date: "",
  photo_url: "",
  preferred_barber_id: "",
  preferred_services: [],
  notes: "",
  satisfaction_rating: 0,
};

export function NewClientModal({ open, onOpenChange, onSave, uploadPhoto }: NewClientModalProps) {
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      const { data } = await supabase
        .from("barbers")
        .select("id, full_name")
        .eq("active", true)
        .order("full_name");
      
      if (data) setBarbers(data);
    };

    if (open) {
      fetchBarbers();
    }
  }, [open]);

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      preferred_services: prev.preferred_services.includes(service)
        ? prev.preferred_services.filter((s) => s !== service)
        : [...prev.preferred_services, service],
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    const url = await uploadPhoto(file);
    if (url) {
      setFormData((prev) => ({ ...prev, photo_url: url }));
    }
    setUploading(false);
  };

  const handleSatisfactionRating = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      satisfaction_rating: prev.satisfaction_rating === rating ? 0 : rating,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.full_name.trim()) {
      return;
    }
    if (!formData.phone.trim()) {
      return;
    }

    setSaving(true);
    const success = await onSave(formData);
    setSaving(false);

    if (success) {
      setFormData(initialFormData);
      setPreviewUrl("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setPreviewUrl("");
    onOpenChange(false);
  };

  const initials = formData.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const selectedBarber = barbers.find((b) => b.id === formData.preferred_barber_id);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Nuevo Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Photo Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-dashed border-primary/30 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl || formData.photo_url ? (
                <AvatarImage src={previewUrl || formData.photo_url} alt="Preview" />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {initials || <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>Subiendo...</>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Subir Foto
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG. Máx 2MB
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                placeholder="Juan Pérez"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
              <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Para recordatorios y descuentos especiales
              </p>
            </div>
          </div>

          {/* Preferred Barber */}
          <div className="grid gap-2">
            <Label htmlFor="barber">Barbero que Atendió *</Label>
            <Select
              value={formData.preferred_barber_id}
              onValueChange={(value) => setFormData({ ...formData, preferred_barber_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar barbero" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Satisfaction Rating */}
          {formData.preferred_barber_id && (
            <div className="grid gap-2">
              <Label>Nivel de Satisfacción</Label>
              <p className="text-xs text-muted-foreground">
                ¿Qué tan satisfecho quedó con el servicio de {selectedBarber?.full_name}?
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleSatisfactionRating(rating)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= formData.satisfaction_rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {formData.satisfaction_rating > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formData.satisfaction_rating === 1 && "Muy insatisfecho"}
                  {formData.satisfaction_rating === 2 && "Insatisfecho"}
                  {formData.satisfaction_rating === 3 && "Regular"}
                  {formData.satisfaction_rating === 4 && "Satisfecho"}
                  {formData.satisfaction_rating === 5 && "Muy satisfecho"}
                </p>
              )}
            </div>
          )}

          {/* Preferred Services */}
          <div className="space-y-3">
            <Label>Servicios Preferidos</Label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.preferred_services.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
                  <label htmlFor={service} className="text-sm cursor-pointer">
                    {service}
                  </label>
                </div>
              ))}
            </div>
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
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || uploading}>
            {saving ? "Guardando..." : "Guardar Cliente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
