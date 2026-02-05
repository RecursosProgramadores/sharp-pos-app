import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Reservation } from "@/types/reservation";

export function useReservations() {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          service:services(*),
          barber:barbers(id, full_name, photo_url, specialty),
          location:locations(*)
        `)
        .order("reservation_date", { ascending: true })
        .order("reservation_time", { ascending: true });

      if (error) throw error;
      return data as Reservation[];
    },
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      satisfaction_rating,
    }: {
      id: string;
      status: string;
      satisfaction_rating?: number;
    }) => {
      const updateData: Record<string, unknown> = { status };
      if (satisfaction_rating !== undefined) {
        updateData.satisfaction_rating = satisfaction_rating;
      }

      const { data, error } = await supabase
        .from("reservations")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reservations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useTodayReservations() {
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["reservations", "today"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          service:services(name, price),
          barber:barbers(id, full_name, photo_url),
          location:locations(name)
        `)
        .eq("reservation_date", today)
        .order("reservation_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

export function usePendingReservationsCount() {
  return useQuery({
    queryKey: ["reservations", "pending-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("reservations")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (error) throw error;
      return count || 0;
    },
  });
}
