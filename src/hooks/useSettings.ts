import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useSettings<T = any>(settingKey: string, defaultValue: T) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["business-settings", settingKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_settings" as any)
        .select("setting_value")
        .eq("setting_key", settingKey)
        .single();

      if (error) {
        console.error(`Error loading ${settingKey}:`, error);
        return defaultValue;
      }
      return (data as any)?.setting_value as T ?? defaultValue;
    },
  });

  const mutation = useMutation({
    mutationFn: async (value: T) => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      const { error } = await supabase
        .from("business_settings" as any)
        .update({
          setting_value: value as any,
          updated_by: userId,
        })
        .eq("setting_key", settingKey);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-settings", settingKey] });
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (e: Error) => {
      toast({
        title: "Error al guardar",
        description: e.message,
        variant: "destructive",
      });
    },
  });

  return {
    data: (query.data ?? defaultValue) as T,
    isLoading: query.isLoading,
    save: mutation.mutate,
    isSaving: mutation.isPending,
  };
}
