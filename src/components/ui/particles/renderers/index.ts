
import { Circle } from "../types";
import { renderDefaultParticle } from "./default-renderer";
import { renderJourneyParticle } from "./journey-renderer";
import { renderCableParticle } from "./cable-renderer";
import { renderNetworkParticle, renderNetworkConnections } from "./network-renderer";

export function getParticleRenderer(variant: "default" | "journey" | "cable" | "network") {
  switch (variant) {
    case "journey":
      return renderJourneyParticle;
    case "cable":
      return renderCableParticle;
    case "network":
      return renderNetworkParticle;
    case "default":
    default:
      return renderDefaultParticle;
  }
}

export { renderDefaultParticle } from "./default-renderer";
export { renderJourneyParticle } from "./journey-renderer";
export { renderCableParticle } from "./cable-renderer";
export { renderBaseParticle } from "./base-renderer";
export { renderNetworkParticle, renderNetworkConnections } from "./network-renderer";
