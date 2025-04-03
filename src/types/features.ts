
import { WaitlistStatus, FeatureName } from "@/services/waitlistService";

export interface FeatureItem {
  id: string;
  name: FeatureName;
  description: string;
  enabled: boolean;
  status: WaitlistStatus;
  beta: boolean;
  hidden: boolean;
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
