import { InputMeasures, InputPropsBase } from "@components/helpers/Input";
import { twMerge } from '@renderer/utils/tw.utils';
import { Check, LucideIcon } from 'lucide-react';
import { forwardRef, InputHTMLAttributes } from 'react';


export type CheckboxProps =
  InputPropsBase<Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>>
  & { variant?: 'default' | 'toggle'; innerIcon?: LucideIcon; }

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, size = 'md', variant = 'default', innerIcon, className = '', ...props }, ref) => {
    const sizes = InputMeasures[size]

    return (
      <label className={'group inline-flex items-center'}>
        <div className={twMerge(
          'inline-flex items-center gap-2',
          'cursor-pointer group-has-disabled:cursor-default',
          'group-has-disabled:opacity-50',
          className
        )}>
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              disabled={props.disabled}
              {...props}
            />
            {variant === 'default' && <CheckboxInputComponent innerIcon={innerIcon}/>}
            {variant === 'toggle' && <ToggleInputComponent innerIcon={innerIcon}/>}
          </div>
          {label && (
            <span className={twMerge(
              'text-primary-foreground font-medium select-none',
              sizes['font'], sizes['paddings'], 'px-0'
            )}>
              {label}
            </span>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;

function CheckboxInputComponent({ innerIcon }: Pick<CheckboxProps, 'innerIcon'>) {
  const Icon = innerIcon ?? Check

  return (
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
  )
}

function ToggleInputComponent({ innerIcon: Icon }: Pick<CheckboxProps, 'innerIcon'>) {
  return (<>
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
  </>)
}
