import Checkbox, { CheckboxProps } from "@components/helpers/inputs/Checkbox";
import { forwardRef } from 'react';

export interface ToggleProps extends Omit<CheckboxProps, 'variant'> {}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (props, ref) => <Checkbox variant={'toggle'} {...props} ref={ref}/>
);

Toggle.displayName = 'Toggle';

export default Toggle;
