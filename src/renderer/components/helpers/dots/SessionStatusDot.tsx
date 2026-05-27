import StatusDot, { DotStatus } from "@components/helpers/dots/StatusDot";
import { Session } from "@jules/sessions/session.model";
import { SESSION_STATE_TAGS, SessionTag } from "@jules/sessions/session.types";


export default function SessionStatusDot({ session }: { session: Session }) {
  return <StatusDot {...sessionStateStatus[SESSION_STATE_TAGS[session.state]]}/>  /* todo use new sessions tags */
}

const sessionStateStatus: Record<SessionTag, DotStatus> = {
  success: { status: "done" },
  active: { status: "running", pulse: true },
  waiting: { status: "warning", pulse: true },
  error: { status: "error" },
  idle: { status: "running" },
  none: { status: "none" },
};
