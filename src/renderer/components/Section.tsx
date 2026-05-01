import { ReactNode } from "react";


export function Section({ title, children }: { title: string, children: ReactNode }) {
  return (
    <section className='mb-8'>
      <div className='mb-3 text-meta text-faint uppercase tracking-wider'>
        {title}
      </div>

      {children}

    </section>
  )
}