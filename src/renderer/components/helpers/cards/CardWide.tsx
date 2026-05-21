import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function CardWide({ children, id, className }: {
  children: ReactNode,
  id?: string,
  className?: string
}) {
  return (
    <div id={id} className={twMerge(
      'flex items-center gap-3 px-4 py-3',
      'bg-panel',
      'border border-border-color rounded-lg',
      className
    )}>
      {children}
    </div>
  )
}