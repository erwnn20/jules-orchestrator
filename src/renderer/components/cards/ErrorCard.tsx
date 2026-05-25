import CardWide from "@components/helpers/cards/CardWide";
import { TriangleAlert } from "lucide-react";


interface Error {
  name: string,
  message: string,
}

export default function ErrorCard({ error, style = 'wide', className = '' }: {
  error: Error,
  style?: 'wide',
  className?: string,
}) {
  return (
    <ErrorCardWide error={error} className={className}/>
  )
}

function ErrorCardWide({ error, className = '' }: {
  error: Error,
  className?: string
}) {
  return (<CardWide
    className={className}
    start={<TriangleAlert className='h-4 w-4 text-accent-red'/>}
    title={(
      <p className='text-accent-red'>
        Error {error.name !== 'Error' && `: ${error.name}`}
      </p>)}
    subtitle={error.message}
  />)
}
