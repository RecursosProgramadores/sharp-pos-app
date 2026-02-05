import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Location, Service } from "@/types/reservation";

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
  const { data, error } = await supabase
    .from("reservations")
    .insert([reservationData])
    .select()
    .single();

  if (error) throw error;
  return data;
}
