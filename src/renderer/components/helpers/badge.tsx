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
    <span style={{
      fontSize: 10, fontFamily: 'monospace', padding: '2px 6px',
      borderRadius: 3, color: '#9ca3af', whiteSpace: 'nowrap',
    }}>
        color: clr,
        backgroundColor: `color-mix(in srgb, ${clr} 10%, transparent)`,
        borderColor: `color-mix(in srgb, ${clr} 20%, transparent)`
      {children}
    </span>
  )
}