
import { ParticleRendererProps } from "../types";
import { hexToRgb } from "../utils";

export function renderNetworkParticle({
  context,
  circle,
  update = false,
  dpr
}: ParticleRendererProps): void {
  const { x, y, translateX, translateY, size, alpha, isNode, connections, dataPackets } = circle;
  
  // Save current context state
  context.save();
  
  // Apply translation for mouse interaction
  context.translate(translateX, translateY);
  
  // Get RGB values from hex color
  const rgb = hexToRgb(circle.color || "#007AFF");
  
  // Draw node
  if (isNode) {
    // Node fill (semi-transparent)
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha * 0.5})`;
    context.fill();
    
    // Node border (more opaque)
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.strokeStyle = `rgba(${rgb.join(", ")}, ${alpha * 0.8})`;
    context.lineWidth = 1;
    context.stroke();
    
    // Subtle glow effect
    const glowSize = size * 2;
    const gradient = context.createRadialGradient(
      x, y, size * 0.8,
      x, y, glowSize
    );
    gradient.addColorStop(0, `rgba(${rgb.join(", ")}, ${alpha * 0.3})`);
    gradient.addColorStop(1, `rgba(${rgb.join(", ")}, 0)`);
    
    context.beginPath();
    context.arc(x, y, glowSize, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
  } 
  // Data packet visualization (not drawn here - handled separately)
  
  // Restore context
  context.restore();
}

/**
 * Renders connections between nodes in the network
 */
export function renderNetworkConnections(
  context: CanvasRenderingContext2D,
  circles: any[],
  dpr: number
): void {
  // Save context
  context.save();
  
  // Draw connections between nodes
  circles.forEach((circle, i) => {
    if (circle.isNode && circle.connections && circle.connections.length > 0) {
      const { x, y, translateX, translateY } = circle;
      
      // Draw each connection line
      circle.connections.forEach((targetIdx: number) => {
        if (targetIdx < circles.length) {
          const target = circles[targetIdx];
          
          // Calculate actual positions with translations
          const x1 = x + translateX;
          const y1 = y + translateY;
          const x2 = target.x + target.translateX;
          const y2 = target.y + target.translateY;
          
          // Don't draw connections to nodes that are too far away
          const dx = x2 - x1;
          const dy = y2 - y1;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 300) { // Only connect nodes within a reasonable distance
            // Calculate line opacity based on distance
            const opacity = Math.max(0, 0.5 * (1 - distance / 300));
            
            // Draw connection line
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.strokeStyle = `rgba(143, 170, 220, ${opacity})`;
            context.lineWidth = 0.5;
            context.stroke();
          }
        }
      });
    }
  });
  
  // Draw data packets moving along connections
  circles.forEach((circle) => {
    if (circle.isNode && circle.connections && circle.dataPackets) {
      const { x, y, translateX, translateY } = circle;
      
      // Draw each data packet
      circle.dataPackets.forEach((packet: { progress: number; targetIdx: number }) => {
        const { progress, targetIdx } = packet;
        
        if (targetIdx < circles.length) {
          const target = circles[targetIdx];
          
          // Calculate start and end positions with translations
          const x1 = x + translateX;
          const y1 = y + translateY;
          const x2 = target.x + target.translateX;
          const y2 = target.y + target.translateY;
          
          // Interpolate position based on progress (0-1)
          const packetX = x1 + (x2 - x1) * progress;
          const packetY = y1 + (y2 - y1) * progress;
          
          // Draw data packet
          context.beginPath();
          context.arc(packetX, packetY, 2, 0, Math.PI * 2);
          
          // Packet color based on the source node
          const rgb = hexToRgb(circle.color || "#007AFF");
          
          // Fade in at start, fade out at end
          let alpha = 0.8;
          if (progress < 0.1) {
            alpha = progress * 8; // Fade in
          } else if (progress > 0.9) {
            alpha = (1 - progress) * 8; // Fade out
          }
          
          context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
          context.fill();
        }
      });
    }
  });
  
  // Restore context
  context.restore();
}
