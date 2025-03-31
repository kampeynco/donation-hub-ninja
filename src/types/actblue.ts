
export interface ActBlueDonor {
  firstname?: string;
  lastname?: string;
  addr1?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  email?: string;
  phone?: string;
  isEligibleForExpressLane?: boolean;
  employerData?: {
    employer?: string;
    occupation?: string;
    employerAddr1?: string;
    employerCity?: string;
    employerState?: string;
    employerCountry?: string;
  };
}

export interface ActBlueContribution {
  createdAt: string;
  orderNumber: string;
  contributionForm: string;
  refcodes?: Record<string, string>;
  refcode?: string | null;
  refcode2?: string | null;
  creditCardExpiration?: string;
  recurringPeriod?: string;
  recurringDuration?: number | string;
  isRecurring: boolean | string;
  isPaypal: boolean;
  isMobile: boolean;
  isExpress: boolean;
  withExpressLane: boolean;
  expressSignup: boolean;
  textMessageOption?: string;
  status: string;
  paidAt?: string;
  amount?: string;
  smartBoostAmount?: string;
  giftDeclined?: boolean;
  giftIdentifier?: number | null;
  shippingName?: string;
  shippingAddr1?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: string;
  customFields?: Array<{
    label: string;
    answer: string;
  }>;
  merchandise?: Array<{
    name: string;
    itemId: number;
    details?: any;
  }>;
  bumpYourRecurring?: {
    bumpRecurringLink?: string;
    recurringUpsellSeen?: boolean;
    recurringUpsellAccepted?: boolean;
  };
  uniqueIdentifier?: string;
  abTestName?: string;
  abTestVariation?: string;
  thanksUrl?: string;
  retryUrl?: string;
  weeklyRecurringSunset?: string | null;
}

export interface ActBlueLineItem {
  sequence: number;
  entityId: number;
  fecId: string | null;
  committeeName: string;
  amount: string;
  recurringAmount: string | null;
  paidAt: string;
  paymentId: number | string;
  lineitemId: number;
}

export interface ActBlueWebhookPayload {
  donor?: ActBlueDonor;
  contribution: ActBlueContribution;
  lineitems?: ActBlueLineItem[];
  form?: {
    name: string;
    kind: string;
    ownerEmail: string | null;
    managingEntityName: string | null;
    managingEntityCommitteeName: string | null;
  };
}

// New error response interfaces
export interface WebhookErrorResponse {
  error: string;
  code: number;
  message: string;
  details?: string;
  request_id?: string;
  timestamp?: string;
}

export interface WebhookSuccessResponse {
  success: boolean;
  message: string;
  donation?: any;
  donor?: any;
  request_id: string;
  timestamp: string;
}
