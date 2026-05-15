import { useState } from "react";
import { MapPin, Phone, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocations } from "@/hooks/usePublicData";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const { toast } = useToast();
  const { data: locations = [] } = useLocations();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensaje enviado",
      description: "Te responderemos lo antes posible.",
    });
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <section id="contacto" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-[0.2em] uppercase text-sm">
            Encuéntranos
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            VISÍTANOS O CONTÁCTANOS
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Varias sucursales para tu comodidad. Ven a conocernos o agenda tu cita por WhatsApp.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => window.open("https://maps.google.com", "_blank")}
              >
                <MapPin className="h-5 w-5" />
                Cómo llegar
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2 bg-success hover:bg-success/90"
                onClick={() => window.open("https://wa.me/51970772564", "_blank")}
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {locations.map((location) => (
                <div key={location.id} className="card-elevated p-4">
                  <h4 className="font-display text-lg mb-2">{location.name}</h4>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{location.address}</span>
                  </div>
                </div>
              ))}

              <div className="card-elevated p-4">
                <h4 className="font-display text-lg mb-2">WhatsApp</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>970 772 564</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Reservas y consultas
                </p>
              </div>

              <div className="card-elevated p-4">
                <h4 className="font-display text-lg mb-2">Horario</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <div>
                    <p>Lun - Sáb: 9:30 AM - 9:00 PM</p>
                    <p>Dom: 9:30 AM - 8:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-elevated p-6">
            <h3 className="font-display text-2xl mb-6">Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <Textarea
                placeholder="Mensaje"
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" />
                Enviar Mensaje
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                ✓ Respuesta rápida
              </span>
              <span className="flex items-center gap-1">
                ✓ 24h máximo
              </span>
              <span className="flex items-center gap-1">
                ✓ WhatsApp disponible
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
