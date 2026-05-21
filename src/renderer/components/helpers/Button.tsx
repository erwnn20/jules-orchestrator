import React, { ReactNode } from 'react';
import { twMerge } from "tailwind-merge";


type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
                                 children,
                                 variant = 'primary',
                                 size = 'md',
                                 disabled = false,
                                 onClick,
                                 className = '',
                               }: ButtonProps) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-primary text-void hover:opacity-90 cursor-pointer ' +
      'disabled:opacity-35 disabled:cursor-default',
    secondary:
      'bg-elevated text-primary-foreground hover:opacity-90 cursor-pointer ' +
      'disabled:opacity-50 disabled:cursor-default',
    outline:
      'border border-border-input text-primary-foreground hover:bg-elevated cursor-pointer ' +
      'disabled:opacity-50 disabled:cursor-default disabled:hover:bg-transparent',
    ghost:
      'text-primary-foreground hover:bg-elevated cursor-pointer ' +
      'disabled:opacity-35 disabled:cursor-default disabled:hover:bg-transparent',
    danger:
      'bg-elevated text-accent-red hover:bg-accent-red/35 cursor-pointer ' +
      'disabled:opacity-50 disabled:hover:bg-elevated disabled:text-muted disabled:cursor-default',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 rounded-md text-meta',
    md: 'px-4 py-2 rounded-lg text-base',
    lg: 'px-4 py-2.5 rounded-lg text-subtitle',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        'inline-flex items-center justify-center font-semibold transition-all duration-150',
        variantClasses[variant], sizeClasses[size],
        className
      )}>
      {children}
    </button>
  );
}
