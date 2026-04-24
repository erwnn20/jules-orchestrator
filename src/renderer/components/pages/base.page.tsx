import { ReactNode } from "react";


export default function BasePage({ children, title, subtitle }: {
  children: ReactNode,
  title: string,
  subtitle?: ReactNode | string
}) {
  return (
    <div className='px-10 py-8'>
      <h1 className='text-title text-primary-foreground mb-1 font-semibold'>
        {title}
      </h1>
      {
        subtitle && typeof subtitle === 'string' ?
          <p className='text-subtitle text-faint mb-8'>{subtitle}</p>
          : subtitle
      }
      
      {children}

    </div>
  )
}