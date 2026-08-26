# OHT Internal Ops Dashboard

Fresh prototype for the OHT internal operating system.

Core model:
PROJECT → TASK → DEPENDENCY → DECISION NEEDED → OWNER → STATUS → NEXT ACTION

Pages:
- index.html — CEO decision dashboard
- submit-project.html — team member project proposal
- ceo-approval.html — CEO project approval/revision
- project.html — approved project + task/dependency view
- review-all.html — CEO “at one go” input review
- daily-update.html — team member daily update

Status set:
DRAFT → WAITING FOR APPROVAL → READY → IN PROGRESS → BLOCKED → DONE

Important rule:
OWNER and WAITING ON are separate fields.

This is a static front-end prototype. Airtable/backend wiring comes next.
