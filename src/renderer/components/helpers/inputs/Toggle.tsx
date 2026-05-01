import { CheckboxProps } from "@components/helpers/inputs/Checkbox";
import { forwardRef } from 'react';

export interface ToggleProps extends Omit<CheckboxProps, 'variant'> {}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, innerIcon: Icon, className = '', ...props }, ref) => {
    return (
      <label className={'group inline-flex items-center'}>
        <div
          className={
            'inline-flex items-center gap-3 ' +
            'cursor-pointer group-has-disabled:cursor-default ' +
            'group-has-disabled:opacity-50' +
            ` ${className}`
          }>
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              disabled={props.disabled}
              {...props}
            />
            <div className={
              "w-10 h-6 rounded-full overflow-hidden " +
              "bg-elevated peer-checked:bg-border-color " +
              "border border-border-input peer-checked:border-primary " +
              "transition-all duration-150"
            }>
              <div className={"w-full h-full group-has-checked:bg-primary/20"}/>
            </div>
            <div
              className={
                "absolute inset-y-0 aspect-square " +
                "flex items-center justify-center p-0.75 " +
                "peer-checked:translate-x-4 " +
                "transition-all duration-150"
              }>
              <div className={
                "w-full h-full flex items-center justify-center p-0.75 " +
                "bg-ghost rounded-full group-has-checked:bg-primary"
              }>
                {Icon && <Icon className={
                  "w-full h-full " +
                  "text-primary-foreground stroke-3 group-has-checked:text-void " +
                  "transition-opacity duration-150"
                }/>}
              </div>
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

Toggle.displayName = 'Toggle';
