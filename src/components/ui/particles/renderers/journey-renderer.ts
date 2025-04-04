
import { ParticleRendererProps } from "../types";
import { hexToRgb } from "../utils";

export function renderJourneyParticle({
  context,
  circle,
  update = false,
  dpr
}: ParticleRendererProps): void {
  const { x, y, translateX, translateY, size, alpha, type } = circle;
  
  context.translate(translateX, translateY);
  context.beginPath();
  context.arc(x, y, size, 0, 2 * Math.PI);
  
  // Journey particles use their own colors based on type
  if (circle.color) {
    const customRgb = hexToRgb(circle.color);
    context.fillStyle = `rgba(${customRgb.join(", ")}, ${alpha})`;
  } else {
    const rgb = hexToRgb("#ffffff");
    context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
  }
  
  context.fill();
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}
