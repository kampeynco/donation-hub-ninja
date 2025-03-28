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
      donations: {
        Row: {
          amount: number
          created_at: string
          credit_card_expiration: string | null
          donor_id: string | null
          express_signup: boolean | null
          id: string
          is_express: boolean | null
          is_mobile: boolean | null
          is_paypal: boolean | null
          paid_at: string | null
          recurring_duration: number | null
          recurring_period:
            | Database["public"]["Enums"]["recurring_period"]
            | null
          text_message_option:
            | Database["public"]["Enums"]["text_message_option"]
            | null
          updated_at: string
          with_express_lane: boolean | null
        }
        Insert: {
          amount: number
          created_at?: string
          credit_card_expiration?: string | null
          donor_id?: string | null
          express_signup?: boolean | null
          id?: string
          is_express?: boolean | null
          is_mobile?: boolean | null
          is_paypal?: boolean | null
          paid_at?: string | null
          recurring_duration?: number | null
          recurring_period?:
            | Database["public"]["Enums"]["recurring_period"]
            | null
          text_message_option?:
            | Database["public"]["Enums"]["text_message_option"]
            | null
          updated_at?: string
          with_express_lane?: boolean | null
        }
        Update: {
          amount?: number
          created_at?: string
          credit_card_expiration?: string | null
          donor_id?: string | null
          express_signup?: boolean | null
          id?: string
          is_express?: boolean | null
          is_mobile?: boolean | null
          is_paypal?: boolean | null
          paid_at?: string | null
          recurring_duration?: number | null
          recurring_period?:
            | Database["public"]["Enums"]["recurring_period"]
            | null
          text_message_option?:
            | Database["public"]["Enums"]["text_message_option"]
            | null
          updated_at?: string
          with_express_lane?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          is_express: boolean | null
          is_mobile: boolean | null
          is_paypal: boolean | null
          last_name: string | null
          text_message_option:
            | Database["public"]["Enums"]["text_message_option"]
            | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          is_express?: boolean | null
          is_mobile?: boolean | null
          is_paypal?: boolean | null
          last_name?: string | null
          text_message_option?:
            | Database["public"]["Enums"]["text_message_option"]
            | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          is_express?: boolean | null
          is_mobile?: boolean | null
          is_paypal?: boolean | null
          last_name?: string | null
          text_message_option?:
            | Database["public"]["Enums"]["text_message_option"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      emails: {
        Row: {
          created_at: string
          donor_id: string | null
          email: string
          id: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          donor_id?: string | null
          email: string
          id?: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          donor_id?: string | null
          email?: string
          id?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          donor_id: string | null
          id: string
          state: string | null
          street: string | null
          type: Database["public"]["Enums"]["location_type"] | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          donor_id?: string | null
          id?: string
          state?: string | null
          street?: string | null
          type?: Database["public"]["Enums"]["location_type"] | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          donor_id?: string | null
          id?: string
          state?: string | null
          street?: string | null
          type?: Database["public"]["Enums"]["location_type"] | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action: Database["public"]["Enums"]["notification_action"]
          created_at: string
          date: string
          donor_id: string | null
          id: string
          is_read: boolean | null
          message: string
        }
        Insert: {
          action: Database["public"]["Enums"]["notification_action"]
          created_at?: string
          date?: string
          donor_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
        }
        Update: {
          action?: Database["public"]["Enums"]["notification_action"]
          created_at?: string
          date?: string
          donor_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      phones: {
        Row: {
          created_at: string
          donor_id: string | null
          id: string
          phone: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          donor_id?: string | null
          id?: string
          phone: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          donor_id?: string | null
          id?: string
          phone?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "phones_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          committee_name: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          committee_name: string
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          committee_name?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          error: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean
          processed_at: string | null
          webhook_id: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean
          processed_at?: string | null
          webhook_id: string
        }
        Update: {
          created_at?: string
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean
          processed_at?: string | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          api_password: string
          api_username: string
          created_at: string
          endpoint_url: string
          id: string
          is_active: boolean
          last_used_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_password: string
          api_username: string
          created_at?: string
          endpoint_url?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_password?: string
          api_username?: string
          created_at?: string
          endpoint_url?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_average_recurring_duration: {
        Args: {
          donor_uuid: string
        }
        Returns: number
      }
    }
    Enums: {
      location_type: "main" | "work"
      notification_action: "user" | "system" | "donor"
      recurring_period: "once" | "weekly" | "monthly"
      text_message_option: "unknown" | "opt_in" | "opt_out"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
