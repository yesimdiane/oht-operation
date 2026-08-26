# OHT Operations Prototype

Static HTML prototype for the OHT daily operations workflow.

## Pages
- `index.html` — CEO Main Dashboard
- `department-approval.html` — Department approval queue (Project Request + Asking Approval)
- `submit-project.html` — Team Member project submission
- `ceo-approval.html` — CEO project review / approval
- `approval-request.html` — In-project CEO approval request detail
- `project.html` — Approved project + daily update

## Flow
Team Member submits project → CEO approval queue → CEO reviews/comments/revises/approves → CEO sets priority → approved project becomes active → team member submits daily updates → CEO dashboard shows progress and departments needing CEO action.

## Run in GitHub Codespaces
Open the repository in Codespaces and preview `index.html` with any static-server extension or command, e.g. `python3 -m http.server 8000`.

## Next step
Replace static sample data with Airtable-backed data after the UI flow is approved.
