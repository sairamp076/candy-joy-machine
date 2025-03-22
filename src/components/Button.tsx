
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { playSound } from '@/utils/candyUtils';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
}

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  className,
  disabled = false
}: ButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  // Size classes
  const sizeClasses = {
    small: 'text-sm px-3 py-1',
    medium: 'text-base px-5 py-2',
    large: 'text-lg px-6 py-3'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-candy-machine-accent to-red-400 text-white',
    secondary: 'bg-metal-gradient text-gray-700'
  };

  const handleClick = () => {
    if (disabled) return;
    
    setIsPressed(true);
    playSound('button');
    
    // Trigger click and reset pressed state after animation
    setTimeout(() => {
      onClick();
      setIsPressed(false);
    }, 200);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'machine-button relative rounded-lg font-semibold shadow-md transition-all duration-300',
        'transform hover:scale-[1.02] active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400',
        sizeClasses[size],
        variantClasses[variant],
        isPressed && 'pressed',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
