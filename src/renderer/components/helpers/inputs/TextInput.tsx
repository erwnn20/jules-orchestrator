import { InputMeasures, InputPropsBase } from "@components/helpers/Input";
import { twMerge } from '@renderer/utils/tw.utils';
import { Eye, EyeClosed, LucideIcon, Search } from "lucide-react";
import {
  forwardRef,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
  useState
} from 'react';


const TEXT_INPUT_TYPES = [
  'text', 'number',
  'url', 'email', 'tel', 'search', 'password', // icon
  'date', 'month', 'week', 'time', 'datetime-local', // end icon ?
] as const;

type TextInputTypeBase = (typeof TEXT_INPUT_TYPES)[number];

export type TextInputType = Extract<HTMLInputTypeAttribute, TextInputTypeBase>

export type TextInputProps =
  InputPropsBase<Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>>
  & { type?: TextInputType }

const paddings = {
  iconStart: 'ps-9',
  iconEnd: 'pe-9',
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ type = 'text', size = 'md', label, error, helperText, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const specials: Partial<Record<TextInputType, {
      iconPosition?: keyof typeof paddings,
      icon?: LucideIcon | ReactNode
    }>> = {
      search: { iconPosition: "iconStart", icon: Search },
      password: {
        iconPosition: "iconEnd",
        icon: (
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              disabled={props.disabled}
              className="sr-only"
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            {showPassword
              ? <Eye className="w-3.5 h-3.5 text-muted"/>
              : <EyeClosed className="w-3.5 h-3.5 text-muted"/>}
          </label>
        )
      },
    };

    const sizes = InputMeasures[size]
    const { iconPosition, icon: Icon } = specials[type] ?? {}
    const padding = twMerge(sizes['paddings'], iconPosition && paddings[iconPosition])

    return (
      <div className={className.includes("w-full") ? "w-full" : ""}>
        {label && (
          <label className="block text-base text-primary-foreground font-medium mb-2">
            {label}
          </label>
        )}
        <div className="relative scheme-light-dark"> {/*todo look*/}
          <input
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            ref={ref}
            className={twMerge(
              'peer',
              'bg-elevated text-primary-foreground placeholder:text-ghost',
              'border border-border-input focus:border-border-hover',
              'focus:outline-none cursor-text',
              'disabled:opacity-50 disabled:cursor-default',
              'transition-colors duration-150',
              error && 'border-accent-red focus:border-accent-red',
              padding, sizes['radius'], sizes['font'],
              className
            )}
            {...props}
          />
          {iconPosition && Icon && (
            <div className={twMerge(
              'absolute inset-y-0', iconPosition === 'iconEnd' ? 'right-3' : 'left-3',
              'flex items-center peer-disabled:opacity-50',
              isLucideIcon(Icon) && 'pointer-events-none'
            )}>
              {isLucideIcon(Icon)
                ? <Icon className="w-3.5 h-3.5 text-muted"/>
                : <>{Icon}</>}
            </div>)}
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

TextInput.displayName = 'TextInput';

export default TextInput;

//

function isLucideIcon(icon: LucideIcon | ReactNode): icon is LucideIcon {
  return typeof icon === 'function' || (typeof icon === 'object' && icon !== null && !('props' in icon))
}

export function isTextInputType(type: string): type is TextInputType {
  return TEXT_INPUT_TYPES.includes(type as TextInputType);
}