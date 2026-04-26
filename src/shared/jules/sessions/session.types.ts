import type { ChangeSet, PullRequest } from "@jules/github/github.interfaces";


export type SessionOutput = { pullRequest: PullRequest } | { changeSet: ChangeSet }

export enum SessionState {
  /** State is unspecified */
  STATE_UNSPECIFIED,
  /** Session is waiting to be processed */
  QUEUED,
  /** Jules is creating a plan */
  PLANNING,
  /** Plan is ready for user approval */
  AWAITING_PLAN_APPROVAL,
  /** Jules needs user input */
  AWAITING_USER_FEEDBACK,
  /** Jules is actively working */
  IN_PROGRESS,
  /** Session is paused */
  PAUSED,
  /** Session failed */
  FAILED,
  /** Session completed successfully */
  COMPLETED,
}

export enum AutomationMode {
  /** No automation (default) */
  AUTOMATION_MODE_UNSPECIFIED,
  /** Automatically create a pull request when code changes are ready */
  AUTO_CREATE_PR,
}