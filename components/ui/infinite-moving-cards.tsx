"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
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
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  // Duplicate items multiple times for seamless infinite scroll without gaps
  const duplicatedItems = [...items, ...items, ...items, ...items];

  useEffect(() => {
    getDirection();
    getSpeed();
    setStart(true);
  }, []);
  
  const [start, setStart] = useState(false);
  
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
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full max-w-7xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max shrink-0 flex-nowrap gap-1 sm:gap-2 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {duplicatedItems.map((item, idx) => (
          <li
            className="relative w-[280px] sm:w-[320px] md:w-[380px] max-w-full shrink-0 group"
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
  );
};
