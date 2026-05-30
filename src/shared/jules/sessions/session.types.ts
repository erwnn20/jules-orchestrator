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

export const SessionTag = {
  /** Jules is actively processing */
  ACTIVE: 'active',
  /** Session is alive but not processing — no specific user action needed */
  IDLE: 'idle',
  /** Session is alive but blocked on user action */
  WAITING: 'waiting',
  /** Session completed successfully */
  SUCCESS: 'success',
  /** Session failed */
  ERROR: 'error',
  /** State is unspecified */
  NONE: 'none',
} as const;
export type SessionTag = (typeof SessionTag)[keyof typeof SessionTag]

export const SESSION_TAG_GROUPS = {
  /** Session is still alive — not yet terminal */
  running: ['active', 'idle', 'waiting'],
  /** Session is definitively done — no further progress possible */
  terminal: ['success', 'error'],
  /** User should act — waiting on approval/feedback or session failed */
  needs_attention: ['waiting', 'error'],
  /** No problems — session is progressing or completed successfully */
  healthy: ['active', 'idle', 'success'],
} satisfies Record<string, SessionTag[]>;
export type SessionTagGroup = keyof typeof SESSION_TAG_GROUPS;

export const SESSION_STATE_TAGS: Record<SessionState, SessionTag> = {
  STATE_UNSPECIFIED: 'none',
  QUEUED: 'idle',
  PLANNING: 'active',
  IN_PROGRESS: 'active',
  AWAITING_PLAN_APPROVAL: 'waiting',
  AWAITING_USER_FEEDBACK: 'waiting',
  PAUSED: 'idle',
  FAILED: 'error',
  COMPLETED: 'success',
} as const;

type PossibleTags = SessionTag | SessionTagGroup

export function sessionHasTag(state: SessionState, tags: PossibleTags | PossibleTags[]): boolean {
  const tagsArray = Array.isArray(tags) ? tags : [tags]

  const resolved: SessionTag[] = tagsArray.map(tag =>
    tag in SESSION_TAG_GROUPS ? SESSION_TAG_GROUPS[tag as SessionTagGroup] : [tag as SessionTag]
  ).flat()
  return resolved.includes(SESSION_STATE_TAGS[state])
}

//

export const AutomationMode = {
  /** No automation (default) */
  AUTOMATION_MODE_UNSPECIFIED: 'AUTOMATION_MODE_UNSPECIFIED',
  /** Automatically create a pull request when code changes are ready */
  AUTO_CREATE_PR: 'AUTO_CREATE_PR',
} as const;
export type AutomationMode = (typeof AutomationMode)[keyof typeof AutomationMode];
