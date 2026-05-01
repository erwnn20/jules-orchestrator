import { Toggle } from "@components/helpers/inputs/Toggle";
import { Check, LucideIcon } from 'lucide-react';
import { forwardRef, InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  variant?: 'default' | 'toggle';
  innerIcon?: LucideIcon
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, variant = 'default',innerIcon, className = '', ...props }, ref) => {
    if (variant === 'toggle') return <Toggle label={label} innerIcon={innerIcon} {...props}/>;

    const Icon = innerIcon ?? Check
    return (
      <label className={'group inline-flex items-center'}>
        <div className={
          'inline-flex items-center gap-2 ' +
          'cursor-pointer group-has-disabled:cursor-default ' +
          'group-has-disabled:opacity-50 ' +
          ` ${className}`
        }>
          <div className="relative ">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              disabled={props.disabled}
              {...props}
            />
            <div className={
              "w-5 h-5 flex items-center justify-center " +
              "bg-elevated peer-checked:bg-primary " +
              "border border-border-input peer-checked:border-primary rounded-md " +
              "transition-all duration-150 "
            }>
              <Icon className={
                "w-3.5 h-3.5 text-void stroke-3 transition-opacity duration-150 " +
                "opacity-0 group-has-checked:opacity-100"
              }/>
            </div>
          </div>
          {label && (
            <span className="text-base text-primary-foreground font-medium select-none">
              {label}
            </span>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
