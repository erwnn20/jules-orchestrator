import { Status, statusColors } from "@components/helpers/dots/StatusDot";
import { PullRequestState } from "@github/pr/base.model";
import { Property } from "csstype";
import {
  GitMerge,
  GitMergeConflict,
  GitPullRequest,
  GitPullRequestArrow,
  GitPullRequestClosed,
  GitPullRequestDraft,
  LucideIcon
} from "lucide-react";


export default function PullRequestDot({ state }: { state: PullRequestState }) {
  const entry = statusDots[state]

  const Icon = entry.icon ?? DEFAULT_ICON
  const directColor = 'color' in entry ? entry.color : undefined
  const status = 'status' in entry ? entry.status : undefined

  const color = directColor ?? statusColors[status ?? DEFAULT_STATUS]

  return <Icon className='h-3 w-3' style={{ color }}/>
}

const DEFAULT_ICON: LucideIcon = GitPullRequest
const DEFAULT_STATUS: Status = 'warning'

const statusDots: Record<PullRequestState, { icon?: LucideIcon } & (
  { status?: Status } | { color?: Property.Color }
  )> = {
  approved: { icon: GitPullRequestArrow, status: 'running' },
  changes_requested: { icon: GitMergeConflict, status: 'warning' },
  closed: { icon: GitPullRequestClosed, status: 'done' },
  draft: { icon: GitPullRequestDraft, status: 'warning' },
  merge_conflict: { icon: GitMergeConflict, status: 'error' },
  merged: {
    icon: GitMerge,
    color: 'var(--color-purple-github)'
  },
  open: { icon: GitPullRequestArrow, status: 'running' },
  review_requested: { icon: GitPullRequest, status: 'warning' },
  unspecified: {},
}