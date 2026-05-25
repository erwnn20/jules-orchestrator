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
  return (<CardWide
    id={id} className={className}
    start={<SessionStatusDot session={session}/>}
    title={title}
    subtitle={subtitle}
    end={end}
  />)
}
