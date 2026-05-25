import CardWide from "@components/helpers/cards/CardWide";
import PullRequestDot from "@components/helpers/dots/PullRequestDot";
import Link from "@components/helpers/Link";
import { PullRequestList } from "@github/pr/list.model";
import { PullRequest } from "@github/pr/pr.model";
import { GitBranch, GitMerge } from "lucide-react";


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
        <div className='mb-1 flex items-center gap-1'>
          <span className={'text-subtitle text-primary-foreground font-medium'}>{pr.title}</span>
          <span className="text-ghost">·</span>
          <span className={'text-label text-muted'}>{pr.updatedAt.toLocaleString('fr-FR')}</span>
        </div>
        <div className='flex items-center gap-1 text-meta text-muted'>
          <GitBranch className='h-3 w-3'/> {pr.head.ref}
          <span className="mx-0.5 text-ghost">→</span>
          <GitMerge className='h-3 w-3'/> {pr.base.ref}
        </div>
      </div>
      <Link to={pr.htmlUrl} text='voir PR'/>
    </CardWide>
  )
}
