# OHT Daily Operations Dashboard — Vercel Deployment Guide

**Purpose:** Deploy the CEO Dashboard UI/UX to a shareable live URL for feedback before backend integration.

---

## 📋 What's Being Deployed

| File | Purpose |
|---|---|
| `oht_dashboard_v4.html` | Main CEO Dashboard (Marketing/Shipping/Inventory/Content tabs) |
| `oht_ceo_approval_queue.html` | Team-based Approval Queue |
| `oht_ceo_project_approval.html` | Project Approval Decision Page |
| `oht_approval_request_detail.html` | Approval Request Detail Page |

**Note:** Backend is not connected yet. This is a **UI/UX prototype**. Buttons navigate between pages but don't save data to Airtable.

---

## 🚀 Quick Start: Deploy in 2 Minutes

### Option 1: Vercel Web UI (Easiest)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub / Google / email
3. **Click "Add New..."** → **"Project"**
4. **Select "Other"** (not a Git repository)
5. **Upload this folder** as a `.zip` file or drag-and-drop:
   ```
   oht_dashboard_v4.html
   oht_ceo_approval_queue.html
   oht_ceo_project_approval.html
   oht_approval_request_detail.html
   ```
6. **Click "Deploy"**
7. **Get your live URL** (e.g., `https://oht-dashboard.vercel.app`)

✅ **Done!** Share this URL with Jinsol.

---

### Option 2: Vercel CLI (If You Have Node.js)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Navigate to project folder
cd /path/to/oht-dashboard-files

# 3. Deploy
vercel

# Follow the prompts, then copy your live URL
```

---

### Option 3: GitHub + Vercel (Recommended for team)

If you want version control:

1. **Create a private GitHub repo** (e.g., `oht-operations-dashboard`)
2. **Push these HTML files** to the repo
3. **Go to Vercel** → **"Import Project"** → **Select your GitHub repo**
4. **Deploy**

**Advantage:** Track changes, multiple team members can contribute, Vercel auto-updates on push.

---

## 🔗 Page Navigation Guide

**Start here:** `oht_dashboard_v4.html`

```
DASHBOARD (v4)
  ├─ Click team card (Marketing/Shipping/etc.)
  │  └─ APPROVAL QUEUE (v4)
  │     ├─ Click PROJECT REQUEST row
  │     │  └─ PROJECT APPROVAL PAGE (v4)
  │     │     └─ Approve / Revise / Reject (no save yet)
  │     │
  │     └─ Click ASKING APPROVAL row
  │        └─ APPROVAL REQUEST DETAIL (v4)
  │           └─ Approve / Decline (no save yet)
  │
  └─ Tabs: Marketing / Shipping / Inventory / Content
     └─ View team-specific projects & status
```

---

## ⚠️ Known Limitations (UI/UX Only)

❌ **No Backend**
- Clicking "SUBMIT DECISION" won't save to Airtable
- Page refresh resets all form data
- No real-time data from Airtable

✅ **What Works**
- Full page navigation & tab switching
- Responsive design (mobile/tablet/desktop)
- Visual hierarchy & approval workflow clarity
- Example data for demo purposes

---

## 📝 Next Steps (After CEO Feedback)

1. **Get Jinsol's feedback** on UI/UX
   - Does the approval workflow make sense?
   - Are priority levels clear?
   - Any design tweaks needed?

2. **Once approved**, integrate backend:
   - Connect to Airtable API
   - Add project submission form
   - Implement real-time status updates
   - Add authentication for team

3. **Production deploy**:
   - Move to private GitHub repo with team access
   - Set up CI/CD pipeline
   - Add environment variables (Airtable API key, etc.)

---

## 📧 Sharing with Jinsol

**Subject:** "OHT Dashboard — Check out the new approval workflow!"

**Message:**
```
Hi Jinsol,

Check out the new CEO approval dashboard here:
[PASTE YOUR VERCEL URL]

This is the UI/UX prototype. Data isn't connected to Airtable yet, but you can:
- See the new team-based approval workflow
- Test page navigation
- Give feedback on design/flow

Let me know what changes you'd like before we add the backend!

— Diane
```

---

## 🛠️ Troubleshooting

**Q: Pages don't navigate?**  
A: Make sure all 4 HTML files are in the same folder in Vercel.

**Q: "File not found" error?**  
A: Check that file paths in HTML match exactly (case-sensitive on Vercel).
- Currently: `oht_dashboard_v4.html` (starts with `/oht_...`)
- Change relative links in HTML if needed

**Q: How do I update after deployment?**  
A: If using Vercel Web UI → re-upload the folder. If using GitHub → push changes and Vercel auto-redeploys.

---

## 📞 Support

Need help? Check Vercel docs: https://vercel.com/docs
