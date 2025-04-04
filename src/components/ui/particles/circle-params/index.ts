
import { Circle, CanvasSize } from "../types";
import { generateDefaultParams } from "./default-params";
import { generateJourneyParams } from "./journey-params";
import { generateCableParams } from "./cable-params";
import { generateNetworkParams } from "./network-params";

// Export all functions from individual files
export { generateDefaultParams } from "./default-params";
export { generateJourneyParams } from "./journey-params";
export { generateCableParams } from "./cable-params";
export { 
  generateNetworkParams,
  createNetworkConnections,
  createDataPackets,
  updateDataPackets
} from "./network-params";

/**
 * Generates parameters for a particle circle based on the variant
 */
export function generateCircleParams(
  canvasSize: CanvasSize, 
  variant: "default" | "journey" | "cable" | "network" = "default",
  size: number = 0.4,
  paths?: { path: Path2D; length: number; points: { x: number; y: number }[] }[]
): Circle {
  switch (variant) {
    case "network":
      return generateNetworkParams(canvasSize, size);
    case "cable":
      return generateCableParams(canvasSize, size, paths);
    case "journey":
      return generateJourneyParams(canvasSize, size);
    case "default":
    default:
      return generateDefaultParams(canvasSize, size);
  }
}
