import { useState } from "react";
import {
  Store,
  Upload,
  Globe,
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  Facebook,
  Instagram,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const daysOfWeek = [
  { id: "monday", name: "Lunes" },
  { id: "tuesday", name: "Martes" },
  { id: "wednesday", name: "Miércoles" },
  { id: "thursday", name: "Jueves" },
  { id: "friday", name: "Viernes" },
  { id: "saturday", name: "Sábado" },
  { id: "sunday", name: "Domingo" },
];

const initialSchedule = daysOfWeek.map((day) => ({
  ...day,
  openTime: day.id === "sunday" ? "" : "09:00",
  closeTime: day.id === "sunday" ? "" : "20:00",
  closed: day.id === "sunday",
}));

export default function BusinessInfoTab() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [businessInfo, setBusinessInfo] = useState({
    name: "Barber Pro",
    tagline: "Tu estilo, nuestra pasión",
    taxId: "20123456789",
    address: "Av. Principal #123, Centro",
    phone: "+52 55 1234 5678",
    email: "contacto@barberpro.com",
    website: "www.barberpro.com",
    facebook: "https://facebook.com/barberpro",
    instagram: "https://instagram.com/barberpro",
    tiktok: "https://tiktok.com/@barberpro",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.1!2d-99.1332!3d19.4326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI1JzU3LjQiTiA5OcKwMDcnNTkuNSJX!5e0!3m2!1ses!2smx!4v1234567890",
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScheduleChange = (
    dayId: string,
    field: "openTime" | "closeTime" | "closed",
    value: string | boolean
  ) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              [field]: value,
              ...(field === "closed" && value === true
                ? { openTime: "", closeTime: "" }
                : {}),
            }
          : day
      )
    );
  };

  const handleSave = () => {
    toast({
      title: "Información guardada",
      description: "Los datos del negocio se han actualizado correctamente",
    });
  };

  const hours = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, "0")}:00`
  );

  return (
    <div className="space-y-6">
      {/* Logo Section */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Logo de la Barbería
          </CardTitle>
          <CardDescription>
            Imagen que aparecerá en recibos y el encabezado del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Logo
                  </span>
                </Button>
              </Label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <p className="text-xs text-muted-foreground">
                PNG, JPG hasta 2MB. Recomendado: 200x200px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Negocio</Label>
              <Input
                id="name"
                value={businessInfo.name}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Eslogan / Tagline</Label>
              <Input
                id="tagline"
                value={businessInfo.tagline}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, tagline: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxId">RUC / NIF / Tax ID</Label>
              <Input
                id="taxId"
                value={businessInfo.taxId}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, taxId: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  className="pl-10"
                  value={businessInfo.website}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, website: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección Completa</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                className="pl-10"
                value={businessInfo.address}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono Principal</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  className="pl-10"
                  value={businessInfo.phone}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de Contacto</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={businessInfo.email}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl">Redes Sociales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="facebook"
                  className="pl-10"
                  placeholder="URL de Facebook"
                  value={businessInfo.facebook}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, facebook: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  className="pl-10"
                  placeholder="URL de Instagram"
                  value={businessInfo.instagram}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, instagram: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tiktok"
                  className="pl-10"
                  placeholder="URL de TikTok"
                  value={businessInfo.tiktok}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, tiktok: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Horarios de Atención
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Día</TableHead>
                <TableHead>Apertura</TableHead>
                <TableHead>Cierre</TableHead>
                <TableHead className="text-center">Cerrado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((day) => (
                <TableRow key={day.id}>
                  <TableCell className="font-medium">{day.name}</TableCell>
                  <TableCell>
                    <Select
                      value={day.openTime}
                      onValueChange={(value) =>
                        handleScheduleChange(day.id, "openTime", value)
                      }
                      disabled={day.closed}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="--:--" />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={day.closeTime}
                      onValueChange={(value) =>
                        handleScheduleChange(day.id, "closeTime", value)
                      }
                      disabled={day.closed}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="--:--" />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={day.closed}
                      onCheckedChange={(checked) =>
                        handleScheduleChange(day.id, "closed", checked as boolean)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Map */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Mapa de Ubicación
          </CardTitle>
          <CardDescription>
            Agrega el iframe de Google Maps para mostrar tu ubicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapUrl">URL del Iframe de Google Maps</Label>
            <Textarea
              id="mapUrl"
              rows={2}
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={businessInfo.mapUrl}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, mapUrl: e.target.value })
              }
            />
          </div>
          {businessInfo.mapUrl && (
            <div className="rounded-xl overflow-hidden border border-border h-64">
              <iframe
                src={businessInfo.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del negocio"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" className="gap-2" onClick={handleSave}>
          <Save className="h-5 w-5" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
