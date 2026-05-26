import CardWide from "@components/helpers/cards/CardWide";
import { ApiError } from "@renderer/utils/ipc-error.utils";
import { twMerge } from "@renderer/utils/tw.utils";
import { TriangleAlert } from "lucide-react";


type Error = ApiError | {
  name: string,
  message: string,
}

export default function ErrorCard({ error, style, className = '' }: {
  error: Error,
  style: 'default' | 'wide',
  className?: string,
}) {
  switch (style) {
    case 'wide':
      return (<ErrorCardWide error={error} className={className}/>)
    case 'default':
    default:
      return (<ErrorCardDefault error={error} className={className}/>)
  }
}

function ErrorCardDefault({ error, className = '' }: {
  error: Error,
  className?: string
}) {
  const title = 'code' in error ? error.code : error.name

  return (<div className={twMerge(
    'flex flex-col gap-2 p-5',
    'bg-panel', 'border border-border-color rounded-lg',
    'transition-colors duration-350',
  )}>
    <p className={'flex items-center gap-1 text-base text-accent-red'}>
      <TriangleAlert className="w-4 h-4 mr-1"/>
      Error {title !== 'Error' && `: ${error.name}`}
    </p>
    <p className={'text-base text-faint text-ellipsis overflow-hidden'}>
      {error.message}
    </p>
  </div>)
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
