import { AlertTriangle, MessageCircle, Send, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
  phone: string;
  lastVisit: string;
  totalSpent: number;
}

interface InactiveClientsProps {
  clients: Client[];
}

export function InactiveClients({ clients }: InactiveClientsProps) {
  const [selectedClients, setSelectedClients] = useState<number[]>([]);

  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const inactiveClients = clients.filter((client) => {
    const lastVisit = new Date(client.lastVisit);
    return lastVisit < threeMonthsAgo;
  }).sort((a, b) => new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime());

  const getDaysSinceLastVisit = (lastVisit: string) => {
    const visit = new Date(lastVisit);
    const diffTime = today.getTime() - visit.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const toggleClient = (clientId: number) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleAll = () => {
    if (selectedClients.length === inactiveClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(inactiveClients.map((c) => c.id));
    }
  };

  const sendReactivationMessage = (client: Client) => {
    const message = encodeURIComponent(
      `¡Hola ${client.name.split(" ")[0]}! 👋\n\n¡Te extrañamos en la barbería! Ha pasado tiempo desde tu última visita.\n\n🎁 Tenemos un descuento especial del 15% esperándote en tu próximo corte.\n\n¿Te agendamos una cita? ¡Esperamos verte pronto!`
    );
    window.open(`https://wa.me/${client.phone.replace(/\D/g, "")}?text=${message}`, "_blank");
    toast.success(`Mensaje de reactivación enviado a ${client.name}`);
  };

  const sendMassReactivation = () => {
    if (selectedClients.length === 0) {
      toast.error("Selecciona al menos un cliente");
      return;
    }
    toast.success(`Campaña enviada a ${selectedClients.length} cliente(s)`);
    setSelectedClients([]);
  };

  if (inactiveClients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <UserX className="h-5 w-5 text-warning" />
            Clientes Inactivos
          </CardTitle>
          <CardDescription>¡Excelente! No hay clientes inactivos</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-xl">
          <UserX className="h-5 w-5 text-warning" />
          Clientes Inactivos
        </CardTitle>
        <CardDescription>
          {inactiveClients.length} cliente{inactiveClients.length !== 1 ? "s" : ""} sin visitas en más de 3 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedClients.length === inactiveClients.length}
              onCheckedChange={toggleAll}
            />
            <span className="text-sm text-muted-foreground">
              {selectedClients.length > 0
                ? `${selectedClients.length} seleccionado(s)`
                : "Seleccionar todos"}
            </span>
          </div>
          {selectedClients.length > 0 && (
            <Button size="sm" onClick={sendMassReactivation} className="gap-2">
              <Send className="h-4 w-4" />
              Enviar Campaña
            </Button>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {inactiveClients.map((client) => {
            const daysSince = getDaysSinceLastVisit(client.lastVisit);
            const initials = client.name.split(" ").map((n) => n[0]).join("");

            return (
              <div
                key={client.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => toggleClient(client.id)}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-warning/10 text-warning text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Última visita: {new Date(client.lastVisit).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-warning border-warning/50">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {daysSince} días
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-success hover:text-success"
                    onClick={() => sendReactivationMessage(client)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
