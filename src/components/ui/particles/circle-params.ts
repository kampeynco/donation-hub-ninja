import { Circle, CanvasSize } from "./types";

/**
 * Generates parameters for a particle circle based on the variant
 */
export function generateCircleParams(
  canvasSize: CanvasSize, 
  variant: "default" | "journey" | "cable" | "network" = "default",
  size: number = 0.4,
  paths?: { path: Path2D; length: number; points: { x: number; y: number }[] }[]
): Circle {
  // Network visualization specific parameters
  if (variant === "network") {
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
  } else if (variant === "cable" && paths && paths.length > 0) {
    // Select a random path for this particle
    const pathIndex = Math.floor(Math.random() * paths.length);
    const selectedPath = paths[pathIndex];
    
    // Cable visualization specific parameters
    const colors = ["#007AFF", "#4CD964", "#FFCC00"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Set the particle at the start of the path
    const pSize = (Math.random() * 1.5 + 1) * size;
    
    // Initial alpha and target alpha
    const alpha = 0.1;
    const targetAlpha = parseFloat((Math.random() * 0.7 + 0.3).toFixed(1));
    
    // Path progress starts at 0 (beginning of path)
    const pathProgress = 0;
    
    // Random speed for variety
    const pathSpeed = (Math.random() * 0.005 + 0.002);
    
    // The magnetism is irrelevant for cable particles
    const magnetism = 0;
    
    return {
      x: 0, // These x/y values are not used directly, as the particle position comes from the path
      y: 0,
      translateX: 0,
      translateY: 0,
      size: pSize,
      alpha,
      targetAlpha,
      dx: 0, // No direct movement, we'll use path progress
      dy: 0,
      magnetism,
      color,
      path: selectedPath.path,
      pathProgress,
      pathSpeed,
      pathLength: selectedPath.length
    };
  } else if (variant === "journey") {
    // Journey map specific parameters
    const types = ["data", "processed", "insight"];
    const type = types[Math.floor(Math.random() * types.length)];
    const colors = {
      data: "#007AFF", // blue for raw data
      processed: "#4CD964", // green for processed data
      insight: "#FFCC00", // yellow for insights
    };
    
    // Position particles across the canvas with focus on the left side
    const x = Math.floor(Math.random() * canvasSize.w * 0.5); // Start more on the left side
    const y = Math.floor(Math.random() * canvasSize.h);
    const translateX = 0;
    const translateY = 0;
    
    // Adjust size based on particle type and make them more visible
    const pSize = (type === "data" ? 2 : type === "processed" ? 2.5 : 3) * size;
    
    // Begin with zero alpha and gradually increase to target
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.2).toFixed(1)); // Increased opacity
    
    // Data flows faster from left to right with appropriate speeds
    const dx = (Math.random() * 0.8 + 0.3) * (type === "data" ? 1.5 : type === "processed" ? 1 : 0.5);
    const dy = (Math.random() - 0.5) * 0.1; // Slight vertical movement
    
    // Make particles respond to mouse movement
    const magnetism = 0.5 + Math.random() * 2;
    
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      color: colors[type as keyof typeof colors],
      type
    };
  } else {
    // Default parameters
    const x = Math.floor(Math.random() * canvasSize.w);
    const y = Math.floor(Math.random() * canvasSize.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  }
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
