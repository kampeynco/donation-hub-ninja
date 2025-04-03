
import { FeatureName, WaitlistStatus } from "@/services/waitlistService";

export interface FeatureItem {
  id: string;
  name: FeatureName;
  description: string;
  enabled: boolean;
  status: WaitlistStatus;
  beta: boolean;
  hidden: boolean;
}

export interface RealtimePayload {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: string;
  new: {
    feature_name: string;
    status: WaitlistStatus;
    [key: string]: any;
  };
  old: {
    [key: string]: any;
  };
  errors: any;
}

export const INITIAL_FEATURES: FeatureItem[] = [
  {
    id: "personas",
    name: "Personas",
    description: "Access donor personas and analytics",
    enabled: false,
    status: null,
    beta: true,
    hidden: false
  }
];
