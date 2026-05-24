import { twMerge } from "@renderer/utils/tw.utils";
import { LucideIcon } from "lucide-react";
import { forwardRef, InputHTMLAttributes } from 'react';


export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  innerIcon?: LucideIcon
}

const RadioToggle = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, innerIcon: Icon, className = '', ...props }, ref) => {
    return (
      <label
        className={twMerge(
          "flex items-center justify-center",
          "transition-all duration-350 group/radio",
        )}>
        <input
          ref={ref}
          type="radio"
          className="sr-only peer"
          disabled={props.disabled}
          {...props}
        />
        <div className={twMerge(
          "flex items-center justify-center",
          "w-4.5 peer-checked:w-5 aspect-square p-0.75 mx-px",
          "bg-ghost peer-checked:bg-primary rounded-full",
          "transition-all duration-350",
        )}>
          {Icon && <Icon className={twMerge(
            "w-full h-full",
            "text-primary-foreground stroke-3 group-has-checked/radio:text-void",
            "transition-opacity duration-150",
          )}/>}
        </div>
      </label>)
  }
);
RadioToggle.displayName = 'RadioToggle';

function RadioToggleGroup({ inputs, name, className = '' }: {
  inputs: Omit<RadioProps, 'name'>[],
  name: string,
  className?: string,
}) {
  return (
    <div className={twMerge(
      "relative flex w-fit h-fit overflow-hidden",
      "bg-elevated /*group-has-checked:bg-border-color*/",
      "border border-border-input group-has-focus:border-primary group-has-active:border-primary rounded-full",
      "transition-all duration-150 group", className
    )}>
      <div className={'flex items-center gap-0.75 p-0.75 min-h-7'}>
        {inputs.map((input, index) => (<RadioToggle {...input} name={name} key={index}/>))}
      </div>
    </div>
  );
}

export default RadioToggleGroup;
