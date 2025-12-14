import { useState } from "react";
import {
  Scissors,
  Plus,
  Edit,
  Trash2,
  Copy,
  GripVertical,
  Package,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  active: boolean;
  order: number;
}

interface Combo {
  id: number;
  name: string;
  services: number[];
  regularPrice: number;
  comboPrice: number;
  active: boolean;
}

const initialServices: Service[] = [
  { id: 1, name: "Corte Clásico", description: "Corte tradicional con tijera y máquina", duration: 30, price: 15, category: "Cortes", active: true, order: 1 },
  { id: 2, name: "Fade", description: "Degradado moderno con líneas limpias", duration: 45, price: 20, category: "Cortes", active: true, order: 2 },
  { id: 3, name: "Barba", description: "Perfilado y recorte de barba", duration: 20, price: 12, category: "Barba", active: true, order: 3 },
  { id: 4, name: "Diseño", description: "Diseños personalizados con máquina", duration: 30, price: 18, category: "Cortes", active: true, order: 4 },
  { id: 5, name: "Tratamiento Capilar", description: "Tratamiento hidratante y nutritivo", duration: 45, price: 30, category: "Tratamientos", active: true, order: 5 },
  { id: 6, name: "Coloración", description: "Tinte profesional para cabello", duration: 60, price: 40, category: "Coloración", active: true, order: 6 },
  { id: 7, name: "Corte Niño", description: "Corte para menores de 12 años", duration: 25, price: 12, category: "Infantil", active: true, order: 7 },
];

const initialCombos: Combo[] = [
  { id: 1, name: "Corte + Barba", services: [1, 3], regularPrice: 27, comboPrice: 25, active: true },
  { id: 2, name: "Fade + Barba + Diseño", services: [2, 3, 4], regularPrice: 50, comboPrice: 42, active: true },
];

const categories = ["Cortes", "Barba", "Tratamientos", "Coloración", "Infantil"];

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [combos, setCombos] = useState<Combo[]>(initialCombos);
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [isNewComboOpen, setIsNewComboOpen] = useState(false);
  const [priceSettings, setPriceSettings] = useState({
    priceByBarber: false,
    studentDiscount: true,
    studentDiscountPercent: 10,
    childDiscount: true,
    childDiscountPercent: 15,
  });

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    category: "",
  });

  const [newCombo, setNewCombo] = useState({
    name: "",
    services: [] as number[],
    comboPrice: 0,
  });

  const handleToggleService = (id: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleDeleteService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast({
      title: "Servicio eliminado",
      description: "El servicio se ha eliminado correctamente",
    });
  };

  const handleDuplicateService = (service: Service) => {
    const newId = Math.max(...services.map((s) => s.id)) + 1;
    setServices([
      ...services,
      {
        ...service,
        id: newId,
        name: `${service.name} (Copia)`,
        order: services.length + 1,
      },
    ]);
    toast({
      title: "Servicio duplicado",
      description: "Se ha creado una copia del servicio",
    });
  };

  const handleCreateService = () => {
    const newId = Math.max(...services.map((s) => s.id)) + 1;
    setServices([
      ...services,
      {
        id: newId,
        ...newService,
        active: true,
        order: services.length + 1,
      },
    ]);
    setNewService({ name: "", description: "", duration: 30, price: 0, category: "" });
    setIsNewServiceOpen(false);
    toast({
      title: "Servicio creado",
      description: "El nuevo servicio se ha agregado correctamente",
    });
  };

  const handleCreateCombo = () => {
    const regularPrice = newCombo.services.reduce((sum, id) => {
      const service = services.find((s) => s.id === id);
      return sum + (service?.price || 0);
    }, 0);

    const newId = Math.max(...combos.map((c) => c.id), 0) + 1;
    setCombos([
      ...combos,
      {
        id: newId,
        name: newCombo.name,
        services: newCombo.services,
        regularPrice,
        comboPrice: newCombo.comboPrice,
        active: true,
      },
    ]);
    setNewCombo({ name: "", services: [], comboPrice: 0 });
    setIsNewComboOpen(false);
    toast({
      title: "Combo creado",
      description: "El nuevo combo se ha agregado correctamente",
    });
  };

  const handleToggleComboService = (serviceId: number) => {
    setNewCombo((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const calculateComboRegularPrice = () => {
    return newCombo.services.reduce((sum, id) => {
      const service = services.find((s) => s.id === id);
      return sum + (service?.price || 0);
    }, 0);
  };

  const calculateSavings = (combo: Combo) => {
    const savings = combo.regularPrice - combo.comboPrice;
    const percent = ((savings / combo.regularPrice) * 100).toFixed(0);
    return { savings, percent };
  };

  return (
    <div className="space-y-6">
      {/* Services List */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" />
                Gestión de Servicios
              </CardTitle>
              <CardDescription>
                Administra los servicios disponibles en tu barbería
              </CardDescription>
            </div>
            <Dialog open={isNewServiceOpen} onOpenChange={setIsNewServiceOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Servicio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                  <DialogDescription>
                    Completa la información del nuevo servicio
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre del Servicio</Label>
                    <Input
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                      placeholder="Ej: Corte Premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción Corta</Label>
                    <Textarea
                      value={newService.description}
                      onChange={(e) =>
                        setNewService({ ...newService, description: e.target.value })
                      }
                      placeholder="Descripción breve del servicio"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duración (minutos)</Label>
                      <Input
                        type="number"
                        value={newService.duration}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            duration: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Precio Base ($)</Label>
                      <Input
                        type="number"
                        value={newService.price}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select
                      value={newService.category}
                      onValueChange={(value) =>
                        setNewService({ ...newService, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewServiceOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateService}>Guardar Servicio</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Duración</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className={!service.active ? "opacity-50" : ""}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{service.duration} min</TableCell>
                  <TableCell className="text-right font-medium">
                    ${service.price}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={service.active}
                      onCheckedChange={() => handleToggleService(service.id)}
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
                        onClick={() => handleDuplicateService(service)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteService(service.id)}
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

      {/* Combos Section */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Paquetes / Combos
              </CardTitle>
              <CardDescription>
                Crea combinaciones de servicios con precio especial
              </CardDescription>
            </div>
            <Dialog open={isNewComboOpen} onOpenChange={setIsNewComboOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Combo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Combo</DialogTitle>
                  <DialogDescription>
                    Selecciona los servicios y define el precio especial
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre del Combo</Label>
                    <Input
                      value={newCombo.name}
                      onChange={(e) =>
                        setNewCombo({ ...newCombo, name: e.target.value })
                      }
                      placeholder="Ej: Combo Premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Servicios Incluidos</Label>
                    <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg">
                      {services.filter(s => s.active).map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={newCombo.services.includes(service.id)}
                            onChange={() => handleToggleComboService(service.id)}
                            className="rounded"
                          />
                          <span className="text-sm">
                            {service.name} (${service.price})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Precio Regular</Label>
                      <div className="p-3 bg-muted rounded-lg text-center">
                        <span className="text-lg font-bold">
                          ${calculateComboRegularPrice()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Precio Combo</Label>
                      <Input
                        type="number"
                        value={newCombo.comboPrice}
                        onChange={(e) =>
                          setNewCombo({
                            ...newCombo,
                            comboPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  {newCombo.comboPrice > 0 && calculateComboRegularPrice() > 0 && (
                    <div className="p-3 bg-success/10 rounded-lg text-center">
                      <span className="text-success font-medium">
                        Ahorro: ${calculateComboRegularPrice() - newCombo.comboPrice} (
                        {(
                          ((calculateComboRegularPrice() - newCombo.comboPrice) /
                            calculateComboRegularPrice()) *
                          100
                        ).toFixed(0)}
                        %)
                      </span>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewComboOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCombo}>Guardar Combo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {combos.map((combo) => {
              const { savings, percent } = calculateSavings(combo);
              return (
                <div
                  key={combo.id}
                  className="p-4 border rounded-xl flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{combo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {combo.services
                        .map((id) => services.find((s) => s.id === id)?.name)
                        .join(" + ")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-primary">
                        ${combo.comboPrice}
                      </span>
                      <span className="text-sm line-through text-muted-foreground">
                        ${combo.regularPrice}
                      </span>
                      <Badge className="bg-success text-success-foreground">
                        -{percent}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={combo.active}
                      onCheckedChange={() => {
                        setCombos((prev) =>
                          prev.map((c) =>
                            c.id === combo.id ? { ...c, active: !c.active } : c
                          )
                        );
                      }}
                    />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Price Settings */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Configuración de Precios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Precios Diferenciados por Barbero</p>
              <p className="text-sm text-muted-foreground">
                Permite que cada barbero tenga tarifas distintas
              </p>
            </div>
            <Switch
              checked={priceSettings.priceByBarber}
              onCheckedChange={(checked) =>
                setPriceSettings({ ...priceSettings, priceByBarber: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium">Descuento a Estudiantes</p>
              <p className="text-sm text-muted-foreground">
                Aplica descuento automático a estudiantes
              </p>
            </div>
            <div className="flex items-center gap-4">
              {priceSettings.studentDiscount && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20"
                    value={priceSettings.studentDiscountPercent}
                    onChange={(e) =>
                      setPriceSettings({
                        ...priceSettings,
                        studentDiscountPercent: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-sm">%</span>
                </div>
              )}
              <Switch
                checked={priceSettings.studentDiscount}
                onCheckedChange={(checked) =>
                  setPriceSettings({ ...priceSettings, studentDiscount: checked })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium">Descuento a Niños</p>
              <p className="text-sm text-muted-foreground">
                Aplica descuento automático a menores de edad
              </p>
            </div>
            <div className="flex items-center gap-4">
              {priceSettings.childDiscount && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20"
                    value={priceSettings.childDiscountPercent}
                    onChange={(e) =>
                      setPriceSettings({
                        ...priceSettings,
                        childDiscountPercent: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-sm">%</span>
                </div>
              )}
              <Switch
                checked={priceSettings.childDiscount}
                onCheckedChange={(checked) =>
                  setPriceSettings({ ...priceSettings, childDiscount: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
