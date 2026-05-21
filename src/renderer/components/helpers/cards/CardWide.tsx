import { ReactNode } from "react";

export default function CardWide({ children, id, className }: {
  children: ReactNode,
  id?: string,
  className?: string
}) {
  return (
    <div id={id} className={
      'flex items-center gap-3 px-4 py-3 ' +
      'bg-panel ' +
      'border border-border-color rounded-lg' +
      (className ? ` ${className}` : '')
    }>
      {children}
    </div>
  )
}