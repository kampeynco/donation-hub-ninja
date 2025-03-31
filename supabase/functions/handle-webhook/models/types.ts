
import { ActBlueDonor, ActBlueContribution, ActBlueLineItem } from "../types.ts";

export interface ProcessResult<T = any> {
  success: boolean;
  data?: T;
  error?: any;
}

export interface DonationData {
  amount: number;
  paid_at: string;
  is_mobile: boolean;
  recurring_period: 'monthly' | 'weekly' | 'once';
  recurring_duration: number;
  express_signup: boolean;
  is_express: boolean;
  is_paypal: boolean;
  // New fields
  order_number?: string;
  contribution_form?: string;
  status?: string;
  refcodes?: any;
  lineitem_id?: number;
  entity_id?: number;
  committee_name?: string;
  smart_boost_amount?: number | null;
  gift_declined?: boolean;
  gift_identifier?: number | null;
  shipping_info?: any;
  text_message_option?: string;
  with_express_lane?: boolean;
}

export interface DonorData {
  first_name: string | null;
  last_name: string | null;
  is_express: boolean;
  is_mobile: boolean;
  is_paypal: boolean;
  // New field
  is_eligible_for_express_lane: boolean;
}

export interface LocationData {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface SuccessResponseData {
  success: boolean;
  message: string;
  donation: any;
  donor: any | null;
  request_id: string;
  timestamp: string;
}
