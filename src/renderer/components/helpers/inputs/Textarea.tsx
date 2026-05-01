import { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className={className.includes("w-full") ? "w-full" : ""}>
        {label && (
          <label className="block text-base text-primary-foreground font-medium mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={
            'px-3 py-2 ' +
            'bg-elevated text-base text-primary-foreground ' +
            ' border rounded-md ' +
            'placeholder:text-ghost ' +
            'transition-colors duration-150 ' +
            'focus:outline-none ' +
            'disabled:opacity-50 disabled:cursor-default' +
            (error
              ? ' border-accent-red focus:border-accent-red'
              : ' border-border-input focus:border-border-hover') +
            ` ${className}`
          }
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
