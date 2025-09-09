'use client';

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export const VerticalFloatingDock = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  let mouseY = useMotionValue(Infinity);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isScrolled ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onMouseMove={(e) => mouseY.set(e.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "fixed left-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-6 py-8 px-4 rounded-2xl bg-gray-50/80 dark:bg-gray-900/20 backdrop-blur-lg border border-gray-200/30 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-300",
        className,
      )}
    >
      {items.map((item) => (
        <VerticalIconContainer mouseY={mouseY} key={item.title} {...item} />
      ))}
      
      {/* Theme Toggle */}
      <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/20 mt-2">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  );
};

function VerticalIconContainer({
  mouseY,
  title,
  icon,
  href,
}: {
  mouseY: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    const dist = val - bounds.y - bounds.height / 2;
    // Debug: uncomment to see distance values
    // console.log('Mouse Y:', val, 'Bounds Y:', bounds.y, 'Distance:', dist);
    return dist;
  });

  // Increased base size for more prominent navbar
  let widthTransform = useTransform(distance, [-150, 0, 150], [48, 60, 48]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [48, 60, 48]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [22, 28, 22]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [22, 28, 22],
  );

  // Optimized spring configuration for better performance
  let width = useSpring(widthTransform, {
    mass: 0.2,
    stiffness: 100,
    damping: 20,
  });
  let height = useSpring(heightTransform, {
    mass: 0.2,
    stiffness: 100,
    damping: 20,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.2,
    stiffness: 100,
    damping: 20,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.2,
    stiffness: 100,
    damping: 20,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200/90 dark:bg-gray-800/30"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200/80 bg-gray-100/95 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-gray-700/50 dark:bg-gray-800/90 dark:text-white backdrop-blur-sm"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
