import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Client, ClientFormData } from "@/types/client";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select(`
          *,
          barbers:preferred_barber_id (
            id,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedClients: Client[] = (data || []).map((client: any) => ({
        id: client.id,
        full_name: client.full_name,
        phone: client.phone,
        email: client.email,
        birth_date: client.birth_date,
        photo_url: client.photo_url,
        preferred_barber_id: client.preferred_barber_id,
        preferred_barber_name: client.barbers?.full_name || null,
        preferred_services: client.preferred_services || [],
        notes: client.notes,
        visits: client.visits,
        total_spent: client.total_spent,
        points: client.points,
        level: client.level,
        last_visit: client.last_visit,
        satisfaction_rating: client.satisfaction_rating,
        created_at: client.created_at,
        updated_at: client.updated_at,
      }));

      setClients(formattedClients);
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      toast.error("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (formData: ClientFormData): Promise<boolean> => {
    try {
      const { error } = await supabase.from("clients").insert({
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email || null,
        birth_date: formData.birth_date || null,
        photo_url: formData.photo_url || null,
        preferred_barber_id: formData.preferred_barber_id || null,
        preferred_services: formData.preferred_services,
        notes: formData.notes || null,
        satisfaction_rating: formData.satisfaction_rating || null,
        last_visit: new Date().toISOString().split("T")[0],
      });

      if (error) throw error;

      toast.success("Cliente registrado exitosamente");
      await fetchClients();
      return true;
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast.error("Error al registrar cliente");
      return false;
    }
  };

  const updateClient = async (id: string, formData: Partial<ClientFormData>): Promise<boolean> => {
    try {
      const updateData: any = {};
      
      if (formData.full_name !== undefined) updateData.full_name = formData.full_name;
      if (formData.phone !== undefined) updateData.phone = formData.phone;
      if (formData.email !== undefined) updateData.email = formData.email || null;
      if (formData.birth_date !== undefined) updateData.birth_date = formData.birth_date || null;
      if (formData.photo_url !== undefined) updateData.photo_url = formData.photo_url || null;
      if (formData.preferred_barber_id !== undefined) updateData.preferred_barber_id = formData.preferred_barber_id || null;
      if (formData.preferred_services !== undefined) updateData.preferred_services = formData.preferred_services;
      if (formData.notes !== undefined) updateData.notes = formData.notes || null;
      if (formData.satisfaction_rating !== undefined) updateData.satisfaction_rating = formData.satisfaction_rating || null;

      const { error } = await supabase
        .from("clients")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Cliente actualizado");
      await fetchClients();
      return true;
    } catch (error: any) {
      console.error("Error updating client:", error);
      toast.error("Error al actualizar cliente");
      return false;
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) throw error;

      toast.success("Cliente eliminado");
      setClients((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast.error("Error al eliminar cliente");
      return false;
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("clients")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("clients").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      toast.error("Error al subir la foto");
      return null;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    uploadPhoto,
    refetch: fetchClients,
  };
}
