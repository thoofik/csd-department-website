import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'variant' | 'hover' | 'padding' | 'rounded' | 'shadow'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  hover?: 'none' | 'lift' | 'scale' | 'glow' | 'border';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hover = 'none',
      padding = 'md',
      rounded = 'lg',
      shadow = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = clsx(
      'relative overflow-hidden transition-all duration-300',
      {
        // Padding variants
        'p-0': padding === 'none',
        'p-2': padding === 'sm',
        'p-4': padding === 'md',
        'p-6': padding === 'lg',
        'p-8': padding === 'xl',
        
        // Rounded variants
        'rounded-none': rounded === 'none',
        'rounded-sm': rounded === 'sm',
        'rounded-md': rounded === 'md',
        'rounded-lg': rounded === 'lg',
        'rounded-xl': rounded === 'xl',
        'rounded-full': rounded === 'full',
        
        // Shadow variants
        'shadow-none': shadow === 'none',
        'shadow-sm': shadow === 'sm',
        'shadow-md': shadow === 'md',
        'shadow-lg': shadow === 'lg',
        'shadow-xl': shadow === 'xl',
        'shadow-2xl': shadow === '2xl',
      }
    );

    const variantClasses = {
      default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      elevated: 'bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/20',
      outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
      filled: 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600',
    };

    const hoverVariants = {
      none: {},
      lift: {
        hover: { y: -8, scale: 1.02 },
        transition: { duration: 0.3, ease: 'easeOut' },
      },
      scale: {
        hover: { scale: 1.05 },
        transition: { duration: 0.2, ease: 'easeOut' },
      },
      glow: {
        hover: { 
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
          scale: 1.02 
        },
        transition: { duration: 0.3, ease: 'easeOut' },
      },
      border: {
        hover: { 
          borderColor: '#3b82f6',
          scale: 1.02 
        },
        transition: { duration: 0.3, ease: 'easeOut' },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={clsx(baseClasses, variantClasses[variant], className)}
        whileHover={hover !== 'none' ? hoverVariants[hover].hover : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
