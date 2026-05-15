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
  // 1. First, verify availability one last time before inserting
  const { data: existing, error: checkError } = await supabase
    .from("reservations")
    .select("id")
    .eq("barber_id", reservationData.barber_id)
    .eq("reservation_date", reservationData.reservation_date)
    .eq("reservation_time", reservationData.reservation_time)
    .not("status", "eq", "cancelada")
    .maybeSingle();

  if (checkError) throw checkError;
  if (existing) {
    throw new Error("Este horario ya ha sido reservado por otro cliente. Por favor, selecciona otra hora.");
  }

  // 2. Sanitize all string inputs
  const sanitized = {
    ...reservationData,
    client_name: sanitizeInput(reservationData.client_name).slice(0, 100),
    client_phone: reservationData.client_phone.replace(/[^\d+\-\s()]/g, '').slice(0, 20),
    client_email: reservationData.client_email 
      ? sanitizeInput(reservationData.client_email).slice(0, 255) 
      : undefined,
  };

  // 3. Validate required fields
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

export function useBarberAvailability(barberId: string | undefined, date: string | undefined) {
  return useQuery({
    queryKey: ["barber-availability", barberId, date],
    queryFn: async () => {
      if (!barberId || !date) return [];
      const { data, error } = await supabase
        .from("reservations")
        .select("reservation_time")
        .eq("barber_id", barberId)
        .eq("reservation_date", date)
        .not("status", "eq", "cancelada");

      if (error) throw error;
      // Normalize time format to HH:mm (e.g. "15:00:00" -> "15:00")
      return data.map((r) => r.reservation_time.substring(0, 5));
    },
    enabled: !!barberId && !!date,
  });
}
