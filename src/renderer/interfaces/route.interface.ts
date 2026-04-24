import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";


export interface Route {
  path: string
  label: string,
  icon?: LucideIcon
  isNav?: boolean
  component: ComponentType
}
