
export interface Contact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  status: 'prospect' | 'active' | 'donor';
  created_at: string;
  updated_at: string;
  is_express: boolean | null;
  is_mobile: boolean | null;
  is_paypal: boolean | null;
  is_eligible_for_express_lane: boolean | null;
  emails?: Email[];
  phones?: Phone[];
  locations?: Location[];
  donations?: ContactDonation[];
  employer_data?: EmployerData[];
}

export interface Email {
  id: string;
  email: string;
  type: 'personal' | 'work' | 'other';
  is_primary: boolean;
  verified: boolean | null;
  contact_id?: string;
}

export interface Phone {
  id: string;
  phone: string;
  type: 'mobile' | 'home' | 'work' | 'other';
  is_primary: boolean;
  verified: boolean | null;
  contact_id?: string;
}

export interface Location {
  id: string;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  type: 'home' | 'work' | 'mailing' | 'other';
  is_primary: boolean;
  contact_id?: string;
}

export interface ContactDonation {
  id: string;
  amount: number;
  paid_at: string | null;
  recurring_period: string | null;
  recurring_duration?: number | null;
  status?: string | null;
  committee_name?: string | null;
  contribution_form?: string | null;
  order_number?: string | null;
}

export interface EmployerData {
  id: string;
  employer: string | null;
  occupation: string | null;
  employer_addr1: string | null;
  employer_city: string | null;
  employer_state: string | null;
  employer_country: string | null;
  contact_id?: string;
}

export interface ContactCounts {
  prospect: number;
  active: number;
  donor: number;
  total: number;
}

export interface DuplicateMatch {
  id: string;
  contact1_id: string;
  contact2_id: string;
  confidence_score: number;
  name_score: number | null;
  email_score: number | null;
  phone_score: number | null;
  address_score: number | null;
  created_at: string;
  updated_at: string;
  resolved: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
}
