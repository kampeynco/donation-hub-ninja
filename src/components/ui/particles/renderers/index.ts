
import { Circle } from "../types";
import { renderDefaultParticle } from "./default-renderer";
import { renderJourneyParticle } from "./journey-renderer";

export function getParticleRenderer(variant: "default" | "journey") {
  switch (variant) {
    case "journey":
      return renderJourneyParticle;
    case "default":
    default:
      return renderDefaultParticle;
  }
}

export { renderDefaultParticle } from "./default-renderer";
export { renderJourneyParticle } from "./journey-renderer";
export { renderBaseParticle } from "./base-renderer";
