import CardWide from "@components/helpers/cards/CardWide";
import SessionStatusDot from "@components/helpers/dots/SessionStatusDot";
import { Session } from "@jules/sessions/session.model";
import { ReactNode } from "react";


export default function SessionCard({ session, id, className = '', contents: { title, subtitle, end } }: {
  session: Session,
  contents: {
    title: ReactNode,
    subtitle?: ReactNode,
    end?: ReactNode
  },
  id?: string,
  className?: string
}) {
  return (
    <CardWide id={id} className={className}>
      <SessionStatusDot session={session}/>
      <div className="flex-1">
        <div className="mb-1 text-subtitle text-primary-foreground">
          {title}
        </div>
        {subtitle && (
          <div className="text-meta text-muted text-ellipsis">
            {subtitle}
          </div>)}
      </div>
      {end && (
        <div className='text-label text-faint'>
          {end}
        </div>)}
    </CardWide>
  )
}
