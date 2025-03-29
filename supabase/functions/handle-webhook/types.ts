
export interface ActBlueContribution {
  contributionId: string;
  orderDate: string;
  amount: string;
  donor?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    occupation?: string;
    employer?: string;
    address?: {
      street1?: string;
      street2?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
  recurringFrequency?: 'weekly' | 'monthly' | null;
  recurringDuration?: number;
  expressSignup?: boolean;
  express?: boolean;
  mobileDevice?: boolean;
  paymentType?: string;
}

export interface ActBlueWebhookPayload {
  contribution: ActBlueContribution;
  eventType: string;
  timestamp: string;
}
