import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff, ShieldCheck, ShoppingCart, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { isRateLimited, getRateLimitRemainingSeconds, sanitizeInput } from "@/lib/security";
import Logo from "@/assets/logotayta.png";

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
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      navigate("/admin");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const state = location.state as { error?: string } | undefined;
    if (state?.error) {
      toast.error(state.error);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      if (Date.now() >= lockoutUntil) {
        setLockoutUntil(null);
        setLoginAttempts(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLockedOut = lockoutUntil && Date.now() < lockoutUntil;
  const lockoutRemaining = lockoutUntil ? Math.ceil((lockoutUntil - Date.now()) / 1000) : 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error("Selecciona tu tipo de acceso");
      return;
    }

    if (isRateLimited('login', 5, 120000)) {
      const remaining = getRateLimitRemainingSeconds('login');
      setLockoutUntil(Date.now() + remaining * 1000);
      toast.error(`Demasiados intentos. Espera ${remaining} segundos.`);
      return;
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();
    const result = loginSchema.safeParse({ email: sanitizedEmail, password });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      if (errors.email) toast.error(errors.email[0]);
      else if (errors.password) toast.error(errors.password[0]);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(sanitizedEmail, password);
      
      if (error) {
        setLoginAttempts(prev => prev + 1);
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Credenciales incorrectas. Verifica tus datos.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Email no confirmado. Revisa tu bandeja de entrada.");
        } else {
          toast.error("Error al iniciar sesión. Intenta nuevamente.");
        }
        
        if (loginAttempts + 1 >= 5) {
          setLockoutUntil(Date.now() + 120000);
        }
        return;
      }

      setLoginAttempts(0);
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
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-[#050505] text-white font-sans selection:bg-amber-500/30">
      {/* Left Pane - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505] z-10" />
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80" 
          alt="Barbershop" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-16 left-16 z-20 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Sistema Profesional
          </div>
          <h2 className="text-4xl xl:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-white mb-6">
            La Herramienta <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700">Definitiva</span>
          </h2>
          <p className="text-zinc-400 font-light text-lg">
            Gestiona tu barbería con precisión, elegancia y tecnología de vanguardia.
          </p>
        </div>
      </div>

      {/* Right Pane - Login */}
      <div className="w-full lg:w-1/2 flex flex-col relative py-12 px-6 sm:px-12 xl:px-24 justify-center items-center">
        {/* Back Button */}
        <div className="absolute top-8 left-8 sm:left-12 xl:left-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-zinc-500 hover:text-amber-500 transition-colors text-xs font-bold uppercase tracking-widest group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver a la página
          </Link>
        </div>

        <div className="w-full max-w-[420px] space-y-10 mt-8">
          {/* Logo Header */}
          <div className="text-center space-y-6">
            <div className="mx-auto w-64 md:w-72 h-auto flex justify-center mb-2">
              <img 
                src={Logo} 
                alt="Tayta BarberShop" 
                className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
              />
            </div>
            <div>
              <h1 className="font-display text-3xl font-black tracking-widest text-white uppercase">BARBER PRO</h1>
              <p className="text-zinc-500 mt-2 text-[10px] font-bold uppercase tracking-[0.25em]">Sistema de Gestión para Barberías</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={cn(
                "relative flex items-center text-left gap-3 p-4 rounded-xl border transition-all duration-300 overflow-hidden group",
                selectedRole === "admin"
                  ? "border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                  : "border-white/10 bg-white/5 hover:border-amber-500/50 hover:bg-white/10"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 relative z-10",
                selectedRole === "admin" ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-white/5 text-zinc-400"
              )}>
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="relative z-10 flex-1 min-w-0">
                <p className={cn("font-black tracking-tight text-xs uppercase truncate", selectedRole === "admin" ? "text-amber-500" : "text-white")}>Admin</p>
                <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5 truncate">Completo</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("cajero")}
              className={cn(
                "relative flex items-center text-left gap-3 p-4 rounded-xl border transition-all duration-300 overflow-hidden group",
                selectedRole === "cajero"
                  ? "border-zinc-300 bg-zinc-300/10 shadow-[0_0_30px_rgba(212,212,216,0.15)]"
                  : "border-white/10 bg-white/5 hover:border-zinc-300/50 hover:bg-white/10"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 relative z-10",
                selectedRole === "cajero" ? "bg-zinc-200 text-black shadow-lg shadow-zinc-200/20" : "bg-white/5 text-zinc-400"
              )}>
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="relative z-10 flex-1 min-w-0">
                <p className={cn("font-black tracking-tight text-xs uppercase truncate", selectedRole === "cajero" ? "text-zinc-200" : "text-white")}>Cajero</p>
                <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5 truncate">Operativo</p>
              </div>
            </button>
          </div>

          {/* Login Form */}
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] shadow-2xl backdrop-blur-sm">
            <div className="mb-8">
              <h3 className="text-xl font-black text-white tracking-tight">Iniciar Sesión</h3>
              <p className="text-zinc-500 text-sm mt-1">
                {selectedRole 
                  ? `Ingresa como ${selectedRole === "admin" ? "Administrador" : "Cajero"}`
                  : "Selecciona tu tipo de acceso arriba"}
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tayta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  className="h-14 bg-[#050505] border-white/10 text-white rounded-xl px-4 focus:border-amber-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="h-14 bg-[#050505] border-white/10 text-white rounded-xl px-4 pr-12 focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {isLockedOut && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                  <p className="text-sm text-red-500 font-medium">
                    Cuenta bloqueada. Espera {lockoutRemaining}s
                  </p>
                </div>
              )}
              <Button 
                type="submit" 
                className={cn(
                  "w-full h-14 text-sm font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                  selectedRole === "admin" ? "bg-amber-500 hover:bg-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]" : 
                  selectedRole === "cajero" ? "bg-zinc-200 hover:bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" : 
                  "bg-white/5 text-zinc-500 cursor-not-allowed"
                )}
                disabled={isLoading || !selectedRole || !!isLockedOut}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  "Acceder al Sistema"
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} TAYTA BARBERSHOP
          </p>
        </div>
      </div>
    </div>
  );
}
