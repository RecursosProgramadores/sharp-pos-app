import { useState } from "react";
import {
  Store,
  Users,
  Scissors,
  Receipt,
  Printer,
  Bell,
  Gift,
  Link,
  Shield,
  Palette,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

import BusinessInfoTab from "@/components/configuracion/BusinessInfoTab";
import UsersRolesTab from "@/components/configuracion/UsersRolesTab";
import ServicesTab from "@/components/configuracion/ServicesTab";
import TaxesTab from "@/components/configuracion/TaxesTab";
import PrintingTab from "@/components/configuracion/PrintingTab";
import NotificationsTab from "@/components/configuracion/NotificationsTab";
import LoyaltyTab from "@/components/configuracion/LoyaltyTab";
import IntegrationsTab from "@/components/configuracion/IntegrationsTab";
import BackupSecurityTab from "@/components/configuracion/BackupSecurityTab";
import AppearanceTab from "@/components/configuracion/AppearanceTab";
import ChangePasswordTab from "@/components/configuracion/ChangePasswordTab";

const tabs = [
  { id: "business", label: "Información del Negocio", icon: Store },
  { id: "users", label: "Usuarios y Roles", icon: Users },
  { id: "services", label: "Gestión de Servicios", icon: Scissors },
  { id: "taxes", label: "Impuestos", icon: Receipt },
  { id: "printing", label: "Impresión", icon: Printer },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "loyalty", label: "Fidelización", icon: Gift },
  { id: "integrations", label: "Integraciones", icon: Link },
  { id: "security", label: "Respaldo y Seguridad", icon: Shield },
  { id: "appearance", label: "Apariencia", icon: Palette },
  { id: "password", label: "Cambiar Contraseña", icon: Lock },
];

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("business");

  const renderTabContent = () => {
    switch (activeTab) {
      case "business":
        return <BusinessInfoTab />;
      case "users":
        return <UsersRolesTab />;
      case "services":
        return <ServicesTab />;
      case "taxes":
        return <TaxesTab />;
      case "printing":
        return <PrintingTab />;
      case "notifications":
        return <NotificationsTab />;
      case "loyalty":
        return <LoyaltyTab />;
      case "integrations":
        return <IntegrationsTab />;
      case "security":
        return <BackupSecurityTab />;
      case "appearance":
        return <AppearanceTab />;
      case "password":
        return <ChangePasswordTab />;
      default:
        return <BusinessInfoTab />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-20">
          <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-6">
            Configuración
          </h1>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {renderTabContent()}
      </main>
    </div>
  );
}
