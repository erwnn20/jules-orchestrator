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
  'url', 'email', 'tel', 'search', 'password',// icon
  'date', 'month', 'week', 'time', 'datetime-local' // end icon ?
] as const;

type TextInputTypeBase = (typeof TEXT_INPUT_TYPES)[number];

export type TextInputType = Extract<HTMLInputTypeAttribute, TextInputTypeBase>

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: TextInputType;
  label?: string;
  error?: string;
  helperText?: string;
}

const paddings = {
  noIcon: 'px-3 py-2',
  iconStart: 'ps-9 pe-3 py-2',
  iconEnd: 'ps-3 pe-9 py-2',
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ type = 'text', label, error, helperText, className = '', ...props }, ref) => {
    const [typ, setType] = useState<TextInputType>(type)
    const [isVisible, setVisible] = useState(true)

    const specials: Record<TextInputType, {
      iconPosition: keyof typeof paddings,
      icon?: LucideIcon | ReactNode
    }> = {
      text: { iconPosition: "noIcon" },
      number: { iconPosition: "noIcon" },
      url: { iconPosition: "noIcon" },
      email: { iconPosition: "noIcon" },
      tel: { iconPosition: "noIcon" },
      search: { iconPosition: "iconStart", icon: Search },
      password: {
        iconPosition: "iconEnd",
        icon: (<label>
          <input
            type={"checkbox"}
            checked={isVisible}
            disabled={props.disabled}
            className={"sr-only"}
            onChange={(e) => {
              setVisible(e.target.checked)
              setType(isVisible ? 'text' : 'password')
            }}/>
          {isVisible
            ? <EyeClosed className="w-3.5 h-3.5 text-muted"/>
            : <Eye className="w-3.5 h-3.5 text-muted"/>}
        </label>)
      },
      date: { iconPosition: "noIcon" },
      month: { iconPosition: "noIcon" },
      week: { iconPosition: "noIcon" },
      time: { iconPosition: "noIcon" },
      'datetime-local': { iconPosition: "noIcon" },
    };

    const { iconPosition, icon: Icon } = specials[type] ?? { iconPosition: "noIcon" }
    const padding = paddings[iconPosition]

    return (
      <div className="w-full">
        {label && (
          <label className="block text-base text-primary-foreground font-medium mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={typ}
            ref={ref}
            className={
              `w-full ${Icon ? padding : paddings.noIcon} peer ` +
              'bg-elevated text-base text-primary-foreground placeholder:text-ghost ' +
              'border rounded-md ' +
              'focus:outline-none cursor-text ' +
              'disabled:opacity-50 disabled:cursor-default ' +
              'transition-colors duration-150 ' +
              (error
                ? 'border-accent-red focus:border-accent-red'
                : 'border-border-input focus:border-border-hover') +
              ` ${className}`
            }
            {...props}
          />
          {iconPosition !== 'noIcon' && Icon &&
              <div className={
                `absolute inset-y-0 ${iconPosition === 'iconEnd' ? 'right-3' : 'left-3'} ` +
                `flex items-center ${isLucideIcon(Icon) && 'pointer-events-none'} ` +
                "peer-disabled:opacity-50"
              }>
                {isLucideIcon(Icon)
                  ? <Icon className="w-3.5 h-3.5 text-muted"/>
                  : <>{Icon}</>}
              </div>}
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

//

function isLucideIcon(icon: any): icon is LucideIcon {
  return typeof icon === 'function' || (typeof icon === 'object' && icon !== null && !('props' in icon))
}

export function isTextInputType(type: string): type is TextInputType {
  return TEXT_INPUT_TYPES.includes(type as TextInputType);
}