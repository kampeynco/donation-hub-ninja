
import { useCallback, useEffect, useRef } from "react";
import { Circle, CanvasSize } from "./types";
import { generateCircleParams } from "./circle-params";
import { hexToRgb, remapValue } from "./utils";
import { useMousePosition } from "./use-mouse-position";

interface UseParticlesAnimationProps {
  quantity: number;
  staticity: number;
  ease: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  variant: "default" | "journey";
  refresh: boolean;
}

export const useParticlesAnimation = ({
  quantity,
  staticity,
  ease,
  size,
  color,
  vx,
  vy,
  variant,
  refresh,
}: UseParticlesAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<CanvasSize>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  
  const onMouseMove = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  }, [mousePosition.x, mousePosition.y]);

  const drawCircle = useCallback((circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      
      if (variant === "journey" && circle.color) {
        const customRgb = hexToRgb(circle.color);
        context.current.fillStyle = `rgba(${customRgb.join(", ")}, ${alpha})`;
      } else {
        const rgb = hexToRgb(color);
        context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      }
      
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  }, [color, dpr, variant]);

  const clearContext = useCallback(() => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  }, [dpr]);

  const drawParticles = useCallback(() => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = generateCircleParams(canvasSize.current, variant, size);
      drawCircle(circle);
    }
  }, [clearContext, drawCircle, quantity, size, variant]);

  const initCanvas = useCallback(() => {
    resizeCanvas();
    drawParticles();
  }, [drawParticles, resizeCanvas]);

  const animate = useCallback(() => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      
      // Update position with different behavior based on variant
      if (variant === "journey") {
        // Journey particles move from left to right
        circle.x += circle.dx;
        circle.y += circle.dy;
        
        // Mouse interaction is gentler in journey mode
        circle.translateX +=
          (mouse.current.x / (staticity / (circle.magnetism * 0.5)) - circle.translateX) /
          ease;
        circle.translateY +=
          (mouse.current.y / (staticity / (circle.magnetism * 0.5)) - circle.translateY) /
          ease;
      } else {
        // Default behavior
        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX +=
          (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
          ease;
        circle.translateY +=
          (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
          ease;
      }

      drawCircle(circle, true);

      // Check if circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // For journey variant, particles that exit right side reappear on the left
        if (variant === "journey" && circle.x > canvasSize.current.w + circle.size) {
          circle.x = -circle.size;
          circle.y = Math.random() * canvasSize.current.h;
        } else {
          // Remove the circle from the array
          circles.current.splice(i, 1);
          // Create a new circle
          const newCircle = generateCircleParams(canvasSize.current, variant, size);
          drawCircle(newCircle);
        }
      }
    });
    window.requestAnimationFrame(animate);
  }, [clearContext, drawCircle, ease, size, staticity, variant, vx, vy]);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [animate, color, initCanvas, variant]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y, onMouseMove]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas, refresh]);

  return {
    canvasRef,
    canvasContainerRef
  };
};
