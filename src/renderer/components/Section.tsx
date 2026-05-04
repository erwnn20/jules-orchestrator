import { ReactNode } from "react";


export default function Section({ title, addon, children }: {
  title: string,
  addon?: ReactNode,
  children: ReactNode
}) {
  return (
    <section className='mb-8'>
      <div className='mb-3 flex items-baseline justify-between'>
        <div className='text-meta text-faint uppercase tracking-wider'>
          {title}
        </div>
        {addon}
      </div>

      {children}

    </section>
  )
}