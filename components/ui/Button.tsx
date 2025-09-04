import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  animation?: 'scale' | 'slide' | 'bounce' | 'none';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = 'md',
      animation = 'scale',
      children,
      disabled,
      onClick,
      type,
      ...props
    },
    ref
  ) => {
    const baseClasses = clsx(
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'w-full': fullWidth,
        'rounded-sm': rounded === 'sm',
        'rounded-md': rounded === 'md',
        'rounded-lg': rounded === 'lg',
        'rounded-full': rounded === 'full',
      }
    );

    const variantClasses = {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700',
      secondary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl dark:from-blue-400 dark:to-blue-500 dark:hover:from-blue-500 dark:hover:to-blue-600',
      outline: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900',
      ghost: 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 shadow-lg hover:shadow-xl dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700',
      success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-500 shadow-lg hover:shadow-xl dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const animationVariants = {
      scale: {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
      },
      slide: {
        hover: { x: 5 },
        tap: { x: 0 },
      },
      bounce: {
        hover: { y: -2 },
        tap: { y: 0 },
      },
      none: {},
    };

    return (
      <motion.button
        ref={ref}
        className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled || loading}
        onClick={onClick}
        type={type}
        whileHover={animation === 'scale' ? { scale: 1.05 } : undefined}
        whileTap={animation === 'bounce' ? { scale: 0.95 } : undefined}
        initial={animation === 'slide' ? { x: -20, opacity: 0 } : undefined}
        animate={animation === 'slide' ? { x: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.2 }}
      >
        {loading && (
          <div className="inline-flex items-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </div>
        )}
        
        {!loading && (
          <>
            {leftIcon && (
              <span className="inline-flex items-center mr-2">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="inline-flex items-center ml-2">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
