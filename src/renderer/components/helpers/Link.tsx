import { ExternalLink, LucideIcon } from "lucide-react";
import { Link as ReactLink } from "react-router";
import { To } from "react-router-dom";

export default function Link({ to, icon: Icon = ExternalLink, text }: {
  to: To,
  icon?: LucideIcon,
  text: string
}) {
  return (
    <ReactLink to={to} target={'_blank'}
          className='flex items-start text-label text-accent-blue hover:underline'>
      {text} <Icon className='w-3 h-3 ms-1'/>
    </ReactLink>
  )
}