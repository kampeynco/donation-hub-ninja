
import { useFeatureVisibility } from "./useFeatureVisibility";

export function useSegmentsVisibility() {
  // Reuse the feature visibility hook for the "segments" feature
  return useFeatureVisibility("segments");
}
