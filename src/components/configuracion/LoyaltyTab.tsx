import { useState } from "react";
import {
  Gift,
  Star,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Clock,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface Reward {
  id: number;
  name: string;
  pointsRequired: number;
  description: string;
  active: boolean;
}

const initialRewards: Reward[] = [
  { id: 1, name: "Corte Gratis", pointsRequired: 50, description: "Un corte clásico completamente gratis", active: true },
  { id: 2, name: "20% Descuento", pointsRequired: 100, description: "20% de descuento en cualquier servicio", active: true },
  { id: 3, name: "Combo Premium", pointsRequired: 150, description: "Corte + Barba + Tratamiento gratis", active: true },
  { id: 4, name: "Producto Gratis", pointsRequired: 80, description: "Cualquier producto de hasta $20", active: false },
];

export default function LoyaltyTab() {
  const [enabled, setEnabled] = useState(true);
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [isNewRewardOpen, setIsNewRewardOpen] = useState(false);

  const [settings, setSettings] = useState({
    pointsPerDollar: 10,
    pointValue: 0.1,
    referralPoints: 25,
    birthdayDiscount: 15,
    firstVisitDiscount: 10,
    happyHourEnabled: true,
    happyHourDiscount: 20,
    happyHourDays: ["tuesday", "wednesday"],
    happyHourStart: "14:00",
    happyHourEnd: "17:00",
  });

  const [newReward, setNewReward] = useState({
    name: "",
    pointsRequired: 0,
    description: "",
  });

  const handleCreateReward = () => {
    const newId = Math.max(...rewards.map((r) => r.id), 0) + 1;
    setRewards([...rewards, { id: newId, ...newReward, active: true }]);
    setNewReward({ name: "", pointsRequired: 0, description: "" });
    setIsNewRewardOpen(false);
    toast({
      title: "Recompensa creada",
      description: "La nueva recompensa se ha agregado al programa",
    });
  };

  const handleToggleReward = (id: number) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleDeleteReward = (id: number) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
    toast({
      title: "Recompensa eliminada",
      description: "La recompensa se ha eliminado del programa",
    });
  };

  const toggleHappyHourDay = (day: string) => {
    setSettings((prev) => ({
      ...prev,
      happyHourDays: prev.happyHourDays.includes(day)
        ? prev.happyHourDays.filter((d) => d !== day)
        : [...prev.happyHourDays, day],
    }));
  };

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "El programa de fidelización se ha actualizado",
    });
  };

  const daysOfWeek = [
    { id: "monday", name: "Lun" },
    { id: "tuesday", name: "Mar" },
    { id: "wednesday", name: "Mié" },
    { id: "thursday", name: "Jue" },
    { id: "friday", name: "Vie" },
    { id: "saturday", name: "Sáb" },
    { id: "sunday", name: "Dom" },
  ];

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="font-display text-xl">
                  Programa de Fidelización
                </CardTitle>
                <CardDescription>
                  Recompensa a tus clientes frecuentes con puntos y beneficios
                </CardDescription>
              </div>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </CardHeader>
      </Card>

      {enabled && (
        <>
          {/* Points Configuration */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Sistema de Puntos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Puntos por cada $X gastados</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      1 punto por cada $
                    </span>
                    <Input
                      type="number"
                      className="w-20"
                      value={settings.pointsPerDollar}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pointsPerDollar: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Valor de cada punto</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      1 punto = $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      className="w-20"
                      value={settings.pointValue}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pointValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Puntos por Referido</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-20"
                      value={settings.referralPoints}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          referralPoints: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      puntos
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Recompensas Canjeables
                  </CardTitle>
                  <CardDescription>
                    Premios que los clientes pueden canjear con sus puntos
                  </CardDescription>
                </div>
                <Dialog open={isNewRewardOpen} onOpenChange={setIsNewRewardOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Nueva Recompensa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Recompensa</DialogTitle>
                      <DialogDescription>
                        Define una nueva recompensa para el programa
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nombre de la Recompensa</Label>
                        <Input
                          value={newReward.name}
                          onChange={(e) =>
                            setNewReward({ ...newReward, name: e.target.value })
                          }
                          placeholder="Ej: Corte Gratis"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Puntos Requeridos</Label>
                        <Input
                          type="number"
                          value={newReward.pointsRequired}
                          onChange={(e) =>
                            setNewReward({
                              ...newReward,
                              pointsRequired: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea
                          value={newReward.description}
                          onChange={(e) =>
                            setNewReward({
                              ...newReward,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe el beneficio..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsNewRewardOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateReward}>
                        Guardar Recompensa
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recompensa</TableHead>
                    <TableHead className="text-center">Puntos</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((reward) => (
                    <TableRow
                      key={reward.id}
                      className={!reward.active ? "opacity-50" : ""}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{reward.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {reward.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          {reward.pointsRequired}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={reward.active}
                          onCheckedChange={() => handleToggleReward(reward.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteReward(reward.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Special Promotions */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Promociones Especiales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Birthday Discount */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    🎂
                  </div>
                  <div>
                    <p className="font-medium">Descuento de Cumpleaños</p>
                    <p className="text-sm text-muted-foreground">
                      Descuento especial en el mes del cumpleaños
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20"
                    value={settings.birthdayDiscount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        birthdayDiscount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>

              {/* First Visit Discount */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Descuento Primera Visita</p>
                    <p className="text-sm text-muted-foreground">
                      Bienvenida para nuevos clientes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20"
                    value={settings.firstVisitDiscount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        firstVisitDiscount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>

              {/* Happy Hour */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">Happy Hour</p>
                      <p className="text-sm text-muted-foreground">
                        Descuento en horarios especiales
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.happyHourEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, happyHourEnabled: checked })
                    }
                  />
                </div>

                {settings.happyHourEnabled && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label>Descuento:</Label>
                        <Input
                          type="number"
                          className="w-20"
                          value={settings.happyHourDiscount}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              happyHourDiscount: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Días:</Label>
                      <div className="flex gap-2">
                        {daysOfWeek.map((day) => (
                          <Button
                            key={day.id}
                            variant={
                              settings.happyHourDays.includes(day.id)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => toggleHappyHourDay(day.id)}
                          >
                            {day.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label>De:</Label>
                        <Input
                          type="time"
                          className="w-28"
                          value={settings.happyHourStart}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              happyHourStart: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label>A:</Label>
                        <Input
                          type="time"
                          className="w-28"
                          value={settings.happyHourEnd}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              happyHourEnd: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" className="gap-2" onClick={handleSave}>
          <Save className="h-5 w-5" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
