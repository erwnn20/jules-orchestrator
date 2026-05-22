import { twMerge } from '@renderer/utils/tw.utils';
import { Property } from "csstype";
import { ReactNode } from "react";


export type BadgeVariant = 'agent' | 'pr' | 'default' | 'error'

export default function Badge({ children, color, variant = 'default' }: {
  children: ReactNode,
  color?: Property.Color
  variant?: BadgeVariant
}) {
  const clr: Property.Color = color ?? ((v: BadgeVariant) => {
    switch (v) {
      case "agent":
        return 'var(--color-accent-green)'
      case "pr":
        return 'var(--color-accent-orange)'
      case "error":
        return 'var(--color-accent-red)'
      case "default":
      default:
        return 'var(--color-accent-gray)'
    }
  })(variant)

  return (
    <span
      className={twMerge(
        'px-1.5 py-0.5',
        'border border-border-hover rounded-sm',
        'text-label text-secondary-foreground whitespace-nowrap'
      )}
      style={{
        color: clr,
        backgroundColor: `color-mix(in srgb, ${clr} 10%, transparent)`,
        borderColor: `color-mix(in srgb, ${clr} 20%, transparent)`
      }}
    >
      {children}
    </span>
  )
}