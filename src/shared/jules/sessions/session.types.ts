import type { ChangeSet, PullRequest } from "@jules/github/github.interfaces";


export type SessionOutput = { pullRequest: PullRequest } | { changeSet: ChangeSet }

export const SessionState = {
  /** State is unspecified */
  STATE_UNSPECIFIED: 'STATE_UNSPECIFIED',
  /** Session is waiting to be processed */
  QUEUED: 'QUEUED',
  /** Jules is creating a plan */
  PLANNING: 'PLANNING',
  /** Plan is ready for user approval */
  AWAITING_PLAN_APPROVAL: 'AWAITING_PLAN_APPROVAL',
  /** Jules needs user input */
  AWAITING_USER_FEEDBACK: 'AWAITING_USER_FEEDBACK',
  /** Jules is actively working */
  IN_PROGRESS: 'IN_PROGRESS',
  /** Session is paused */
  PAUSED: 'PAUSED',
  /** Session failed */
  FAILED: 'FAILED',
  /** Session completed successfully */
  COMPLETED: 'COMPLETED',
} as const;
export type SessionState = (typeof SessionState)[keyof typeof SessionState];

export const AutomationMode = {
  /** No automation (default) */
  AUTOMATION_MODE_UNSPECIFIED: 'AUTOMATION_MODE_UNSPECIFIED',
  /** Automatically create a pull request when code changes are ready */
  AUTO_CREATE_PR: 'AUTO_CREATE_PR',
} as const;
export type AutomationMode = (typeof AutomationMode)[keyof typeof AutomationMode];
