import { Gift, MessageCircle, Send } from "lucide-react";
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
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
  phone: string;
  birthDate: string;
}

interface BirthdayRemindersProps {
  clients: Client[];
}

export function BirthdayReminders({ clients }: BirthdayRemindersProps) {
  const today = new Date();
  const currentMonth = today.getMonth();

  const birthdaysThisMonth = clients.filter((client) => {
    if (!client.birthDate) return false;
    const birthDate = new Date(client.birthDate);
    return birthDate.getMonth() === currentMonth;
  }).sort((a, b) => {
    const dayA = new Date(a.birthDate).getDate();
    const dayB = new Date(b.birthDate).getDate();
    return dayA - dayB;
  });

  const getDaysUntilBirthday = (birthDate: string) => {
    const birth = new Date(birthDate);
    const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = thisYearBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const sendBirthdayMessage = (client: Client) => {
    const message = encodeURIComponent(
      `🎂 ¡Feliz Cumpleaños ${client.name.split(" ")[0]}! 🎉\n\nDe parte de todo el equipo de la barbería, te deseamos un excelente día.\n\n🎁 Como regalo especial, tienes un 20% de descuento en tu próximo corte. ¡Te esperamos!\n\n¡Que la pases increíble!`
    );
    window.open(`https://wa.me/${client.phone.replace(/\D/g, "")}?text=${message}`, "_blank");
    toast.success(`Mensaje de cumpleaños enviado a ${client.name}`);
  };

  if (birthdaysThisMonth.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <Gift className="h-5 w-5 text-secondary" />
            Cumpleaños del Mes
          </CardTitle>
          <CardDescription>No hay cumpleaños este mes</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-xl">
          <Gift className="h-5 w-5 text-secondary" />
          Cumpleaños del Mes
        </CardTitle>
        <CardDescription>
          {birthdaysThisMonth.length} cliente{birthdaysThisMonth.length !== 1 ? "s" : ""} cumple{birthdaysThisMonth.length === 1 ? "" : "n"} años este mes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {birthdaysThisMonth.map((client) => {
          const daysUntil = getDaysUntilBirthday(client.birthDate);
          const birthDay = new Date(client.birthDate).getDate();
          const initials = client.name.split(" ").map((n) => n[0]).join("");
          const isToday = daysUntil === 0;
          const isPast = birthDay < today.getDate();

          return (
            <div
              key={client.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isToday
                  ? "bg-secondary/20 border border-secondary/30"
                  : isPast
                  ? "bg-muted/30"
                  : "bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{client.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(client.birthDate).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isToday ? (
                  <Badge className="bg-secondary text-secondary-foreground">
                    🎂 ¡Hoy!
                  </Badge>
                ) : !isPast ? (
                  <Badge variant="outline">En {daysUntil} días</Badge>
                ) : (
                  <Badge variant="secondary">Pasó</Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-success hover:text-success"
                  onClick={() => sendBirthdayMessage(client)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}

        <Button variant="outline" className="w-full gap-2 mt-4">
          <Send className="h-4 w-4" />
          Enviar Felicitaciones Masivas
        </Button>
      </CardContent>
    </Card>
  );
}
