import {
  onPlanCancellationRequest,
  WorkflowSettings,
  WorkflowTrigger,
  denyPlanCancellation,
  getEnvironmentVariable,
} from "@kinde/infrastructure"

// The setting for this workflow
export const workflowSettings: WorkflowSettings = {
  id: "onUserPlanCancellationRequest",
  trigger: WorkflowTrigger.PlanCancellationRequest,
  name: "Deny Plan Cancelation",
  failurePolicy: {
    action: "stop",
  },
  bindings: {
    "kinde.plan": {},
    "kinde.env": {},
    url: {},
  },
}

// This workflow demonstrates denying a plan cancellation

// The workflow code to be executed when the event is triggered
export default async function Workflow(event: onPlanCancellationRequest) {
  const { currentPlanCode } = event.context.billing
  // Configurable list of enterprise-like SKUs (comma-separated), default to "enterprise"
  const ENTERPRISE_CODES = (
    getEnvironmentVariable("ENTERPRISE_PLAN_CODES").value || "enterprise"
  )
    .split(",")
    .map((s) => s.trim().toLowerCase())

  const isEnterprise =
    !!currentPlanCode &&
    ENTERPRISE_CODES.includes(String(currentPlanCode).toLowerCase())

  // logs
  console.log(
    "enterprise codes",
    ENTERPRISE_CODES,
    "isEnterprise",
    isEnterprise
  )

  if (isEnterprise) {
    denyPlanCancellation(
      "Your subscription is managed by our team. To make changes, please contact support."
    )
  }
}
