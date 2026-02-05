export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      barber_schedules: {
        Row: {
          barber_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          barber_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          barber_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_schedules_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_schedules_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "income_by_barber"
            referencedColumns: ["barber_id"]
          },
        ]
      }
      barbers: {
        Row: {
          active: boolean
          commission_percentage: number | null
          created_at: string
          dni: string | null
          email: string | null
          full_name: string
          hire_date: string | null
          id: string
          incentive_per_cut: number | null
          incentive_threshold: number | null
          incentives_enabled: boolean | null
          lunch_amount: number | null
          lunch_included: boolean | null
          phone: string | null
          photo_url: string | null
          specialty: string | null
          updated_at: string
          work_type: string | null
        }
        Insert: {
          active?: boolean
          commission_percentage?: number | null
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          incentive_per_cut?: number | null
          incentive_threshold?: number | null
          incentives_enabled?: boolean | null
          lunch_amount?: number | null
          lunch_included?: boolean | null
          phone?: string | null
          photo_url?: string | null
          specialty?: string | null
          updated_at?: string
          work_type?: string | null
        }
        Update: {
          active?: boolean
          commission_percentage?: number | null
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          incentive_per_cut?: number | null
          incentive_threshold?: number | null
          incentives_enabled?: boolean | null
          lunch_amount?: number | null
          lunch_included?: boolean | null
          phone?: string | null
          photo_url?: string | null
          specialty?: string | null
          updated_at?: string
          work_type?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          last_visit: string | null
          level: string
          notes: string | null
          phone: string
          photo_url: string | null
          points: number
          preferred_barber_id: string | null
          preferred_services: string[] | null
          satisfaction_rating: number | null
          total_spent: number
          updated_at: string
          visits: number
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          last_visit?: string | null
          level?: string
          notes?: string | null
          phone: string
          photo_url?: string | null
          points?: number
          preferred_barber_id?: string | null
          preferred_services?: string[] | null
          satisfaction_rating?: number | null
          total_spent?: number
          updated_at?: string
          visits?: number
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          last_visit?: string | null
          level?: string
          notes?: string | null
          phone?: string
          photo_url?: string | null
          points?: number
          preferred_barber_id?: string | null
          preferred_services?: string[] | null
          satisfaction_rating?: number | null
          total_spent?: number
          updated_at?: string
          visits?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_preferred_barber_id_fkey"
            columns: ["preferred_barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_preferred_barber_id_fkey"
            columns: ["preferred_barber_id"]
            isOneToOne: false
            referencedRelation: "income_by_barber"
            referencedColumns: ["barber_id"]
          },
        ]
      }
      haircuts: {
        Row: {
          barber_id: string | null
          created_at: string
          id: string
          payment_method: string
          price: number
          service_name: string
        }
        Insert: {
          barber_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          price: number
          service_name: string
        }
        Update: {
          barber_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          price?: number
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "haircuts_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haircuts_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "income_by_barber"
            referencedColumns: ["barber_id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          schedule: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          schedule?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          schedule?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          barcode: string | null
          created_at: string
          id: string
          name: string
          purchase_price: number
          sale_price: number
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          barcode?: string | null
          created_at?: string
          id?: string
          name: string
          purchase_price?: number
          sale_price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          barcode?: string | null
          created_at?: string
          id?: string
          name?: string
          purchase_price?: number
          sale_price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          barber_id: string | null
          client_email: string | null
          client_name: string
          client_phone: string
          created_at: string
          id: string
          location_id: string | null
          notes: string | null
          reservation_date: string
          reservation_time: string
          satisfaction_rating: number | null
          service_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          barber_id?: string | null
          client_email?: string | null
          client_name: string
          client_phone: string
          created_at?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          reservation_date: string
          reservation_time: string
          satisfaction_rating?: number | null
          service_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          barber_id?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string
          created_at?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          reservation_date?: string
          reservation_time?: string
          satisfaction_rating?: number | null
          service_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "income_by_barber"
            referencedColumns: ["barber_id"]
          },
          {
            foreignKeyName: "reservations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          price: number
          product_id: string | null
          quantity: number
          sale_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          product_id?: string | null
          quantity: number
          sale_id: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          product_id?: string | null
          quantity?: number
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "top_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          barber_id: string | null
          created_at: string
          id: string
          payment_method: string
          total: number
        }
        Insert: {
          barber_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          total?: number
        }
        Update: {
          barber_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "income_by_barber"
            referencedColumns: ["barber_id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      daily_sales: {
        Row: {
          average_ticket: number | null
          sale_date: string | null
          total_revenue: number | null
          total_transactions: number | null
        }
        Relationships: []
      }
      income_by_barber: {
        Row: {
          average_ticket: number | null
          barber_id: string | null
          barber_name: string | null
          total_revenue: number | null
          total_sales: number | null
        }
        Relationships: []
      }
      monthly_sales: {
        Row: {
          average_ticket: number | null
          sale_month: string | null
          total_revenue: number | null
          total_transactions: number | null
        }
        Relationships: []
      }
      top_products: {
        Row: {
          product_id: string | null
          product_name: string | null
          total_revenue: number | null
          units_sold: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "cajero"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "cajero"],
    },
  },
} as const
