
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
  recurringDuration?: number;
  isRecurring: boolean;
  isPaypal: boolean;
  isMobile: boolean;
  isExpress: boolean;
  withExpressLane: boolean;
  expressSignup: boolean;
  textMessageOption?: string;
  status: string;
  paidAt?: string;
  amount?: string;
}

export interface ActBlueLineItem {
  sequence: number;
  entityId: number;
  fecId: string;
  committeeName: string;
  amount: string;
  recurringAmount: string | null;
  paidAt: string;
  paymentId: number;
  lineitemId: number;
}

export interface ActBlueWebhookPayload {
  donor?: ActBlueDonor;
  contribution: ActBlueContribution;
  lineitems?: ActBlueLineItem[];
  form?: {
    name: string;
    kind: string;
    ownerEmail: string;
    managingEntityName: string | null;
    managingEntityCommitteeName: string | null;
  };
}
