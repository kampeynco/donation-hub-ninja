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
      features: {
        Row: {
          created_at: string
          id: string
          personas: boolean
          universe: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          personas?: boolean
          universe?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          personas?: boolean
          universe?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      notification_settings: {
        Row: {
          created_at: string
          donations_email: boolean
          donations_text: boolean
          donations_web: boolean
          id: string
          marketing_email: boolean
          marketing_text: boolean
          marketing_web: boolean
          recurring_email: boolean
          recurring_text: boolean
          recurring_web: boolean
          reports_email: boolean
          reports_text: boolean
          reports_web: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          donations_email?: boolean
          donations_text?: boolean
          donations_web?: boolean
          id?: string
          marketing_email?: boolean
          marketing_text?: boolean
          marketing_web?: boolean
          recurring_email?: boolean
          recurring_text?: boolean
          recurring_web?: boolean
          reports_email?: boolean
          reports_text?: boolean
          reports_web?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          donations_email?: boolean
          donations_text?: boolean
          donations_web?: boolean
          id?: string
          marketing_email?: boolean
          marketing_text?: boolean
          marketing_web?: boolean
          recurring_email?: boolean
          recurring_text?: boolean
          recurring_web?: boolean
          reports_email?: boolean
          reports_text?: boolean
          reports_web?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          contact_first_name: string | null
          contact_last_name: string | null
          created_at: string
          id: string
          mobile_phone: string | null
          updated_at: string
        }
        Insert: {
          committee_name: string
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          id: string
          mobile_phone?: string | null
          updated_at?: string
        }
        Update: {
          committee_name?: string
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          id?: string
          mobile_phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_donors: {
        Row: {
          created_at: string
          donor_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          donor_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          donor_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_donors_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlists: {
        Row: {
          created_at: string
          feature_name: Database["public"]["Enums"]["feature_name"]
          id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["waitlist_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_name: Database["public"]["Enums"]["feature_name"]
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["waitlist_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_name?: Database["public"]["Enums"]["feature_name"]
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["waitlist_status"] | null
          updated_at?: string
          user_id?: string
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
      consolidate_duplicate_features: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_average_recurring_duration: {
        Args: { donor_uuid: string }
        Returns: number
      }
    }
    Enums: {
      feature_name: "Segments" | "Donors"
      location_type: "main" | "work"
      notification_action: "user" | "system" | "donor"
      recurring_period: "once" | "weekly" | "monthly"
      text_message_option: "unknown" | "opt_in" | "opt_out"
      waitlist_status: "joined" | "approved" | "rejected" | "declined"
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
    Enums: {
      feature_name: ["Segments", "Donors"],
      location_type: ["main", "work"],
      notification_action: ["user", "system", "donor"],
      recurring_period: ["once", "weekly", "monthly"],
      text_message_option: ["unknown", "opt_in", "opt_out"],
      waitlist_status: ["joined", "approved", "rejected", "declined"],
    },
  },
} as const
