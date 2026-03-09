import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessInfo {
  name: string;
  tagline: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  mapUrl: string;
  logoUrl: string;
}

const defaultBusinessInfo: BusinessInfo = {
  name: "Tayta BarberShop",
  tagline: "Tu estilo, nuestra pasión",
  taxId: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  mapUrl: "",
  logoUrl: "",
};

export function useBusinessInfo() {
  const query = useQuery({
    queryKey: ["business-info-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_settings")
        .select("setting_value")
        .eq("setting_key", "business_info")
        .maybeSingle();

      if (error || !data) return defaultBusinessInfo;
      return { ...defaultBusinessInfo, ...(data.setting_value as Record<string, any>) } as BusinessInfo;
    },
    staleTime: 5 * 60 * 1000,
  });

  return query.data ?? defaultBusinessInfo;
}

/** Build a wa.me link using the centralized business phone */
export function buildWhatsAppLink(phone: string, message: string) {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "51" + cleaned.slice(1);
  if (cleaned.length <= 9) cleaned = "51" + cleaned;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
