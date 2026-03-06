import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Location, Service } from "@/types/reservation";
import { sanitizeInput, isValidPhone, isValidEmail } from "@/lib/security";

export function useLocations() {
  return useQuery({
    queryKey: ["public-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as Location[];
    },
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("price", { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
  });
}

export function usePublicBarbers() {
  return useQuery({
    queryKey: ["public-barbers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("barbers")
        .select("id, full_name, photo_url, specialty")
        .eq("active", true)
        .order("full_name");

      if (error) throw error;
      return data;
    },
  });
}

export async function createReservation(reservationData: {
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_id: string;
  barber_id: string;
  location_id: string;
  reservation_date: string;
  reservation_time: string;
}) {
  // Sanitize all string inputs
  const sanitized = {
    ...reservationData,
    client_name: sanitizeInput(reservationData.client_name).slice(0, 100),
    client_phone: reservationData.client_phone.replace(/[^\d+\-\s()]/g, '').slice(0, 20),
    client_email: reservationData.client_email 
      ? sanitizeInput(reservationData.client_email).slice(0, 255) 
      : undefined,
  };

  // Validate required fields
  if (!sanitized.client_name || sanitized.client_name.length < 2) {
    throw new Error('Nombre inválido');
  }
  if (!isValidPhone(sanitized.client_phone)) {
    throw new Error('Teléfono inválido');
  }
  if (sanitized.client_email && !isValidEmail(sanitized.client_email)) {
    throw new Error('Email inválido');
  }

  const { error } = await supabase
    .from("reservations")
    .insert([sanitized]);

  if (error) throw error;
  return true;
}
