import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  category: string;
  description: string | null;
  stock: number;
  min_stock: number;
  purchase_price: number;
  sale_price: number;
  photo_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  type: string;
  quantity: number;
  stock_before: number;
  stock_after: number;
  reason: string | null;
  responsible: string | null;
  created_at: string;
  product?: { name: string; photo_url: string | null } | null;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: {
      name: string;
      sku?: string;
      barcode?: string;
      category: string;
      description?: string;
      stock: number;
      min_stock: number;
      purchase_price: number;
      sale_price: number;
      photo_url?: string;
    }) => {
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();
      if (error) throw error;

      // Create initial stock movement if stock > 0
      if (product.stock > 0) {
        await supabase.from("stock_movements").insert([{
          product_id: data.id,
          type: "purchase",
          quantity: product.stock,
          stock_before: 0,
          stock_after: product.stock,
          reason: "Stock inicial",
          responsible: "Admin",
        }]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stock_movements"] });
      toast.success("Producto creado exitosamente");
    },
    onError: (error: any) => {
      toast.error("Error al crear producto: " + error.message);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto actualizado");
    },
    onError: (error: any) => {
      toast.error("Error al actualizar: " + error.message);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stock_movements"] });
      toast.success("Producto eliminado");
    },
    onError: (error: any) => {
      toast.error("Error al eliminar: " + error.message);
    },
  });
}

export function useStockMovements() {
  return useQuery({
    queryKey: ["stock_movements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_movements")
        .select("*, product:products(name, photo_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as StockMovement[];
    },
  });
}

export function useCreateMovement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (movement: {
      product_id: string;
      type: string;
      quantity: number;
      reason?: string;
      responsible?: string;
    }) => {
      // Get current stock
      const { data: product, error: pError } = await supabase
        .from("products")
        .select("stock")
        .eq("id", movement.product_id)
        .single();
      if (pError) throw pError;

      const stockBefore = product.stock;
      const stockAfter = stockBefore + movement.quantity;

      if (stockAfter < 0) throw new Error("Stock insuficiente");

      // Update product stock
      const { error: uError } = await supabase
        .from("products")
        .update({ stock: stockAfter })
        .eq("id", movement.product_id);
      if (uError) throw uError;

      // Insert movement
      const { data, error } = await supabase
        .from("stock_movements")
        .insert([{
          ...movement,
          stock_before: stockBefore,
          stock_after: stockAfter,
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stock_movements"] });
      toast.success("Movimiento registrado");
    },
    onError: (error: any) => {
      toast.error("Error: " + error.message);
    },
  });
}

export async function uploadProductImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file);
  if (error) throw error;

  const { data } = supabase.storage.from("products").getPublicUrl(fileName);
  return data.publicUrl;
}
