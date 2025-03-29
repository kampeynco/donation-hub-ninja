
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
}

export interface DonorData {
  first_name: string | null;
  last_name: string | null;
  is_express: boolean;
  is_mobile: boolean;
  is_paypal: boolean;
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
