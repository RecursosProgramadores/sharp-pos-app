import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors, Loader2, Eye, EyeOff, ShieldCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100),
});

type RoleType = "admin" | "cajero";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/admin");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error("Selecciona tu tipo de acceso");
      return;
    }

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      if (errors.email) toast.error(errors.email[0]);
      else if (errors.password) toast.error(errors.password[0]);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Email no confirmado. Revisa tu bandeja de entrada.");
        } else {
          toast.error("Error al iniciar sesión: " + error.message);
        }
        return;
      }

      toast.success("¡Bienvenido!");
      navigate("/admin");
    } catch (error) {
      toast.error("Error inesperado al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-xl">
            <Scissors className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-4xl tracking-wider text-foreground">BARBER PRO</h1>
            <p className="text-muted-foreground mt-1">Sistema de Gestión para Barberías</p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSelectedRole("admin")}
            className={cn(
              "relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              selectedRole === "admin"
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
              selectedRole === "admin" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Administrador</p>
              <p className="text-xs text-muted-foreground mt-1">Acceso completo</p>
            </div>
            {selectedRole === "admin" && (
              <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-primary" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("cajero")}
            className={cn(
              "relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
              selectedRole === "cajero"
                ? "border-secondary bg-secondary/10 shadow-lg"
                : "border-border bg-card hover:border-secondary/50 hover:bg-muted/50"
            )}
          >
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
              selectedRole === "cajero" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <ShoppingCart className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Cajero</p>
              <p className="text-xs text-muted-foreground mt-1">Acceso operativo</p>
            </div>
            {selectedRole === "cajero" && (
              <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-secondary" />
            )}
          </button>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Iniciar Sesión</CardTitle>
            <CardDescription>
              {selectedRole 
                ? `Ingresa como ${selectedRole === "admin" ? "Administrador" : "Cajero"}`
                : "Selecciona tu tipo de acceso arriba"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium" 
                size="lg" 
                disabled={isLoading || !selectedRole}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Barber Pro. Sistema de Gestión.
        </p>
      </div>
    </div>
  );
}
