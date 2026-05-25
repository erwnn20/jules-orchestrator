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
  return (
    <CardWide className={className}>
      <TriangleAlert className='h-4 w-4 text-accent-red'/>
      <div className="flex-1">
        <p className='text-subtitle text-accent-red font-medium mb-1'>
          Error {error.name !== 'Error' && `: ${error.name}`}
        </p>
        <p className="text-meta text-muted">
          {error.message}
        </p>
      </div>
    </CardWide>
  )
}
