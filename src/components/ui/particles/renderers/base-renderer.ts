
import { ParticleRendererProps } from "../types";
import { hexToRgb } from "../utils";

export function renderBaseParticle({
  context,
  circle,
  update = false,
  dpr
}: ParticleRendererProps): void {
  const { x, y, translateX, translateY, size, alpha } = circle;
  
  context.translate(translateX, translateY);
  context.beginPath();
  context.arc(x, y, size, 0, 2 * Math.PI);
  
  const rgb = hexToRgb(circle.color || "#ffffff");
  context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
  
  context.fill();
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}
