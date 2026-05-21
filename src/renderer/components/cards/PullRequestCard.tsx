import CardWide from "@components/helpers/cards/CardWide";
import PullRequestDot from "@components/helpers/dots/PullRequestDot";
import Link from "@components/helpers/Link";
import { PullRequestList } from "@github/pr/list.model";
import { PullRequest } from "@github/pr/pr.model";
import { GitBranch } from "lucide-react";


export function PullRequestCard({ pr, style = 'wide', className = '' }: {
  pr: PullRequest | PullRequestList,
  style?: 'wide',
  className?: string,
}) {
  return (
    <PullRequestCardWide pr={pr} className={className}/>
  )
}

function PullRequestCardWide({ pr, className = '' }: {
  pr: PullRequest | PullRequestList,
  className?: string
}) {
  return (
    <CardWide className={className}>
      <PullRequestDot state={pr.state}/>
      <div className='flex-1'>
          <span className='mb-1 text-subtitle text-primary-foreground font-medium'>
            {pr.title}
          </span>
        <span className='flex items-center gap-1 text-label text-muted'>
          <GitBranch className='h-3 w-3'/>
          {pr.head.ref} · {pr.base.ref /*TODO change by creation/update date*/}
        </span>
      </div>
      <Link to={pr.htmlUrl} text='voir PR'/>
    </CardWide>
  )
}
