import { ComponentType } from "react";


export interface Route {
  path: string
  label: string,
  icon?: string
  isNav?: boolean
  component: ComponentType
}
