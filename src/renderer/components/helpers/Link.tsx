import { UtilsServices } from "@renderer/data/utils.services";
import { ExternalLink, LucideIcon } from "lucide-react";

export default function Link({ to, icon: Icon = ExternalLink, text }: {
  to: string,
  icon?: LucideIcon,
  text: string
}) {
  return (
    <p onClick={_ => UtilsServices.OpenLink(to)}
       className='flex items-start text-label text-accent-blue hover:underline'>
      {text} <Icon className='w-3 h-3 ms-1'/>
    </p>
  )
}