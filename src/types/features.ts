
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
    id: "personas",
    name: "Personas",
    description: "Access donor personas and analytics",
    enabled: true,
    beta: true,
    hidden: true
  },
  {
    id: "universe",
    name: "Universe",
    description: "View donor activity across the platform",
    enabled: true,
    beta: true,
    hidden: true
  }
];
