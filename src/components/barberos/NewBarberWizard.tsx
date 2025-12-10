import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface NewBarberWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (barber: any) => void;
}

const steps = [
  { id: 1, name: "Información Personal" },
  { id: 2, name: "Servicios y Tarifas" },
  { id: 3, name: "Revisión y Confirmación" },
];

export function NewBarberWizard({ open, onOpenChange, onSave }: NewBarberWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    dni: "",
    specialty: "",
    phone: "",
    email: "",
    workType: "fulltime",
    status: "active",
    hireDate: new Date().toISOString().split("T")[0],
  });
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "", price: 0, duration: 30 },
  ]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    setServices((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", price: 0, duration: 30 },
    ]);
  };

  const removeService = (id: string) => {
    if (services.length > 1) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const updateService = (id: string, field: string, value: string | number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error("El nombre es requerido");
      return false;
    }
    if (!formData.dni.trim() || formData.dni.length < 8) {
      toast.error("DNI inválido (mínimo 8 caracteres)");
      return false;
    }
    if (!formData.specialty) {
      toast.error("Selecciona una especialidad");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const validServices = services.filter((s) => s.name.trim() && s.price > 0);
    if (validServices.length === 0) {
      toast.error("Agrega al menos un servicio válido");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    const validServices = services.filter((s) => s.name.trim() && s.price > 0);
    onSave({
      ...formData,
      services: validServices,
    });
    toast.success("Barbero guardado correctamente");
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      name: "",
      dni: "",
      specialty: "",
      phone: "",
      email: "",
      workType: "fulltime",
      status: "active",
      hireDate: new Date().toISOString().split("T")[0],
    });
    setServices([{ id: "1", name: "", price: 0, duration: 30 }]);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Nuevo Barbero
          </DialogTitle>
          <DialogDescription>
            Completa la información en {steps.length} pasos
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    currentStep > step.id
                      ? "bg-success text-success-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "ml-2 text-sm font-medium hidden sm:block",
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-4 rounded",
                    currentStep > step.id ? "bg-success" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground font-display text-3xl">
                    {formData.name ? formData.name[0].toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  placeholder="Nombre del barbero"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  placeholder="12345678"
                  value={formData.dni}
                  onChange={(e) => updateFormData("dni", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad *</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(v) => updateFormData("specialty", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corte Clásico">Corte Clásico</SelectItem>
                    <SelectItem value="Fade">Fade</SelectItem>
                    <SelectItem value="Barba">Barba</SelectItem>
                    <SelectItem value="Diseño">Diseño</SelectItem>
                    <SelectItem value="Mixto">Mixto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+52 55 1234 5678"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <Label>Tipo de Jornada</Label>
              <RadioGroup
                value={formData.workType}
                onValueChange={(v) => updateFormData("workType", v)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fulltime" id="fulltime" />
                  <Label htmlFor="fulltime" className="font-normal cursor-pointer">
                    Tiempo Completo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parttime" id="parttime" />
                  <Label htmlFor="parttime" className="font-normal cursor-pointer">
                    Medio Tiempo
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label htmlFor="status">Estado Inicial</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => updateFormData("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate">Fecha de Ingreso</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => updateFormData("hireDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Services and Rates */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Agrega los servicios que ofrece este barbero con sus precios y duración estimada.
            </p>

            <div className="space-y-3">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    {index + 1}.
                  </span>
                  <Input
                    placeholder="Nombre del servicio"
                    value={service.name}
                    onChange={(e) =>
                      updateService(service.id, "name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={service.price || ""}
                      onChange={(e) =>
                        updateService(service.id, "price", parseFloat(e.target.value) || 0)
                      }
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      placeholder="30"
                      value={service.duration || ""}
                      onChange={(e) =>
                        updateService(service.id, "duration", parseInt(e.target.value) || 0)
                      }
                      className="w-16"
                    />
                    <span className="text-muted-foreground text-sm">min</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeService(service.id)}
                    disabled={services.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={addService}
            >
              <Plus className="h-4 w-4" />
              Agregar Servicio
            </Button>
          </div>
        )}

        {/* Step 3: Review and Confirm */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-display text-xl">
                  {formData.name ? formData.name[0].toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{formData.name || "Sin nombre"}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">{formData.specialty || "Sin especialidad"}</Badge>
                  <Badge variant={formData.status === "active" ? "success" : "muted"}>
                    {formData.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">DNI</p>
                <p className="font-medium">{formData.dni || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{formData.phone || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{formData.email || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tipo de Jornada</p>
                <p className="font-medium">
                  {formData.workType === "fulltime" ? "Tiempo Completo" : "Medio Tiempo"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                <p className="font-medium">
                  {new Date(formData.hireDate).toLocaleDateString("es-MX")}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium mb-3">
                Servicios ({services.filter((s) => s.name && s.price).length})
              </p>
              <div className="space-y-2">
                {services
                  .filter((s) => s.name && s.price)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-2 rounded bg-muted/30"
                    >
                      <span className="font-medium">{service.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">
                          {service.duration} min
                        </span>
                        <span className="font-display text-lg text-primary">
                          ${service.price}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="gap-2">
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSave} className="gap-2">
                <Check className="h-4 w-4" />
                Guardar Barbero
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
