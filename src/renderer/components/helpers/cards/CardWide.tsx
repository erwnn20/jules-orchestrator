import { twMerge } from '@renderer/utils/tw.utils';
import { ReactNode } from "react";

export default function CardWide({ id, className = '', ...args }: {
  id?: string, className?: string
} & ({ children: ReactNode }
  | { title: ReactNode, subtitle?: ReactNode, start?: ReactNode, end?: ReactNode })) {
  return (
    <div id={id} className={twMerge(
      'flex items-center gap-3 px-4 py-3',
      'bg-panel',
      'border border-border-color rounded-lg',
      'transition-colors duration-350',
      className
    )}>
      {'children' in args ? args.children : (<>
        {args.start && args.start}
        <div className="flex-1">
          <div className="mb-1 text-subtitle text-primary-foreground font-medium">
            {args.title}
          </div>
          {args.subtitle && (
            <div className="text-meta text-muted text-ellipsis">
              {args.subtitle}
            </div>)}
        </div>
        {args.end && (
          <div className='text-label text-faint'>
            {args.end}
          </div>)}
      </>)}
    </div>
  )
}