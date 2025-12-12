import { useState } from "react";
import { Award, Gift, Percent, Users, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
  active: boolean;
}

export function LoyaltyConfig() {
  const [config, setConfig] = useState({
    pointsPerDollar: 1,
    dollarThreshold: 10,
    birthdayDiscount: 20,
    firstVisitDiscount: 10,
    referralDiscount: 15,
    referralBonusPoints: 25,
    enableLoyalty: true,
    enableBirthdayReminders: true,
    enableReferrals: true,
  });

  const [rewards, setRewards] = useState<Reward[]>([
    { id: 1, name: "Corte Gratis", points: 50, description: "Un corte clásico gratis", active: true },
    { id: 2, name: "Combo Especial", points: 100, description: "Corte + Barba gratis", active: true },
    { id: 3, name: "Tratamiento Premium", points: 150, description: "Tratamiento capilar completo", active: true },
    { id: 4, name: "Día VIP", points: 200, description: "50% descuento en todos los servicios", active: true },
  ]);

  const [newReward, setNewReward] = useState({ name: "", points: 0, description: "" });

  const addReward = () => {
    if (!newReward.name || newReward.points <= 0) {
      toast.error("Completa los campos de la recompensa");
      return;
    }
    setRewards([
      ...rewards,
      { ...newReward, id: Date.now(), active: true },
    ]);
    setNewReward({ name: "", points: 0, description: "" });
    toast.success("Recompensa agregada");
  };

  const toggleReward = (id: number) => {
    setRewards(rewards.map((r) =>
      r.id === id ? { ...r, active: !r.active } : r
    ));
  };

  const deleteReward = (id: number) => {
    setRewards(rewards.filter((r) => r.id !== id));
    toast.success("Recompensa eliminada");
  };

  const saveConfig = () => {
    toast.success("Configuración guardada exitosamente");
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <Award className="h-5 w-5 text-primary" />
            Configuración General
          </CardTitle>
          <CardDescription>
            Configura las reglas del programa de fidelización
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Programa de Fidelización</Label>
              <p className="text-sm text-muted-foreground">
                Activa o desactiva el sistema de puntos
              </p>
            </div>
            <Switch
              checked={config.enableLoyalty}
              onCheckedChange={(checked) =>
                setConfig({ ...config, enableLoyalty: checked })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Puntos por cada</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={config.pointsPerDollar}
                  onChange={(e) =>
                    setConfig({ ...config, pointsPerDollar: Number(e.target.value) })
                  }
                  className="w-20"
                />
                <span className="text-muted-foreground">punto(s) por cada</span>
                <Input
                  type="number"
                  value={config.dollarThreshold}
                  onChange={(e) =>
                    setConfig({ ...config, dollarThreshold: Number(e.target.value) })
                  }
                  className="w-20"
                />
                <span className="text-muted-foreground">$ gastados</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <Percent className="h-5 w-5 text-secondary" />
            Descuentos Especiales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-secondary" />
                <Label className="text-base">Cumpleaños</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={config.birthdayDiscount}
                  onChange={(e) =>
                    setConfig({ ...config, birthdayDiscount: Number(e.target.value) })
                  }
                  className="w-20"
                />
                <span className="text-muted-foreground">% descuento</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.enableBirthdayReminders}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, enableBirthdayReminders: checked })
                  }
                />
                <span className="text-sm">Enviar recordatorios</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-info" />
                <Label className="text-base">Primera Visita</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={config.firstVisitDiscount}
                  onChange={(e) =>
                    setConfig({ ...config, firstVisitDiscount: Number(e.target.value) })
                  }
                  className="w-20"
                />
                <span className="text-muted-foreground">% descuento</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-success" />
                <Label className="text-base">Referidos</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={config.referralDiscount}
                  onChange={(e) =>
                    setConfig({ ...config, referralDiscount: Number(e.target.value) })
                  }
                  className="w-20"
                />
                <span className="text-muted-foreground">% al referido</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={config.referralBonusPoints}
                  onChange={(e) =>
                    setConfig({ ...config, referralBonusPoints: Number(e.target.value) })
                  }
                  className="w-20"
                />
                <span className="text-muted-foreground">pts al que refiere</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.enableReferrals}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, enableReferrals: checked })
                  }
                />
                <span className="text-sm">Activar referidos</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <Award className="h-5 w-5 text-primary" />
            Recompensas Canjeables
          </CardTitle>
          <CardDescription>
            Configura las recompensas que los clientes pueden canjear con sus puntos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recompensa</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-center">Puntos</TableHead>
                  <TableHead className="text-center">Activa</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell className="font-medium">{reward.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {reward.description}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {reward.points}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={reward.active}
                        onCheckedChange={() => toggleReward(reward.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteReward(reward.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add New Reward */}
          <div className="flex items-end gap-3 p-4 rounded-lg bg-muted/30">
            <div className="flex-1 space-y-2">
              <Label>Nombre</Label>
              <Input
                placeholder="Nombre de la recompensa"
                value={newReward.name}
                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
              />
            </div>
            <div className="w-24 space-y-2">
              <Label>Puntos</Label>
              <Input
                type="number"
                placeholder="0"
                value={newReward.points || ""}
                onChange={(e) => setNewReward({ ...newReward, points: Number(e.target.value) })}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Descripción</Label>
              <Input
                placeholder="Descripción breve"
                value={newReward.description}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
              />
            </div>
            <Button onClick={addReward}>Agregar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveConfig} className="gap-2">
          <Save className="h-4 w-4" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
