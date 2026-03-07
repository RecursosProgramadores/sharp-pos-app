import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Trash2,
  Shield,
  ShieldCheck,
  Search,
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface SystemUser {
  id: string;
  email: string;
  role: "admin" | "cajero";
  created_at: string;
  full_name: string;
  is_current_user: boolean;
}

const roles = [
  {
    id: "admin",
    name: "Administrador",
    description: "Acceso completo a todos los módulos",
    color: "bg-primary text-primary-foreground",
    icon: ShieldCheck,
  },
  {
    id: "cajero",
    name: "Cajero",
    description: "Barberos, POS, Inventario y Clientes",
    color: "bg-secondary text-secondary-foreground",
    icon: Shield,
  },
];

const newUserSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(8, "Mínimo 8 caracteres").max(100),
  confirmPassword: z.string(),
  name: z.string().min(2, "Nombre muy corto").max(100),
  role: z.enum(["admin", "cajero"], { required_error: "Selecciona un rol" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function UsersRolesTab() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as "admin" | "cajero" | "",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at");

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        toast.error("Error al cargar usuarios");
        return;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }

      const systemUsers: SystemUser[] = (rolesData || []).map((roleEntry) => {
        const profile = profilesData?.find((p) => p.id === roleEntry.user_id);
        return {
          id: roleEntry.user_id,
          email: profile?.full_name || "Usuario",
          role: roleEntry.role as "admin" | "cajero",
          created_at: roleEntry.created_at,
          full_name: profile?.full_name || "Usuario",
        };
      });

      setUsers(systemUsers);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleCreateUser = async () => {
    const validation = newUserSchema.safeParse(newUser);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0];
      toast.error(firstError || "Datos inválidos");
      return;
    }

    setIsCreating(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Sesión no válida");
        return;
      }

      const response = await supabase.functions.invoke("create-user", {
        body: {
          email: newUser.email,
          password: newUser.password,
          full_name: newUser.name,
          role: newUser.role,
        },
      });

      if (response.error) {
        console.error("Edge function error:", response.error);
        toast.error("Error al crear usuario");
        return;
      }

      const data = response.data;
      
      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(`¡Usuario ${newUser.role === "admin" ? "administrador" : "cajero"} creado correctamente!`);
      
      setNewUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      setIsNewUserOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error inesperado al crear usuario");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (error) {
        toast.error("Error al eliminar usuario");
        return;
      }

      toast.success("Usuario eliminado correctamente");
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error inesperado");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    setShowPassword(false);
  };

  return (
    <div className="space-y-6">
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administra los usuarios del sistema y sus permisos de acceso
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={fetchUsers} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
              <Dialog open={isNewUserOpen} onOpenChange={(open) => {
                setIsNewUserOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Nuevo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Crear Nuevo Usuario
                    </DialogTitle>
                    <DialogDescription>
                      El usuario podrá acceder al sistema con sus credenciales
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex justify-center">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                          {newUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="space-y-2">
                      <Label>Nombre Completo *</Label>
                      <Input
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="usuario@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Contraseña *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                          placeholder="Mínimo 8 caracteres"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Confirmar Contraseña *</Label>
                      <Input
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Repite la contraseña"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Rol de Usuario *</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: "admin" | "cajero") =>
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
                                <div>
                                  <span className="font-medium">{role.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    - {role.description}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsNewUserOpen(false)}
                      disabled={isCreating}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateUser} disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Crear Usuario
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                className="pl-10 max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Cargando usuarios...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El usuario "{user.full_name}" perderá acceso al sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* Info sobre roles */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {roles.map((role) => (
              <Card key={role.id} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <role.icon className="h-5 w-5 text-primary" />
                    {role.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {role.id === "admin" ? (
                      <>
                        <Badge variant="outline" className="text-xs">Dashboard</Badge>
                        <Badge variant="outline" className="text-xs">Barberos</Badge>
                        <Badge variant="outline" className="text-xs">Inventario</Badge>
                        <Badge variant="outline" className="text-xs">POS</Badge>
                        <Badge variant="outline" className="text-xs">Clientes</Badge>
                        <Badge variant="outline" className="text-xs">Reportes</Badge>
                        <Badge variant="outline" className="text-xs">Configuración</Badge>
                      </>
                    ) : (
                      <>
                        <Badge variant="outline" className="text-xs">Barberos</Badge>
                        <Badge variant="outline" className="text-xs">Inventario</Badge>
                        <Badge variant="outline" className="text-xs">POS</Badge>
                        <Badge variant="outline" className="text-xs">Clientes</Badge>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
