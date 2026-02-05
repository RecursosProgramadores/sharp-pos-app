export interface Client {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  birth_date: string | null;
  photo_url: string | null;
  preferred_barber_id: string | null;
  preferred_barber_name?: string;
  preferred_services: string[];
  notes: string | null;
  visits: number;
  total_spent: number;
  points: number;
  level: "new" | "regular" | "vip" | "premium";
  last_visit: string | null;
  satisfaction_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  full_name: string;
  phone: string;
  email: string;
  birth_date: string;
  photo_url: string;
  preferred_barber_id: string;
  preferred_services: string[];
  notes: string;
  satisfaction_rating: number;
}

export const levelConfig = {
  new: { label: "Nuevo", icon: "🥉", variant: "outline" as const, color: "bg-muted" },
  regular: { label: "Regular", icon: "🥈", variant: "secondary" as const, color: "bg-secondary/20" },
  vip: { label: "VIP", icon: "🥇", variant: "default" as const, color: "bg-primary/20" },
  premium: { label: "Premium", icon: "💎", variant: "default" as const, color: "bg-info/20" },
};

export const services = [
  "Corte Clásico",
  "Fade",
  "Barba",
  "Diseño",
  "Corte + Barba",
  "Tratamiento Capilar",
  "Coloración",
];
