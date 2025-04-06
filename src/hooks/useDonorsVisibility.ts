
import { useFeatureVisibility } from "./useFeatureVisibility";

export function useDonorsVisibility() {
  // Reuse the feature visibility hook for the "donors" feature
  return useFeatureVisibility("donors");
}
