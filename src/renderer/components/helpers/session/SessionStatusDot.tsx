import StatusDot, { DotStatus } from "@components/helpers/StatusDot";
import { Session } from "@jules/sessions/session.model";


export default function SessionStatusDot({ session }: { session: Session }) {
  return <StatusDot {...sessionStateStatus[session.state]}/>
}

const sessionStateStatus: Record<Session["state"], DotStatus> = {
  AWAITING_PLAN_APPROVAL: { status: "warning", pulse: true },
  AWAITING_USER_FEEDBACK: { status: "warning", pulse: true },
  COMPLETED: { status: "done" },
  FAILED: { status: "error" },
  IN_PROGRESS: { status: "running", pulse: true },
  PAUSED: { status: "warning" },
  PLANNING: { status: "running", pulse: true },
  QUEUED: { status: "running" },
  STATE_UNSPECIFIED: { status: "done" }
};