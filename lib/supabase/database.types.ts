export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      parse_error: {
        Row: {
          client_error_msg: string | null
          course_title: string | null
          created_at: string
          error_msg: string
          id: number
          report_id: number
          type: string
          url: string | null
        }
        Insert: {
          client_error_msg?: string | null
          course_title?: string | null
          created_at?: string
          error_msg: string
          id?: number
          report_id: number
          type: string
          url?: string | null
        }
        Update: {
          client_error_msg?: string | null
          course_title?: string | null
          created_at?: string
          error_msg?: string
          id?: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
