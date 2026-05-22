import { extendTailwindMerge } from 'tailwind-merge'

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-label', 'text-meta', 'text-base', 'text-subtitle', 'text-title'
      ],
      'bg-color': [
        'bg-void', 'bg-panel', 'bg-elevated',
        'bg-accent-green', 'bg-accent-orange', 'bg-accent-blue', 'bg-accent-red', 'bg-accent-gray',
      ],
      'text-color': [
        'text-primary-foreground', 'text-secondary-foreground',
        'text-muted', 'text-faint', 'text-ghost',
        'text-accent-green', 'text-accent-orange', 'text-accent-blue', 'text-accent-red', 'text-accent-gray',
      ],
      'border-color': [
        'border-border-color', 'border-border-hover', 'border-border-input',
      ],
      'shadow': [
        'shadow-glow-running', 'shadow-glow-error',
      ],
    },
  },
})