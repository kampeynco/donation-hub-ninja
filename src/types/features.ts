
export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  beta: boolean;
  hidden: boolean;
}

export const INITIAL_FEATURES: FeatureItem[] = [
  {
    id: "segments",
    name: "Segments",
    description: "Access donor segments and analytics",
    enabled: true,
    beta: true,
    hidden: true
  },
  {
    id: "donors",
    name: "Donors",
    description: "View donor activity across the platform",
    enabled: true,
    beta: true,
    hidden: true
  }
];
