
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
  fontSize?: string;
  fontWeight?: string;
  treatAsOneUnit?: boolean; // New prop to treat all words as a single unit
}

function TrueFocus({
  sentence = "True Focus",
  manualMode = false,
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = "",
  fontSize,
  fontWeight,
  treatAsOneUnit = false, // Default to false for backward compatibility
}: TrueFocusProps) {
  const words = sentence.split(" ");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, (animationDuration + pauseBetweenAnimations) * 1000);

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!containerRef.current) return;

    if (treatAsOneUnit) {
      // When treating as one unit, calculate bounding box for all words
      const parentRect = containerRef.current.getBoundingClientRect();
      
      // Initialize with extreme values to find min/max
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      
      // Calculate combined bounding box of all word elements
      wordRefs.current.forEach(wordRef => {
        if (wordRef) {
          const rect = wordRef.getBoundingClientRect();
          minX = Math.min(minX, rect.left);
          minY = Math.min(minY, rect.top);
          maxX = Math.max(maxX, rect.right);
          maxY = Math.max(maxY, rect.bottom);
        }
      });
      
      // Set the focus rectangle to cover all words
      setFocusRect({
        x: minX - parentRect.left,
        y: minY - parentRect.top,
        width: maxX - minX,
        height: maxY - minY,
      });
    } else {
      // Original behavior for individual words
      if (!wordRefs.current[currentIndex]) return;
      const parentRect = containerRef.current.getBoundingClientRect();
      const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

      setFocusRect({
        x: activeRect.left - parentRect.left,
        y: activeRect.top - parentRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });
    }
  }, [currentIndex, words.length, treatAsOneUnit]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex || 0);
    }
  };

  return (
    <div
      className={`relative inline-flex gap-1 items-center ${className}`}
      ref={containerRef}
      onMouseEnter={treatAsOneUnit && manualMode ? () => setCurrentIndex(0) : undefined}
      onMouseLeave={treatAsOneUnit && manualMode ? handleMouseLeave : undefined}
    >
      {words.map((word, index) => {
        const isActive = treatAsOneUnit ? currentIndex !== null : index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            className="relative cursor-pointer"
            style={{
              filter: manualMode
                ? isActive
                  ? `blur(0px)`
                  : `blur(${blurAmount}px)`
                : isActive
                  ? `blur(0px)`
                  : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
              fontSize: fontSize,
              fontWeight: fontWeight,
            }}
            onMouseEnter={!treatAsOneUnit ? () => handleMouseEnter(index) : undefined}
            onMouseLeave={!treatAsOneUnit ? handleMouseLeave : undefined}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="absolute top-0 left-0 pointer-events-none box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
        }}
      >
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] left-[-10px] border-r-0 border-b-0"
          style={{
            borderColor: borderColor,
            filter: `drop-shadow(0 0 4px ${borderColor})`,
          }}
        ></span>
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] right-[-10px] border-l-0 border-b-0"
          style={{
            borderColor: borderColor,
            filter: `drop-shadow(0 0 4px ${borderColor})`,
          }}
        ></span>
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] left-[-10px] border-r-0 border-t-0"
          style={{
            borderColor: borderColor,
            filter: `drop-shadow(0 0 4px ${borderColor})`,
          }}
        ></span>
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] right-[-10px] border-l-0 border-t-0"
          style={{
            borderColor: borderColor,
            filter: `drop-shadow(0 0 4px ${borderColor})`,
          }}
        ></span>
      </motion.div>
    </div>
  );
}

export { TrueFocus };
