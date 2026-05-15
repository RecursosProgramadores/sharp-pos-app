import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";

// Public pages
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Setup from "./pages/Setup";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Admin pages
import Dashboard from "./pages/Dashboard";
import Reservas from "./pages/Reservas";
import Barberos from "./pages/Barberos";
import Inventario from "./pages/Inventario";
import POS from "./pages/POS";
import Clientes from "./pages/Clientes";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/sharp-pos-app/">
        <AuthProvider>
          <Routes>
            {/* Public routes - Landing Page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<TermsOfService />} />

            {/* Admin routes - Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reservas"
              element={
                <ProtectedRoute allowedRoles={["admin", "cajero"]}>
                  <MainLayout>
                    <Reservas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/barberos"
              element={
                <ProtectedRoute allowedRoles={["admin", "cajero"]}>
                  <MainLayout>
                    <Barberos />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inventario"
              element={
                <ProtectedRoute allowedRoles={["admin", "cajero"]}>
                  <MainLayout>
                    <Inventario />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pos"
              element={
                <ProtectedRoute allowedRoles={["admin", "cajero"]}>
                  <MainLayout>
                    <POS />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientes"
              element={
                <ProtectedRoute allowedRoles={["admin", "cajero"]}>
                  <MainLayout>
                    <Clientes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reportes"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <MainLayout>
                    <Reportes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/configuracion"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <MainLayout>
                    <Configuracion />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
