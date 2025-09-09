"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef, useCallback } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  enableTouchControls = true,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    date?: string;
    participants?: string[];
    icon?: React.ComponentType<{ className?: string }>;
    buttons?: {
      text: string;
      className: string;
      icon?: React.ComponentType<{ className?: string }>;
      onClick?: () => void;
    }[];
  }[];
  direction?: "left" | "right";
  speed?: "very-fast" | "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  enableTouchControls?: boolean;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const animationRef = useRef<number | null>(null);
  const isManualMode = useRef(false);
  const lastTouchX = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const lastMoveTime = useRef(0);
  const velocity = useRef(0);
  const positionRef = useRef(0);
  const segmentWidthRef = useRef(0);
  const lastRafTimeRef = useRef(0);
  const resumeTimeoutRef = useRef<number | null>(null);

  // Duplicate items 4 times for seamless infinite scroll without gaps
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items];

  const [start, setStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [manualPosition, setManualPosition] = useState(0);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [isManualModeState, setIsManualModeState] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);

  useEffect(() => {
    getDirection();
    getSpeed();
    // Use setTimeout to ensure this runs after hydration
    const timer = setTimeout(() => setStart(true), 0);
    return () => clearTimeout(timer);
  }, []);
  

  // Mouse drag handlers for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableTouchControls) return;
    
    // Prevent text selection during drag
    e.preventDefault();
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    (document.body.style as any).mozUserSelect = 'none';
    (document.body.style as any).msUserSelect = 'none';
    
    isDragging.current = true;
    isManualMode.current = true;
    setIsManualModeState(true);
    setIsPaused(true);
    setIsDraggingState(true);
    lastTouchX.current = e.clientX;
    startX.current = e.clientX;
    
    // Reset velocity for new drag
    velocity.current = 0;
    lastMoveTime.current = 0;
    
    if (scrollerRef.current) {
      // Disable transitions during drag for immediate response
      scrollerRef.current.style.transition = 'none';
      const computedStyle = window.getComputedStyle(scrollerRef.current);
      const matrix = computedStyle.transform;
      if (matrix !== 'none') {
        const values = matrix.split('(')[1].split(')')[0].split(',');
        currentTranslate.current = parseFloat(values[4]) || 0;
        positionRef.current = currentTranslate.current;
      } else {
        currentTranslate.current = positionRef.current;
      }
    }
  }, [enableTouchControls]);
  
  // Measure segment width for seamless wrapping (half of duplicated track)
  useEffect(() => {
    if (!scrollerRef.current) return;
    const update = () => {
      const totalWidth = scrollerRef.current ? scrollerRef.current.scrollWidth : 0;
      segmentWidthRef.current = totalWidth / 2;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [duplicatedItems.length]);

  const getSpeedPxPerSec = useCallback(() => {
    switch (speed) {
      case "very-fast":
        return 240;
      case "fast":
        return 120;
      case "normal":
        return 85;
      case "slow":
      default:
        return 30;
    }
  }, [speed]);

  // JavaScript-driven auto-scroll loop
  useEffect(() => {
    if (!scrollerRef.current) return;
    lastRafTimeRef.current = 0;
    const dir = direction === "left" ? -1 : 1;
    const step = (ts: number) => {
      if (lastRafTimeRef.current === 0) lastRafTimeRef.current = ts;
      const dt = ts - lastRafTimeRef.current;
      lastRafTimeRef.current = ts;
      if (!isManualMode.current && !isPausedByUser) {
        const pxPerMs = getSpeedPxPerSec() / 1000;
        positionRef.current += dir * pxPerMs * dt;
        const seg = segmentWidthRef.current;
        if (seg > 0) {
          if (positionRef.current <= -seg) positionRef.current += seg;
          if (positionRef.current >= 0) positionRef.current -= seg;
        }
        if (scrollerRef.current) {
          scrollerRef.current.style.transform = `translate3d(${positionRef.current}px,0,0)`;
        }
      }
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [direction, getSpeedPxPerSec, isPausedByUser]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enableTouchControls || !isDragging.current) return;
    
    e.preventDefault();
    const currentX = e.clientX;
    const deltaX = currentX - lastTouchX.current;
    const currentTime = Date.now();
    
    // Calculate velocity for momentum
    if (lastMoveTime.current > 0) {
      const timeDelta = currentTime - lastMoveTime.current;
      velocity.current = deltaX / timeDelta;
    }
    
    if (scrollerRef.current) {
      const dampingFactor = 1.2; // Match touch sensitivity
      const adjustedDeltaX = deltaX * dampingFactor;
      const newTranslate = currentTranslate.current + adjustedDeltaX;
      currentTranslate.current = newTranslate;
      positionRef.current = newTranslate;
      scrollerRef.current.style.transition = 'none';
      scrollerRef.current.style.transform = `translate3d(${newTranslate}px,0,0)`;
    }
    
    lastTouchX.current = currentX;
    lastMoveTime.current = currentTime;
  }, [enableTouchControls]);

  const handleMouseUp = useCallback(() => {
    if (!enableTouchControls || !isDragging.current) return;
    
    // Restore text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    (document.body.style as any).mozUserSelect = '';
    (document.body.style as any).msUserSelect = '';
    
    isDragging.current = false;
    setIsDraggingState(false);
    
    // Add momentum scrolling based on velocity
    if (scrollerRef.current && Math.abs(velocity.current) > 0.1) {
      const momentum = velocity.current * 200; // Adjust momentum multiplier
      const finalPosition = currentTranslate.current + momentum;
      currentTranslate.current = finalPosition;
      positionRef.current = finalPosition;
      
      // Smooth momentum animation
      scrollerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      scrollerRef.current.style.transform = `translate3d(${finalPosition}px,0,0)`;
      
      // Reset transition after animation
      setTimeout(() => {
        if (scrollerRef.current) {
          scrollerRef.current.style.transition = 'none';
        }
      }, 500);
    }
    
    // Keep position, pause briefly, then resume JS auto-scroll without snapping
    setIsPausedByUser(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsPausedByUser(false);
      isManualMode.current = false;
      setIsManualModeState(false);
    }, 2000); // Reduced pause time for better UX
  }, [enableTouchControls]);

  // Add mouse event listeners
  useEffect(() => {
    if (enableTouchControls) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [enableTouchControls, handleMouseMove, handleMouseUp]);

  // Add non-passive touch event listeners
  useEffect(() => {
    if (!enableTouchControls || !containerRef.current) return;

    const container = containerRef.current;
    
    const handleTouchStartNonPassive = (e: TouchEvent) => {
      if (!enableTouchControls) return;
      
      // Prevent text selection during drag
      e.preventDefault();
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      (document.body.style as any).mozUserSelect = 'none';
      (document.body.style as any).msUserSelect = 'none';
      
      isDragging.current = true;
      isManualMode.current = true;
      setIsManualModeState(true);
      setIsPaused(true);
      setIsDraggingState(true);
      lastTouchX.current = e.touches[0].clientX;
      startX.current = e.touches[0].clientX;
      
      // Reset velocity for new touch
      velocity.current = 0;
      lastMoveTime.current = 0;
      
      if (scrollerRef.current) {
        // Disable transitions during touch for immediate response
        scrollerRef.current.style.transition = 'none';
        const computedStyle = window.getComputedStyle(scrollerRef.current);
        const matrix = computedStyle.transform;
        if (matrix !== 'none') {
          const values = matrix.split('(')[1].split(')')[0].split(',');
          currentTranslate.current = parseFloat(values[4]) || 0;
        }
        positionRef.current = currentTranslate.current;
      }
    };

    const handleTouchMoveNonPassive = (e: TouchEvent) => {
      if (!enableTouchControls || !isDragging.current) return;
      
      e.preventDefault();
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - lastTouchX.current;
      const currentTime = Date.now();
      
      // Calculate velocity for momentum
      if (lastMoveTime.current > 0) {
        const timeDelta = currentTime - lastMoveTime.current;
        velocity.current = deltaX / timeDelta;
      }
      
      if (scrollerRef.current) {
        // Improved damping factor for better mobile responsiveness
        const dampingFactor = 1.2; // Increased sensitivity for easier swiping
        const adjustedDeltaX = deltaX * dampingFactor;
        const newTranslate = currentTranslate.current + adjustedDeltaX;
        currentTranslate.current = newTranslate;
        positionRef.current = newTranslate;
        
        // Apply smooth transform without transition during drag for immediate response
        scrollerRef.current.style.transition = 'none';
        scrollerRef.current.style.transform = `translate3d(${newTranslate}px,0,0)`;
        scrollerRef.current.style.animationPlayState = 'paused';
        
        // Force a re-render by updating the manual position state
        setManualPosition(newTranslate);
      }
      
      lastTouchX.current = currentX;
      lastMoveTime.current = currentTime;
    };

    const handleTouchEndNonPassive = () => {
      if (!enableTouchControls || !isDragging.current) return;
      
      // Restore text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      (document.body.style as any).mozUserSelect = '';
      (document.body.style as any).msUserSelect = '';
      
      isDragging.current = false;
      setIsDraggingState(false);
      
      // Add momentum scrolling based on velocity
      if (scrollerRef.current && Math.abs(velocity.current) > 0.1) {
        const momentum = velocity.current * 200; // Adjust momentum multiplier
        const finalPosition = currentTranslate.current + momentum;
        currentTranslate.current = finalPosition;
        positionRef.current = finalPosition;
        
        // Smooth momentum animation
        scrollerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        scrollerRef.current.style.transform = `translate3d(${finalPosition}px,0,0)`;
        
        // Reset transition after animation
        setTimeout(() => {
          if (scrollerRef.current) {
            scrollerRef.current.style.transition = 'none';
          }
        }, 500);
      }
      
      // Pause briefly, then resume JS auto-scroll from the current position
      setIsPausedByUser(true);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = window.setTimeout(() => {
        setIsPausedByUser(false);
        isManualMode.current = false;
        setIsManualModeState(false);
      }, 2000); // Reduced pause time for better UX
    };

    // Add non-passive touch event listeners
    container.addEventListener('touchstart', handleTouchStartNonPassive, { passive: false });
    container.addEventListener('touchmove', handleTouchMoveNonPassive, { passive: false });
    container.addEventListener('touchend', handleTouchEndNonPassive, { passive: false });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStartNonPassive);
      container.removeEventListener('touchmove', handleTouchMoveNonPassive);
      container.removeEventListener('touchend', handleTouchEndNonPassive);
    };
  }, [enableTouchControls]);
  
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "very-fast") {
        containerRef.current.style.setProperty("--animation-duration", "8s");
      } else if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "15s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "30s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "60s");
      }
    }
  };
  
  return (
    <div className="relative">
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full max-w-7xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
          enableTouchControls && "cursor-grab",
          enableTouchControls && isDraggingState && "cursor-grabbing",
        className,
      )}
        onMouseDown={handleMouseDown}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max shrink-0 flex-nowrap gap-1 sm:gap-2 py-4"
        )}
      >
        {duplicatedItems.map((item, idx) => (
          <li
            className="relative w-[280px] sm:w-[320px] md:w-[380px] max-w-full shrink-0 group select-none"
            key={`${item.name}-${idx}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gradient-border">
              <div className="gradient-border-content p-3 sm:p-4 md:p-6 lg:p-8 h-[280px] sm:h-[320px] md:h-[400px]">
            <div className="flex flex-col h-full">
              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                {item.icon ? (
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400">🏆</div>
                )}
              </div>
              
              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800 dark:text-white text-center">
                {item.name}
              </h3>
              
              {/* Description */}
              <div className="flex-grow flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  {item.quote}
                </p>
              </div>
              
              {/* Date and Category */}
              <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 sm:mb-3 text-center">
                {item.date} • {item.title}
              </div>
              
              {/* Participants */}
              {item.participants && (
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 text-center">
                  <span className="font-medium">Participants:</span> {item.participants.join(', ')}
                </div>
              )}
              
              {/* Buttons */}
              {item.buttons && (
                <div className="mt-2 sm:mt-3 md:mt-4 flex flex-row gap-3 sm:gap-4 md:gap-5 justify-center">
                  {item.buttons.map((button, btnIdx) => (
                    <button
                      key={btnIdx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Button clicked:', button.text);
                        if (button.onClick) {
                          button.onClick();
                        }
                      }}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-md sm:rounded-lg transition-all duration-300 font-medium text-xs sm:text-sm md:text-sm ${button.className}`}
                    >
                      {button.icon && <button.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
                      <span className="truncate">{button.text}</span>
                    </button>
                  ))}
                </div>
              )}
              </div>
            </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};