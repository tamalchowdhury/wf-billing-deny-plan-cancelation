import {
  onPlanCancellationRequestEvent,
  WorkflowSettings,
  WorkflowTrigger,
  denyPlanCancellation,
} from "@kinde/infrastructure"

// The setting for this workflow
export const workflowSettings: WorkflowSettings = {
  id: "onUserPlanCancellationRequest",
  trigger: WorkflowTrigger.UserPlanCancellationRequest,
  name: "Deny Plan Cancelation",
  failurePolicy: {
    action: "stop",
  },
  bindings: {
    "kinde.plan": {},
  },
}

// This workflow demonstrates denying a plan cancellation

// The workflow code to be executed when the event is triggered
export default async function Workflow(event: onPlanCancellationRequestEvent) {
  const { plans } = event.context.billing
  const subscription = plans?.[0]
  console.log("Logging for debugging", plans)

  if (subscription?.subscribed_on) {
    const start = new Date(subscription.subscribed_on)
    const minEnd = new Date(start)
    minEnd.setMonth(minEnd.getMonth() + 3)

    if (new Date() < minEnd) {
      denyPlanCancellation(
        `You’re on a 3-month commitment. You can cancel after ${minEnd.toDateString()}.`
      )
    }
  }
}
