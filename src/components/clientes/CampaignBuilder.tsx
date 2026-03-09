import { useState } from "react";
import {
  MessageCircle,
  Send,
  Users,
  Star,
  Gift,
  UserX,
  Megaphone,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusinessInfo, buildWhatsAppLink } from "@/hooks/useBusinessInfo";
import { toast } from "sonner";
import type { Client } from "@/types/client";

interface CampaignBuilderProps {
  clients: Client[];
}

type Segment = "all" | "vip" | "inactive" | "birthday";

const segments: { id: Segment; label: string; icon: any; desc: string }[] = [
  { id: "all", label: "Todos", icon: Users, desc: "Todos los clientes registrados" },
  { id: "vip", label: "VIP / Premium", icon: Star, desc: "Clientes VIP y Premium" },
  { id: "inactive", label: "Inactivos", icon: UserX, desc: "Sin visita en +60 días" },
  { id: "birthday", label: "Cumpleañeros", icon: Gift, desc: "Cumpleaños próximos 7 días" },
];

const templates: { id: string; label: string; icon: any; text: string }[] = [
  {
    id: "promo",
    label: "Promoción",
    icon: Megaphone,
    text: "🔥 ¡Hola {nombre}! Tenemos una promoción especial para ti en {negocio}. ¡Ven y aprovecha descuentos exclusivos! Te esperamos. ✂️",
  },
  {
    id: "reactivation",
    label: "Reactivación",
    icon: Sparkles,
    text: "👋 ¡Hola {nombre}! Te extrañamos en {negocio}. Ha pasado un tiempo desde tu última visita. ¡Vuelve y recibe un trato especial! ✨",
  },
  {
    id: "birthday",
    label: "Cumpleaños",
    icon: Gift,
    text: "🎂 ¡Feliz cumpleaños {nombre}! 🎉 En {negocio} queremos celebrar contigo. Ven por tu corte de cumpleaños con descuento especial. 🎁",
  },
];

export function CampaignBuilder({ clients }: CampaignBuilderProps) {
  const biz = useBusinessInfo();
  const [selectedSegment, setSelectedSegment] = useState<Segment>("all");
  const [message, setMessage] = useState("");

  const getFilteredClients = () => {
    const now = new Date();
    switch (selectedSegment) {
      case "vip":
        return clients.filter((c) => c.level === "vip" || c.level === "premium");
      case "inactive": {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 60);
        return clients.filter((c) => {
          if (!c.last_visit) return true;
          return new Date(c.last_visit) < cutoff;
        });
      }
      case "birthday": {
        return clients.filter((c) => {
          if (!c.birth_date) return false;
          const b = new Date(c.birth_date);
          const thisYear = new Date(now.getFullYear(), b.getMonth(), b.getDate());
          const diff = Math.ceil((thisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return diff >= 0 && diff <= 7;
        });
      }
      default:
        return clients;
    }
  };

  const filtered = getFilteredClients();

  const applyTemplate = (templateText: string) => {
    setMessage(templateText.replace("{negocio}", biz.name || "Barbershop"));
  };

  const sendToClient = (client: Client) => {
    const personalised = message.replace("{nombre}", client.full_name.split(" ")[0]);
    const phone = client.phone;
    const url = buildWhatsAppLink(phone, personalised);
    window.open(url, "_blank");
  };

  const handleSendAll = () => {
    if (!message.trim()) {
      toast.error("Escribe un mensaje primero");
      return;
    }
    if (filtered.length === 0) {
      toast.error("No hay clientes en este segmento");
      return;
    }
    // Open first client and inform user
    sendToClient(filtered[0]);
    toast.success(
      `Se abrió WhatsApp para ${filtered[0].full_name}. Envía y luego continúa con los siguientes ${filtered.length - 1} clientes.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Campañas WhatsApp
          </CardTitle>
          <CardDescription>
            Envía mensajes masivos por WhatsApp a segmentos de clientes
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Segment + Template */}
        <div className="space-y-4">
          {/* Segment picker */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">1. Elige segmento</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {segments.map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all text-sm ${
                    selectedSegment === seg.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <seg.icon className="h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-medium">{seg.label}</p>
                    <p className="text-xs text-muted-foreground">{seg.desc}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Templates */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">2. Plantilla (opcional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.text)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 text-left transition-all"
                >
                  <t.icon className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{t.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.text.slice(0, 60)}...</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Message + Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">3. Escribe el mensaje</CardTitle>
              <CardDescription className="text-xs">
                Usa <code className="bg-muted px-1 rounded">{"{nombre}"}</code> para personalizar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                rows={6}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Resumen de envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Segmento:</span>
                <Badge variant="secondary">
                  {segments.find((s) => s.id === selectedSegment)?.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Destinatarios:</span>
                <span className="font-semibold">{filtered.length} clientes</span>
              </div>

              {/* Quick list */}
              {filtered.length > 0 && (
                <div className="max-h-32 overflow-y-auto border rounded-lg divide-y divide-border">
                  {filtered.slice(0, 20).map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-3 py-1.5 text-xs">
                      <span className="truncate">{c.full_name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-green-500"
                        onClick={() => {
                          if (!message.trim()) {
                            toast.error("Escribe un mensaje primero");
                            return;
                          }
                          sendToClient(c);
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {filtered.length > 20 && (
                    <p className="text-center text-xs text-muted-foreground py-1">
                      +{filtered.length - 20} más
                    </p>
                  )}
                </div>
              )}

              <Button
                className="w-full gap-2"
                onClick={handleSendAll}
                disabled={!message.trim() || filtered.length === 0}
              >
                <Send className="h-4 w-4" />
                Enviar al primer cliente
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Se abrirá WhatsApp para cada cliente. Envía uno por uno.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
