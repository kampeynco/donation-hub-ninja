
import { Circle } from "../types";
import { renderDefaultParticle } from "./default-renderer";
import { renderJourneyParticle } from "./journey-renderer";
import { renderCableParticle } from "./cable-renderer";

export function getParticleRenderer(variant: "default" | "journey" | "cable") {
  switch (variant) {
    case "journey":
      return renderJourneyParticle;
    case "cable":
      return renderCableParticle;
    case "default":
    default:
      return renderDefaultParticle;
  }
}

export { renderDefaultParticle } from "./default-renderer";
export { renderJourneyParticle } from "./journey-renderer";
export { renderCableParticle } from "./cable-renderer";
export { renderBaseParticle } from "./base-renderer";
