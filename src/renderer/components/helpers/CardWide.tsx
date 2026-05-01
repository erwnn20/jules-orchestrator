import { ReactNode } from "react";

export function CardWide({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={
      'flex items-center gap-3 px-4 py-3 ' +
      'bg-panel ' +
      'border border-border-color rounded-lg' +
      (className ? ` ${className}` : '')
    }>
      {children}
    </div>
  )
}