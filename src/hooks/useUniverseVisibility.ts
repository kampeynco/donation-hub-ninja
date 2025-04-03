
import { useFeatureVisibility } from "./useFeatureVisibility";

export function useUniverseVisibility() {
  // Reuse the feature visibility hook for the "universe" feature
  return useFeatureVisibility("universe");
}
