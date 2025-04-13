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
      contacts: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          is_eligible_for_express_lane: boolean | null
          is_express: boolean | null
          is_mobile: boolean | null
          is_paypal: boolean | null
          last_name: string | null
          status: Database["public"]["Enums"]["contact_status"]
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
          status?: Database["public"]["Enums"]["contact_status"]
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
          status?: Database["public"]["Enums"]["contact_status"]
          text_message_option?:
            | Database["public"]["Enums"]["text_message_option"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
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
          contact_id: string | null
          contribution_form: string | null
          created_at: string
          credit_card_expiration: string | null
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
          contact_id?: string | null
          contribution_form?: string | null
          created_at?: string
          credit_card_expiration?: string | null
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
          contact_id?: string | null
          contribution_form?: string | null
          created_at?: string
          credit_card_expiration?: string | null
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
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      duplicate_matches: {
        Row: {
          address_score: number | null
          confidence_score: number
          contact1_id: string
          contact2_id: string
          created_at: string
          email_score: number | null
          id: string
          name_score: number | null
          phone_score: number | null
          resolved: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          updated_at: string
        }
        Insert: {
          address_score?: number | null
          confidence_score: number
          contact1_id: string
          contact2_id: string
          created_at?: string
          email_score?: number | null
          id?: string
          name_score?: number | null
          phone_score?: number | null
          resolved?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string
        }
        Update: {
          address_score?: number | null
          confidence_score?: number
          contact1_id?: string
          contact2_id?: string
          created_at?: string
          email_score?: number | null
          id?: string
          name_score?: number | null
          phone_score?: number | null
          resolved?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      emails: {
        Row: {
          contact_id: string | null
          created_at: string
          email: string
          id: string
          is_primary: boolean
          type: Database["public"]["Enums"]["email_type"]
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          email: string
          id?: string
          is_primary?: boolean
          type?: Database["public"]["Enums"]["email_type"]
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          email?: string
          id?: string
          is_primary?: boolean
          type?: Database["public"]["Enums"]["email_type"]
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_donor_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_data: {
        Row: {
          contact_id: string | null
          created_at: string
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
          contact_id?: string | null
          created_at?: string
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
          contact_id?: string | null
          created_at?: string
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
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
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
          contact_id: string | null
          country: string | null
          created_at: string
          id: string
          is_primary: boolean
          state: string | null
          street: string | null
          type: Database["public"]["Enums"]["location_type"] | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          contact_id?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          state?: string | null
          street?: string | null
          type?: Database["public"]["Enums"]["location_type"] | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          contact_id?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          state?: string | null
          street?: string | null
          type?: Database["public"]["Enums"]["location_type"] | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_donor_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
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
      merge_history: {
        Row: {
          created_at: string
          id: string
          merged_by: string | null
          merged_contact_id: string
          metadata: Json | null
          primary_contact_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          merged_by?: string | null
          merged_contact_id: string
          metadata?: Json | null
          primary_contact_id: string
        }
        Update: {
          created_at?: string
          id?: string
          merged_by?: string | null
          merged_contact_id?: string
          metadata?: Json | null
          primary_contact_id?: string
        }
        Relationships: []
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
          contact_id: string | null
          created_at: string
          date: string
          id: string
          is_read: boolean | null
          message: string
        }
        Insert: {
          action: Database["public"]["Enums"]["notification_action"]
          contact_id?: string | null
          created_at?: string
          date?: string
          id?: string
          is_read?: boolean | null
          message: string
        }
        Update: {
          action?: Database["public"]["Enums"]["notification_action"]
          contact_id?: string | null
          created_at?: string
          date?: string
          id?: string
          is_read?: boolean | null
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_donor_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      phones: {
        Row: {
          contact_id: string | null
          created_at: string
          id: string
          is_primary: boolean
          phone: string
          type: Database["public"]["Enums"]["phone_type"]
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          phone: string
          type?: Database["public"]["Enums"]["phone_type"]
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          phone?: string
          type?: Database["public"]["Enums"]["phone_type"]
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "phones_donor_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
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
      user_contacts: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_donors_donor_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
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
      webhook_data: {
        Row: {
          created_at: string
          error: string | null
          id: string
          payload: Json
          processed: boolean | null
          updated_at: string
          webhook_id: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          payload: Json
          processed?: boolean | null
          updated_at?: string
          webhook_id?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          payload?: Json
          processed?: boolean | null
          updated_at?: string
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_data_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
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
      contact_status: "active" | "inactive" | "prospect" | "donor"
      email_type: "personal" | "work" | "other"
      feature_name: "Segments" | "Donors"
      location_type: "main" | "work" | "home" | "mailing" | "other"
      notification_action: "user" | "system" | "donor"
      phone_type: "mobile" | "home" | "work" | "other"
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
      contact_status: ["active", "inactive", "prospect", "donor"],
      email_type: ["personal", "work", "other"],
      feature_name: ["Segments", "Donors"],
      location_type: ["main", "work", "home", "mailing", "other"],
      notification_action: ["user", "system", "donor"],
      phone_type: ["mobile", "home", "work", "other"],
      recurring_period: ["once", "weekly", "monthly"],
      text_message_option: ["unknown", "opt_in", "opt_out"],
      waitlist_status: ["joined", "approved", "rejected", "declined"],
    },
  },
} as const
