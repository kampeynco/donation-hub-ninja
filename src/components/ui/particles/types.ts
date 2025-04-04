
import { RefObject } from "react";

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
}

export interface CanvasRefs {
  canvasRef: RefObject<HTMLCanvasElement>;
  canvasContainerRef: RefObject<HTMLDivElement>;
  context: RefObject<CanvasRenderingContext2D | null>;
  circles: RefObject<Circle[]>;
  mouse: RefObject<{ x: number; y: number }>;
  canvasSize: RefObject<CanvasSize>;
}
