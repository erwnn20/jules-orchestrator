import { InputMeasures, InputPropsBase } from "@components/helpers/Input";
import { twMerge } from '@renderer/utils/tw.utils';
import { forwardRef, TextareaHTMLAttributes } from 'react';


export type TextareaProps = InputPropsBase<TextareaHTMLAttributes<HTMLTextAreaElement>>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, size = 'md', error, helperText, className = '', ...props }, ref) => {
    const sizes = InputMeasures[size]

    return (
      <div className={className.includes("w-full") ? "w-full" : ""}>
        {label && (
          <label className="block text-base text-primary-foreground font-medium mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            'bg-elevated text-primary-foreground',
            ' border border-border-input focus:border-border-hover',
            'placeholder:text-ghost',
            'transition-colors duration-150',
            'focus:outline-none',
            'disabled:opacity-50 disabled:cursor-default',
            error && 'border-accent-red focus:border-accent-red',
            sizes['paddings'], sizes['radius'], sizes['font'],
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-label text-accent-red">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-label text-faint">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
