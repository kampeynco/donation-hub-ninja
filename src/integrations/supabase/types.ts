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
      custom_fields: {
        Row: {
          answer: string | null
          created_at: string
          donation_id: string | null
          id: string
          label: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          donation_id?: string | null
          id?: string
          label: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          donation_id?: string | null
          id?: string
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_fields_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          committee_name: string | null
          contribution_form: string | null
          created_at: string
          credit_card_expiration: string | null
          donor_id: string | null
          entity_id: number | null
          express_signup: boolean | null
          gift_declined: boolean | null
          gift_identifier: number | null
          id: string
          is_express: boolean | null
          is_mobile: boolean | null
          is_paypal: boolean | null
          lineitem_id: number | null
          order_number: string | null
          paid_at: string | null
          recurring_duration: number | null
          recurring_period:
            | Database["public"]["Enums"]["recurring_period"]
            | null
          refcodes: Json | null
          shipping_info: Json | null
          smart_boost_amount: number | null
          status: string | null
          text_message_option:
            | Database["public"]["Enums"]["text_message_option"]
            | null
          updated_at: string
          with_express_lane: boolean | null
        }
        Insert: {
          amount: number
          committee_name?: string | null
          contribution_form?: string | null
          created_at?: string
          credit_card_expiration?: string | null
          donor_id?: string | null
          entity_id?: number | null
          express_signup?: boolean | null
          gift_declined?: boolean | null
          gift_identifier?: number | null
          id?: string
          is_express?: boolean | null
          is_mobile?: boolean | null
          is_paypal?: boolean | null
          lineitem_id?: number | null
          order_number?: string | null
          paid_at?: string | null
          recurring_duration?: number | null
          recurring_period?:
            | Database["public"]["Enums"]["recurring_period"]
            | null
          refcodes?: Json | null
          shipping_info?: Json | null
          smart_boost_amount?: number | null
          status?: string | null
          text_message_option?:
            | Database["public"]["Enums"]["text_message_option"]
            | null
          updated_at?: string
          with_express_lane?: boolean | null
        }
        Update: {
          amount?: number
          committee_name?: string | null
          contribution_form?: string | null
          created_at?: string
          credit_card_expiration?: string | null
          donor_id?: string | null
          entity_id?: number | null
          express_signup?: boolean | null
          gift_declined?: boolean | null
          gift_identifier?: number | null
          id?: string
          is_express?: boolean | null
          is_mobile?: boolean | null
          is_paypal?: boolean | null
          lineitem_id?: number | null
          order_number?: string | null
          paid_at?: string | null
          recurring_duration?: number | null
          recurring_period?:
            | Database["public"]["Enums"]["recurring_period"]
            | null
          refcodes?: Json | null
          shipping_info?: Json | null
          smart_boost_amount?: number | null
          status?: string | null
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
          is_eligible_for_express_lane: boolean | null
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
          is_eligible_for_express_lane?: boolean | null
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
          is_eligible_for_express_lane?: boolean | null
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
      employer_data: {
        Row: {
          created_at: string
          donor_id: string | null
          employer: string | null
          employer_addr1: string | null
          employer_city: string | null
          employer_country: string | null
          employer_state: string | null
          id: string
          occupation: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          donor_id?: string | null
          employer?: string | null
          employer_addr1?: string | null
          employer_city?: string | null
          employer_country?: string | null
          employer_state?: string | null
          id?: string
          occupation?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          donor_id?: string | null
          employer?: string | null
          employer_addr1?: string | null
          employer_city?: string | null
          employer_country?: string | null
          employer_state?: string | null
          id?: string
          occupation?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employer_data_donor_id_fkey"
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
      merchandise: {
        Row: {
          created_at: string
          details: Json | null
          donation_id: string | null
          id: string
          item_id: number | null
          name: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          donation_id?: string | null
          id?: string
          item_id?: number | null
          name: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          donation_id?: string | null
          id?: string
          item_id?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchandise_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
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
      webhooks: {
        Row: {
          actblue_webhook_url: string | null
          api_password: string
          api_username: string
          created_at: string
          hookdeck_connection_id: string | null
          hookdeck_destination_url: string
          hookdeck_source_id: string | null
          id: string
          is_active: boolean
          last_used_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actblue_webhook_url?: string | null
          api_password: string
          api_username: string
          created_at?: string
          hookdeck_connection_id?: string | null
          hookdeck_destination_url?: string
          hookdeck_source_id?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actblue_webhook_url?: string | null
          api_password?: string
          api_username?: string
          created_at?: string
          hookdeck_connection_id?: string | null
          hookdeck_destination_url?: string
          hookdeck_source_id?: string | null
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
