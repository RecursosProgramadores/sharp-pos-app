import { useState } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Key,
  Clock,
  Search,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar?: string;
  lastAccess: string;
  linkedBarber?: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Carlos Mendoza",
    email: "carlos@barberpro.com",
    role: "admin",
    status: "active",
    lastAccess: "Hace 5 minutos",
  },
  {
    id: 2,
    name: "María García",
    email: "maria@barberpro.com",
    role: "cashier",
    status: "active",
    lastAccess: "Hace 2 horas",
  },
  {
    id: 3,
    name: "Juan López",
    email: "juan@barberpro.com",
    role: "barber",
    status: "active",
    lastAccess: "Hace 1 día",
    linkedBarber: "Juan López",
  },
  {
    id: 4,
    name: "Ana Rodríguez",
    email: "ana@barberpro.com",
    role: "accountant",
    status: "inactive",
    lastAccess: "Hace 1 semana",
  },
];

const roles = [
  {
    id: "admin",
    name: "Administrador",
    description: "Acceso completo a todos los módulos",
    color: "bg-primary text-primary-foreground",
    icon: ShieldCheck,
  },
  {
    id: "cashier",
    name: "Cajero",
    description: "POS, ventas, clientes, inventario (solo lectura en reportes)",
    color: "bg-secondary text-secondary-foreground",
    icon: Shield,
  },
  {
    id: "barber",
    name: "Barbero",
    description: "Perfil personal, estadísticas y calendario propio",
    color: "bg-info text-info-foreground",
    icon: Users,
  },
  {
    id: "accountant",
    name: "Contador",
    description: "Solo reportes financieros y analítica",
    color: "bg-warning text-warning-foreground",
    icon: ShieldAlert,
  },
];

const modules = [
  "Dashboard",
  "Barberos",
  "Inventario",
  "Punto de Venta",
  "Clientes",
  "Reportes",
  "Configuración",
];

const permissions = ["Ver", "Crear", "Editar", "Eliminar"];

const activityLog = [
  { id: 1, date: "2024-01-15 10:30", user: "Carlos Mendoza", action: "Inició sesión", ip: "192.168.1.100" },
  { id: 2, date: "2024-01-15 10:35", user: "Carlos Mendoza", action: "Creó venta #1234", ip: "192.168.1.100" },
  { id: 3, date: "2024-01-15 09:00", user: "María García", action: "Inició sesión", ip: "192.168.1.101" },
  { id: 4, date: "2024-01-15 09:15", user: "María García", action: "Editó producto 'Pomada Premium'", ip: "192.168.1.101" },
  { id: 5, date: "2024-01-14 18:00", user: "Juan López", action: "Cerró sesión", ip: "192.168.1.102" },
];

export default function UsersRolesTab() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    linkedBarber: string;
    status: "active" | "inactive";
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    linkedBarber: "",
    status: "active",
  });

  const getRoleBadge = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return null;
    return (
      <Badge className={role.color}>
        <role.icon className="h-3 w-3 mr-1" />
        {role.name}
      </Badge>
    );
  };

  const handleStatusChange = (userId: number, newStatus: boolean) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: newStatus ? "active" : "inactive" }
          : user
      )
    );
    toast({
      title: newStatus ? "Usuario activado" : "Usuario desactivado",
      description: "El estado del usuario se ha actualizado",
    });
  };

  const handleCreateUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (newUser.password.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...users.map((u) => u.id)) + 1;
    setUsers([
      ...users,
      {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        lastAccess: "Nunca",
        linkedBarber: newUser.linkedBarber || undefined,
      },
    ]);

    setNewUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      linkedBarber: "",
      status: "active",
    });
    setIsNewUserOpen(false);

    toast({
      title: "Usuario creado",
      description: "El nuevo usuario se ha agregado correctamente",
    });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    toast({
      title: "Usuario eliminado",
      description: "El usuario se ha eliminado correctamente",
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">Usuarios</TabsTrigger>
        <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
        <TabsTrigger value="activity">Log de Actividad</TabsTrigger>
      </TabsList>

      {/* Users Tab */}
      <TabsContent value="users" className="space-y-6">
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription>
                  Administra los usuarios del sistema y sus permisos
                </CardDescription>
              </div>
              <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Completa la información del nuevo usuario
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback className="text-xl">
                            {newUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Nombre Completo</Label>
                      <Input
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email (Usuario)</Label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="usuario@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Contraseña</Label>
                        <Input
                          type="password"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirmar</Label>
                        <Input
                          type="password"
                          value={newUser.confirmPassword}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mínimo 8 caracteres, una mayúscula y un número
                    </p>

                    <div className="space-y-2">
                      <Label>Rol</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              <div className="flex items-center gap-2">
                                <role.icon className="h-4 w-4" />
                                {role.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {newUser.role === "barber" && (
                      <div className="space-y-2">
                        <Label>Vincular con Barbero</Label>
                        <Select
                          value={newUser.linkedBarber}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, linkedBarber: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar barbero" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Juan López">Juan López</SelectItem>
                            <SelectItem value="Pedro Martínez">
                              Pedro Martínez
                            </SelectItem>
                            <SelectItem value="Miguel Fernández">
                              Miguel Fernández
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label>Estado Inicial</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Inactivo
                        </span>
                        <Switch
                          checked={newUser.status === "active"}
                          onCheckedChange={(checked) =>
                            setNewUser({
                              ...newUser,
                              status: checked ? "active" : "inactive",
                            })
                          }
                        />
                        <span className="text-sm">Activo</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsNewUserOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateUser}>Guardar Usuario</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  className="pl-10 max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={user.status === "active"}
                        onCheckedChange={(checked) =>
                          handleStatusChange(user.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {user.lastAccess}
                      </span>
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
                          onClick={() => handleDeleteUser(user.id)}
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
      </TabsContent>

      {/* Roles & Permissions Tab */}
      <TabsContent value="roles" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <Card key={role.id} className="card-elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <role.icon className="h-5 w-5 text-primary" />
                    {role.name}
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Matriz de Permisos
            </CardTitle>
            <CardDescription>
              Configura los permisos granulares para roles personalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Módulo</TableHead>
                    {permissions.map((perm) => (
                      <TableHead key={perm} className="text-center">
                        {perm}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module}>
                      <TableCell className="font-medium">{module}</TableCell>
                      {permissions.map((perm) => (
                        <TableCell key={perm} className="text-center">
                          <Checkbox
                            defaultChecked={
                              perm === "Ver" ||
                              (perm === "Crear" && module !== "Configuración")
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Activity Log Tab */}
      <TabsContent value="activity" className="space-y-6">
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Log de Actividad
                </CardTitle>
                <CardDescription>
                  Registro de todas las acciones de usuarios en el sistema
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">Exportar</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.date}
                    </TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {log.ip}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
