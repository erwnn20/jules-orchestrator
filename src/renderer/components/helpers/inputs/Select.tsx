import { InputMeasures, InputPropsBase } from "@components/helpers/Input";
import { twMerge } from '@renderer/utils/tw.utils';
import { ChevronDown } from 'lucide-react';
import { forwardRef, SelectHTMLAttributes } from 'react';


export type SelectProps = InputPropsBase<Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>> & {
  placeholder?: string | Omit<Option, 'value'>
  options: Option[];
}

export type Option = { value: string; label: string }

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
     label,
     size = 'md',
     error,
     helperText,
     placeholder,
     options,
     className = '',
     ...props
   }, ref) => {
    const sizes = InputMeasures[size]

    return (
      <div className={className.includes("w-full") ? "w-full" : ""}>
        {label && (
          <label className="block text-base text-primary-foreground font-medium mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={twMerge(
              'peer',
              'bg-elevated text-primary-foreground',
              'border border-border-input focus:border-border-hover',
              'transition-colors duration-150',
              'focus:outline-none appearance-none cursor-pointer',
              'disabled:opacity-50 disabled:cursor-default',
              error && 'border-accent-red focus:border-accent-red',
              sizes['paddings'], 'pr-9', sizes['radius'], sizes['font'],
              className
            )}
            {...props}
          >
            {placeholder && (
              <option key={'placeholder'} value={''} className={'text-ghost'}>
                {typeof placeholder === 'string' ? placeholder : placeholder.label}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div
            className={
              "absolute inset-y-0 right-3 " +
              "flex items-center pointer-events-none " +
              "peer-disabled:opacity-50"
            }>
            <ChevronDown className="w-4 h-4 text-muted"/>
          </div>
        </div>
        {error && (
          <p className="text-label text-accent-red mt-1.5">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-label text-faint mt-1.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
