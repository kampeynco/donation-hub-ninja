
import { RefObject, MutableRefObject } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

export interface CanvasSize {
  w: number;
  h: number;
}

export interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
  color?: number[]; // Optional custom color for individual particles
  pulse?: number; // For pulsing effect in cosmic variant
  pulseSpeed?: number; // Speed of pulse
  particleType?: "raw" | "processed" | "insight"; // For journey variant
  journeyStage?: number; // Position in journey (0-2) for journey variant
  targetX?: number; // Target X position for journey variant
  targetY?: number; // Target Y position for journey variant
  transitionSpeed?: number; // Speed of movement towards target for journey variant
  fixed?: boolean; // Whether the particle is fixed in place
}

export interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
  showConnections?: boolean;
  connectionDistance?: number;
  connectionOpacity?: number;
  connectionWidth?: number;
  variant?: "default" | "nebula" | "wave" | "grid" | "cosmic" | "journey";
}

export interface CanvasRefs {
  canvasRef: RefObject<HTMLCanvasElement>;
  canvasContainerRef: RefObject<HTMLDivElement>;
  context: MutableRefObject<CanvasRenderingContext2D | null>;
  circles: MutableRefObject<Circle[]>;
  mouse: MutableRefObject<{ x: number; y: number }>;
  canvasSize: MutableRefObject<CanvasSize>;
}
