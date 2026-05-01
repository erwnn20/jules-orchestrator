import { Checkbox, CheckboxProps } from "@components/helpers/inputs/Checkbox";
import { Radio, RadioProps } from "@components/helpers/inputs/Radio";
import { Select, SelectProps } from "@components/helpers/inputs/Select";
import { Textarea, TextareaProps } from "@components/helpers/inputs/Textarea";
import {
  isTextInputType,
  TextInput,
  TextInputProps,
  TextInputType
} from "@components/helpers/inputs/TextInput";
import { Toggle, ToggleProps } from "@components/helpers/inputs/Toggle";
import { ForwardedRef, forwardRef, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';


type ElementMap = {
  textarea: { element: HTMLTextAreaElement, props: TextareaProps };
  select: { element: HTMLSelectElement, props: SelectProps };
  toggle: { element: HTMLInputElement, props: ToggleProps };
  checkbox: { element: HTMLInputElement, props: CheckboxProps };
  radio: { element: HTMLInputElement, props: RadioProps };
} & { [K in TextInputType]: { element: HTMLInputElement, props: Omit<TextInputProps, 'type'> } }
  & {
  [K in HTMLInputTypeAttribute]: {
    element: HTMLInputElement,
    props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
  }
};

type InferElement<T> = T extends keyof ElementMap ? ElementMap[T]['element'] : HTMLInputElement;
type InferProps<T> = T extends keyof ElementMap ? ElementMap[T]['props'] : never;

type InputProps<T extends keyof ElementMap> = { type: T } & InferProps<T>;

function InputInner<T extends keyof ElementMap>(
  { type, ...props }: InputProps<T>,
  ref: ForwardedRef<InferElement<T>>
) {
  if (isTextInputType(type))
    return <TextInput
      type={type}
      ref={ref as ForwardedRef<InferElement<TextInputType>>}
      {...props as InferProps<TextInputType>}
    />;

  switch (type) {
    case "textarea":
      return <Textarea
        ref={ref as ForwardedRef<InferElement<"textarea">>}
        {...props as InferProps<"textarea">}
      />;

    case "select":
      return <Select
        ref={ref as ForwardedRef<InferElement<"select">>}
        {...props as unknown as InferProps<"select">}
      />;

    case "toggle":
      return <Toggle
        ref={ref as ForwardedRef<InferElement<"toggle">>}
        {...props as InferProps<"toggle">}
      />;

    case "checkbox":
      return <Checkbox
        ref={ref as ForwardedRef<InferElement<"checkbox">>}
        {...props as InferProps<"checkbox">}
      />;

    case "radio":
      return <Radio
        ref={ref as ForwardedRef<InferElement<"radio">>}
        {...props as InferProps<"radio">}
      />;

    default:
      return <input
        type={type}
        ref={ref}
        {...props as InferProps<HTMLInputTypeAttribute>}
      />;
  }
}

export const Input = forwardRef(InputInner)

Input.displayName = 'Input';
