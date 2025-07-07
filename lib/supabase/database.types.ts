export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cources: {
        Row: {
          course_name: string
          created_at: string
          description: string
          id: number
          installment_plan_map: Json | null
          is_active: boolean
          origin_url: string
          price_starts_from: string | null
          tariff_price: Json | null
          type: string
          updated_at: string
        }
        Insert: {
          course_name: string
          created_at?: string
          description?: string
          id?: number
          installment_plan_map?: Json | null
          is_active?: boolean
          origin_url: string
          price_starts_from?: string | null
          tariff_price?: Json | null
          type: string
          updated_at?: string
        }
        Update: {
          course_name?: string
          created_at?: string
          description?: string
          id?: number
          installment_plan_map?: Json | null
          is_active?: boolean
          origin_url?: string
          price_starts_from?: string | null
          tariff_price?: Json | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          ip: string | null
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          ip?: string | null
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          ip?: string | null
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      notifications_ovserver_contacts: {
        Row: {
          created_at: string
          id: number
          observer_telegram_id: string | null
          obvserver_email: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          observer_telegram_id?: string | null
          obvserver_email?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          observer_telegram_id?: string | null
          obvserver_email?: string | null
        }
        Relationships: []
      }
      parse_error: {
        Row: {
          client_error_msg: string | null
          course_title: string | null
          created_at: string
          created_course_id: number | null
          error_msg: string
          id: number
          is_handled: boolean | null
          report_id: number
          type: string
          url: string | null
        }
        Insert: {
          client_error_msg?: string | null
          course_title?: string | null
          created_at?: string
          created_course_id?: number | null
          error_msg: string
          id?: number
          is_handled?: boolean | null
          report_id: number
          type: string
          url?: string | null
        }
        Update: {
          client_error_msg?: string | null
          course_title?: string | null
          created_at?: string
          created_course_id?: number | null
          error_msg?: string
          id?: number
          is_handled?: boolean | null
          report_id?: number
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parse_error_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "parse_report"
            referencedColumns: ["id"]
          },
        ]
      }
      parse_report: {
        Row: {
          avg_parse_time: number | null
          created_at: string
          duration: string | null
          id: number
          total_courses_parsed: number | null
          total_parse_time: number | null
          total_updated: number | null
        }
        Insert: {
          avg_parse_time?: number | null
          created_at?: string
          duration?: string | null
          id?: number
          total_courses_parsed?: number | null
          total_parse_time?: number | null
          total_updated?: number | null
        }
        Update: {
          avg_parse_time?: number | null
          created_at?: string
          duration?: string | null
          id?: number
          total_courses_parsed?: number | null
          total_parse_time?: number | null
          total_updated?: number | null
        }
        Relationships: []
      }
      user_course: {
        Row: {
          course_id: number | null
          created_at: string
          id: number
          lead_id: string | null
        }
        Insert: {
          course_id?: number | null
          created_at?: string
          id?: number
          lead_id?: string | null
        }
        Update: {
          course_id?: number | null
          created_at?: string
          id?: number
          lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_course_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "cources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
