
import { Circle, CanvasSize } from "../types";

/**
 * Generates parameters for a network particle
 */
export function generateNetworkParams(
  canvasSize: CanvasSize,
  size: number = 0.4
): Circle {
  const colors = ["#007AFF", "#4CD964", "#5856D6"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Calculate position - create a grid-like distribution
  // but with some randomness for organic feel
  const gridCellSize = 80; // Size of each grid cell
  const gridRows = Math.ceil(canvasSize.h / gridCellSize);
  const gridCols = Math.ceil(canvasSize.w / gridCellSize);
  
  // Pick a random grid cell
  const gridRow = Math.floor(Math.random() * gridRows);
  const gridCol = Math.floor(Math.random() * gridCols);
  
  // Calculate base position from grid, then add randomness
  const baseX = gridCol * gridCellSize + gridCellSize / 2;
  const baseY = gridRow * gridCellSize + gridCellSize / 2;
  
  // Add some randomness to the position (up to 40% of grid cell size)
  const randomOffset = gridCellSize * 0.4;
  const x = Math.min(canvasSize.w, Math.max(0, baseX + (Math.random() * 2 - 1) * randomOffset));
  const y = Math.min(canvasSize.h, Math.max(0, baseY + (Math.random() * 2 - 1) * randomOffset));
  
  // Node parameters
  const isNode = true; // All particles in network variant are nodes
  const nodeSize = (Math.random() * 1.5 + 2) * size; // Slightly larger nodes
  
  // Initial alpha and target alpha
  const alpha = 0;
  const targetAlpha = parseFloat((Math.random() * 0.6 + 0.4).toFixed(1));
  
  // Subtle random movement
  const dx = (Math.random() - 0.5) * 0.05;
  const dy = (Math.random() - 0.5) * 0.05;
  
  // Response to mouse movement
  const magnetism = Math.random() * 0.5 + 0.1; // Subtle magnetism
  
  // Will be populated with connections later
  const connections: number[] = [];
  
  // Data packets that will travel along connections
  const dataPackets: { progress: number, targetIdx: number }[] = [];
  
  return {
    x,
    y,
    translateX: 0,
    translateY: 0,
    size: nodeSize,
    alpha,
    targetAlpha,
    dx,
    dy,
    magnetism,
    color,
    isNode,
    connections,
    dataPackets
  };
}

/**
 * Creates connections between nodes in the network
 */
export function createNetworkConnections(circles: Circle[]): void {
  // For each node, create connections to nearby nodes
  circles.forEach((circle, i) => {
    if (circle.isNode) {
      // Clear existing connections
      circle.connections = [];
      
      // Find nearby nodes to connect to
      circles.forEach((target, j) => {
        if (i !== j && target.isNode) {
          // Calculate distance between nodes
          const dx = target.x - circle.x;
          const dy = target.y - circle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect to nodes within a certain distance
          // but don't create too many connections
          if (distance < 200 && circle.connections!.length < 3 && Math.random() > 0.3) {
            circle.connections!.push(j);
          }
        }
      });
    }
  });
}

/**
 * Creates data packets that will flow along the connections
 */
export function createDataPackets(circles: Circle[]): void {
  circles.forEach((circle) => {
    if (circle.isNode && circle.connections && circle.connections.length > 0) {
      // Only create new packets occasionally
      if (Math.random() < 0.01) { // 1% chance per frame
        // Get a random connection
        const targetIdx = circle.connections[Math.floor(Math.random() * circle.connections.length)];
        
        // Create a new data packet
        if (!circle.dataPackets) {
          circle.dataPackets = [];
        }
        
        circle.dataPackets.push({
          progress: 0, // Start at the beginning of the connection
          targetIdx // Target node index
        });
      }
    }
  });
}

/**
 * Updates data packets, moving them along their connections
 */
export function updateDataPackets(circles: Circle[]): void {
  circles.forEach((circle) => {
    if (circle.isNode && circle.dataPackets && circle.dataPackets.length > 0) {
      // Update each packet
      for (let i = circle.dataPackets.length - 1; i >= 0; i--) {
        // Move packet along the connection
        circle.dataPackets[i].progress += 0.01; // Speed of movement
        
        // Remove packets that have completed their journey
        if (circle.dataPackets[i].progress >= 1) {
          circle.dataPackets.splice(i, 1);
        }
      }
    }
  });
}
