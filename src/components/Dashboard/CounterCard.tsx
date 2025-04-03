
import { useEffect, useState, useRef } from 'react';
import { cn } from "@/lib/utils";

interface CounterCardProps {
  title: string;
  value: number;
  subtitle: string;
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const CounterCard = ({ 
  title, 
  value, 
  subtitle, 
  className, 
  children, 
  icon,
  prefix = "",
  suffix = "",
  duration = 1000 
}: CounterCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  
  useEffect(() => {
    // Store previous value for animation
    previousValueRef.current = displayValue;
    
    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Animate to new value
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const newValue = Math.floor(
        previousValueRef.current + (value - previousValueRef.current) * progress
      );
      
      setDisplayValue(newValue);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure final value is exact
        setDisplayValue(value);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <div className={cn("flex flex-col justify-between rounded-xl p-6", className)}>
      <div className="text-xs font-medium uppercase tracking-wider opacity-85">{subtitle}</div>
      <div className="my-3 text-4xl font-bold">
        {prefix}{displayValue.toLocaleString()}{suffix}
      </div>
      <div className="flex items-center gap-2">
        {icon && <span className="opacity-85">{icon}</span>}
        <span className="text-sm font-medium">{title}</span>
      </div>
      {children}
    </div>
  );
};

export default CounterCard;
