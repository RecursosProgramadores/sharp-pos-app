import { useState, useEffect } from "react";
import { Gift, Star, Plus, Trash2, Users, Calendar, Clock, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";

interface Reward {
  id: string;
  name: string;
  pointsRequired: number;
  description: string;
  active: boolean;
}

const defaultLoyalty = {
  enabled: true,
  pointsPerDollar: 10,
  pointValue: 0.1,
  referralPoints: 25,
  birthdayDiscount: 15,
  firstVisitDiscount: 10,
  happyHour: { enabled: true, discount: 20, days: ["tuesday", "wednesday"], start: "14:00", end: "17:00" },
  rewards: [
    { id: "r1", name: "Corte Gratis", pointsRequired: 50, description: "Un corte clásico completamente gratis", active: true },
    { id: "r2", name: "20% Descuento", pointsRequired: 100, description: "20% de descuento en cualquier servicio", active: true },
  ] as Reward[],
};

const daysOfWeek = [
  { id: "monday", name: "Lun" }, { id: "tuesday", name: "Mar" }, { id: "wednesday", name: "Mié" },
  { id: "thursday", name: "Jue" }, { id: "friday", name: "Vie" }, { id: "saturday", name: "Sáb" }, { id: "sunday", name: "Dom" },
];

export default function LoyaltyTab() {
  const { data: saved, isLoading, save, isSaving } = useSettings("loyalty", defaultLoyalty);
  const [config, setConfig] = useState(defaultLoyalty);
  const [isNewRewardOpen, setIsNewRewardOpen] = useState(false);
  const [newReward, setNewReward] = useState({ name: "", pointsRequired: 0, description: "" });

  useEffect(() => {
    if (saved) setConfig({ ...defaultLoyalty, ...saved, happyHour: { ...defaultLoyalty.happyHour, ...(saved as any).happyHour } });
  }, [saved]);

  const handleCreateReward = () => {
    const updated = { ...config, rewards: [...config.rewards, { id: `r-${Date.now()}`, ...newReward, active: true }] };
    setConfig(updated);
    save(updated);
    setNewReward({ name: "", pointsRequired: 0, description: "" });
    setIsNewRewardOpen(false);
  };

  const handleToggleReward = (id: string) => {
    const updated = { ...config, rewards: config.rewards.map(r => r.id === id ? { ...r, active: !r.active } : r) };
    setConfig(updated);
    save(updated);
  };

  const handleDeleteReward = (id: string) => {
    const updated = { ...config, rewards: config.rewards.filter(r => r.id !== id) };
    setConfig(updated);
    save(updated);
  };

  const toggleHappyHourDay = (day: string) => {
    setConfig(prev => ({
      ...prev,
      happyHour: {
        ...prev.happyHour,
        days: prev.happyHour.days.includes(day) ? prev.happyHour.days.filter(d => d !== day) : [...prev.happyHour.days, day],
      },
    }));
  };

  const handleSave = () => save(config);

  if (isLoading) return <div className="space-y-6">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="font-display text-xl">Programa de Fidelización</CardTitle>
                <CardDescription>Recompensa a tus clientes frecuentes con puntos y beneficios</CardDescription>
              </div>
            </div>
            <Switch checked={config.enabled} onCheckedChange={(v) => setConfig(prev => ({ ...prev, enabled: v }))} />
          </div>
        </CardHeader>
      </Card>

      {config.enabled && (
        <>
          {/* Points */}
          <Card className="card-elevated">
            <CardHeader><CardTitle className="font-display text-xl flex items-center gap-2"><Star className="h-5 w-5 text-primary" />Sistema de Puntos</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Puntos por cada S/ X</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">1 punto por cada S/</span>
                    <Input type="number" className="w-20" value={config.pointsPerDollar} onChange={(e) => setConfig(prev => ({ ...prev, pointsPerDollar: parseInt(e.target.value) || 0 }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Valor de cada punto</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">1 punto = S/</span>
                    <Input type="number" step="0.01" className="w-20" value={config.pointValue} onChange={(e) => setConfig(prev => ({ ...prev, pointValue: parseFloat(e.target.value) || 0 }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Puntos por Referido</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" className="w-20" value={config.referralPoints} onChange={(e) => setConfig(prev => ({ ...prev, referralPoints: parseInt(e.target.value) || 0 }))} />
                    <span className="text-sm text-muted-foreground">puntos</span>
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
                  <CardTitle className="font-display text-xl flex items-center gap-2"><Gift className="h-5 w-5 text-primary" />Recompensas Canjeables</CardTitle>
                  <CardDescription>Premios que los clientes pueden canjear</CardDescription>
                </div>
                <Dialog open={isNewRewardOpen} onOpenChange={setIsNewRewardOpen}>
                  <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Nueva Recompensa</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Crear Nueva Recompensa</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Nombre</Label><Input value={newReward.name} onChange={(e) => setNewReward({ ...newReward, name: e.target.value })} placeholder="Ej: Corte Gratis" /></div>
                      <div className="space-y-2"><Label>Puntos Requeridos</Label><Input type="number" value={newReward.pointsRequired} onChange={(e) => setNewReward({ ...newReward, pointsRequired: parseInt(e.target.value) || 0 })} /></div>
                      <div className="space-y-2"><Label>Descripción</Label><Textarea value={newReward.description} onChange={(e) => setNewReward({ ...newReward, description: e.target.value })} rows={2} /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewRewardOpen(false)}>Cancelar</Button>
                      <Button onClick={handleCreateReward}>Guardar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Recompensa</TableHead><TableHead className="text-center">Puntos</TableHead><TableHead className="text-center">Estado</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                <TableBody>
                  {config.rewards.map(reward => (
                    <TableRow key={reward.id} className={!reward.active ? "opacity-50" : ""}>
                      <TableCell><div><p className="font-medium">{reward.name}</p><p className="text-sm text-muted-foreground">{reward.description}</p></div></TableCell>
                      <TableCell className="text-center"><Badge variant="secondary"><Star className="h-3 w-3 mr-1" />{reward.pointsRequired}</Badge></TableCell>
                      <TableCell className="text-center"><Switch checked={reward.active} onCheckedChange={() => handleToggleReward(reward.id)} /></TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteReward(reward.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Special Promotions */}
          <Card className="card-elevated">
            <CardHeader><CardTitle className="font-display text-xl flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Promociones Especiales</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">🎂</div>
                  <div><p className="font-medium">Descuento de Cumpleaños</p><p className="text-sm text-muted-foreground">En el mes del cumpleaños</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" className="w-20" value={config.birthdayDiscount} onChange={(e) => setConfig(prev => ({ ...prev, birthdayDiscount: parseInt(e.target.value) || 0 }))} />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center"><Users className="h-5 w-5 text-success" /></div>
                  <div><p className="font-medium">Descuento Primera Visita</p><p className="text-sm text-muted-foreground">Bienvenida para nuevos clientes</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" className="w-20" value={config.firstVisitDiscount} onChange={(e) => setConfig(prev => ({ ...prev, firstVisitDiscount: parseInt(e.target.value) || 0 }))} />
                  <span className="text-sm">%</span>
                </div>
              </div>

              {/* Happy Hour */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center"><Clock className="h-5 w-5 text-warning" /></div>
                    <div><p className="font-medium">Happy Hour</p><p className="text-sm text-muted-foreground">Descuento en horarios especiales</p></div>
                  </div>
                  <Switch checked={config.happyHour.enabled} onCheckedChange={(v) => setConfig(prev => ({ ...prev, happyHour: { ...prev.happyHour, enabled: v } }))} />
                </div>
                {config.happyHour.enabled && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label>Descuento:</Label>
                        <Input type="number" className="w-20" value={config.happyHour.discount} onChange={(e) => setConfig(prev => ({ ...prev, happyHour: { ...prev.happyHour, discount: parseInt(e.target.value) || 0 } }))} />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Días Activos</Label>
                      <div className="flex gap-2">
                        {daysOfWeek.map(day => (
                          <label key={day.id} className="flex items-center gap-1">
                            <Checkbox checked={config.happyHour.days.includes(day.id)} onCheckedChange={() => toggleHappyHourDay(day.id)} />
                            <span className="text-sm">{day.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="space-y-1"><Label>Desde</Label><Input type="time" value={config.happyHour.start} onChange={(e) => setConfig(prev => ({ ...prev, happyHour: { ...prev.happyHour, start: e.target.value } }))} /></div>
                      <div className="space-y-1"><Label>Hasta</Label><Input type="time" value={config.happyHour.end} onChange={(e) => setConfig(prev => ({ ...prev, happyHour: { ...prev.happyHour, end: e.target.value } }))} /></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-end">
        <Button size="lg" className="gap-2" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
