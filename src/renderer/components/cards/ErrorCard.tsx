import CardWide from "@components/helpers/cards/CardWide";
import { ApiError } from "@renderer/utils/ipc-error.utils";
import { TriangleAlert } from "lucide-react";


type Error = ApiError | {
  name: string,
  message: string,
}

  style?: 'wide',
export default function ErrorCard({ error, style, className = '' }: {
  error: Error,
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
  const title = 'code' in error ? error.code : error.name

  return (<CardWide
    className={className}
    start={<TriangleAlert className='h-4 w-4 text-accent-red'/>}
    title={(
      <p className='text-accent-red'>
        Error {title !== 'Error' && `: ${error.name}`}
      </p>)}
    subtitle={error.message}
  />)
}
