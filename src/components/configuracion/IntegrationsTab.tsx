import {
  Link,
  MessageSquare,
  CreditCard,
  FileText,
  Calendar,
  Phone,
  Settings,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "configured" | "not_configured" | "coming_soon";
  category: string;
}

const integrations: Integration[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    description: "Envío automático de recordatorios, confirmaciones y campañas",
    icon: <MessageSquare className="h-8 w-8" />,
    status: "not_configured",
    category: "Comunicación",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Procesamiento de pagos con tarjeta de crédito y débito",
    icon: <CreditCard className="h-8 w-8" />,
    status: "not_configured",
    category: "Pagos",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pagos online y transferencias",
    icon: <CreditCard className="h-8 w-8" />,
    status: "coming_soon",
    category: "Pagos",
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    description: "Pagos digitales y QR para Latinoamérica",
    icon: <CreditCard className="h-8 w-8" />,
    status: "coming_soon",
    category: "Pagos",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Sincronización con sistema contable",
    icon: <FileText className="h-8 w-8" />,
    status: "coming_soon",
    category: "Contabilidad",
  },
  {
    id: "xero",
    name: "Xero",
    description: "Exportación automática de datos financieros",
    icon: <FileText className="h-8 w-8" />,
    status: "coming_soon",
    category: "Contabilidad",
  },
  {
    id: "sunat",
    name: "Facturación Electrónica SUNAT",
    description: "Emisión de comprobantes electrónicos (Perú)",
    icon: <FileText className="h-8 w-8" />,
    status: "coming_soon",
    category: "Fiscal",
  },
  {
    id: "sat",
    name: "Facturación SAT",
    description: "CFDI y facturación electrónica (México)",
    icon: <FileText className="h-8 w-8" />,
    status: "coming_soon",
    category: "Fiscal",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sincronización de citas con calendario de barberos",
    icon: <Calendar className="h-8 w-8" />,
    status: "not_configured",
    category: "Calendario",
  },
  {
    id: "twilio",
    name: "Twilio SMS",
    description: "Gateway de SMS para notificaciones",
    icon: <Phone className="h-8 w-8" />,
    status: "coming_soon",
    category: "Comunicación",
  },
];

const getStatusBadge = (status: Integration["status"]) => {
  switch (status) {
    case "configured":
      return (
        <Badge className="bg-success text-success-foreground">
          Configurado
        </Badge>
      );
    case "not_configured":
      return <Badge variant="outline">No Configurado</Badge>;
    case "coming_soon":
      return (
        <Badge variant="secondary" className="opacity-60">
          Próximamente
        </Badge>
      );
  }
};

export default function IntegrationsTab() {
  const groupedIntegrations = integrations.reduce(
    (acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = [];
      }
      acc[integration.category].push(integration);
      return acc;
    },
    {} as Record<string, Integration[]>
  );

  return (
    <div className="space-y-6">
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            Integraciones
          </CardTitle>
          <CardDescription>
            Conecta tu sistema con servicios externos para ampliar sus
            funcionalidades
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(groupedIntegrations).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <h3 className="font-display text-lg text-muted-foreground">
            {category}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((integration) => (
              <Card
                key={integration.id}
                className={`card-elevated transition-all ${
                  integration.status === "coming_soon"
                    ? "opacity-60"
                    : "hover:border-primary/50"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        integration.status === "configured"
                          ? "bg-success/20 text-success"
                          : integration.status === "not_configured"
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted/50 text-muted-foreground/50"
                      }`}
                    >
                      {integration.icon}
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>

                  <h4 className="font-medium mb-1">{integration.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {integration.description}
                  </p>

                  {integration.status !== "coming_soon" && (
                    <Button
                      variant={
                        integration.status === "configured"
                          ? "outline"
                          : "default"
                      }
                      size="sm"
                      className="w-full gap-2"
                    >
                      {integration.status === "configured" ? (
                        <>
                          <Settings className="h-4 w-4" />
                          Configurar
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4" />
                          Conectar
                        </>
                      )}
                    </Button>
                  )}

                  {integration.status === "coming_soon" && (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Próximamente
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Info Card */}
      <Card className="bg-info/10 border-info/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Link className="h-6 w-6 text-info flex-shrink-0" />
            <div>
              <p className="font-medium text-info">
                ¿Necesitas una integración específica?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Estamos constantemente agregando nuevas integraciones. Si
                necesitas conectar con un servicio específico, contáctanos y
                evaluaremos agregarlo a nuestra lista de desarrollo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
