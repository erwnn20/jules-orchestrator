import { Status, statusColors } from "@components/helpers/dots/StatusDot";
import { PullRequestState } from "@github/pr/base.model";
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
  const { icon: Icon = DEFAULT_ICON, status = DEFAULT_STATUS } = statusDots[state]
  const color = statusColors[status]

  return <Icon className='h-3 w-3 /*text-accent-orange*/' style={{ color }}/>
}

const DEFAULT_ICON: LucideIcon = GitPullRequest
const DEFAULT_STATUS: Status = 'warning'

const statusDots: Record<PullRequestState, { icon?: LucideIcon, status?: Status }> = {
  approved: { icon: GitPullRequestArrow, status: 'running' },
  changes_requested: { icon: GitMergeConflict, status: 'warning' },
  closed: { icon: GitPullRequestClosed, status: 'done' },
  draft: { icon: GitPullRequestDraft, status: 'done' },
  merge_conflict: { icon: GitMergeConflict, status: 'error' },
  merged: { icon: GitMerge, status: 'done' /* todo purple ? */ },
  open: { icon: GitPullRequestArrow, status: 'running' },
  review_requested: { icon: GitPullRequest, status: 'warning' },
  unspecified: {},
}