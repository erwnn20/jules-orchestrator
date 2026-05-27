import { InputMeasures, InputPropsBase } from "@components/helpers/Input";
import { twMerge } from '@renderer/utils/tw.utils';
import { forwardRef, InputHTMLAttributes } from 'react';


export type RadioProps = InputPropsBase<Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>>

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, size = 'md', className = '', ...props }, ref) => {
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
              type="radio"
              className="sr-only peer"
              disabled={props.disabled}
              {...props}
            />
            <div className={
              "flex items-center justify-center p-0.5 " +
              "w-5 h-5 rounded-full " +
              "bg-elevated peer-checked:bg-border-color " +
              "border border-border-input peer-checked:border-primary " +
              "transition-all duration-150 "
            }>
              <div className={
                "w-full h-full rounded-full " +
                "bg-primary " +
                "opacity-0 group-has-checked:opacity-100 " +
                "transition-opacity duration-150"
              }/>
            </div>
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

Radio.displayName = 'Radio';

export default Radio;
