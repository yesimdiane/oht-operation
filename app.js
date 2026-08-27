const API_URL = "https://oht-internal-ops-api.yesimdiane.workers.dev";

function qa(sel){ return [...document.querySelectorAll(sel)]; }
const q = (s) => document.querySelector(s);
const qa = (s) => [...document.querySelectorAll(s)];

}

// ======================================================
// submitProject()
// ======================================================
async function api(path, options = {}) {
  const response = await fetch(API_URL + path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

function numberFrom(value) {
  const match = String(value || "").match(/[0-9.]+/);
  return match ? Number(match[0]) : 0;
}

function parseDate(value) {
  const raw = String(value || "")
    .replace(/^Needed by:\s*/i, "")
    .trim();

  if (!raw) return null;

  const date = new Date(`${raw}, 2026`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);

qa("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    qa("[data-tab]").forEach((x) =>
      x.classList.remove("active")
    );

    button.classList.add("active");
  });
});


// ======================================================
// set the goal
// ======================================================

  const taskRows = qa(".action-item");

  const tasks = taskRows
    .map((row) => {
      const inputs = row.querySelectorAll("input");

      if (inputs.length < 3) return null;

      const amountText = inputs[1].value;

      return {
        taskName: inputs[0].value.trim(),
        workAmount: numberFrom(amountText),
        workUnit: amountText
          .replace(/[0-9.]/g, "")
          .trim(),
        dueDate: parseDate(inputs[2].value),
        nextAction: inputs[0].value.trim(),
      };
    })
    .filter(Boolean);

  const payload = {
    projectName: q("#project-name")?.value.trim(),
    department: "KOREA OPS",
    owner: "Diane",

    whyProblem: q("#project-why")?.value.trim(),
    goal: q("#project-goal")?.value.trim(),

    metricName: q("#project-metric")?.value.trim(),
    value: Number(
      q("#project-value")?.value || 0
     ),
      target: q("#project-target")?.value.trim() || "",

    targetDate: "2026-09-01",
  };
  
taskRows
const tasks = [...document.querySelectorAll(".action-item")].map(row => ({
  action: row.querySelector(".action-name")?.value || "",
  goal: row.querySelector(".action-goal")?.value || "",
  dueDate: row.querySelector(".action-date")?.value || ""
}));


  const button = q("#submit-project");

  if (button) {
    button.disabled = true;
    button.textContent = "SUBMITTING...";
  }

  try {
    const result = await api("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    localStorage.setItem(
      "ohtProjectId",
      result.project.id
    );

    localStorage.setItem(
      "ohtProjectName",
      payload.projectName
    );

    alert("Project submitted for CEO approval.");

    location.href = "ceo-approval.html";
  } catch (error) {
    alert(error.message);

    if (button) {
      button.disabled = false;
      button.textContent =
        "SUBMIT FOR APPROVAL →";
    }
  }
}

// EXECUTION PLAN — ADD / REMOVE ACTION
document.addEventListener("click", function (event) {

  const addButton = event.addEventListener{.closest("[data-add-action]");

  if (addButton) {
    event.addEventListener(Date.now(), "click");

    const list = document.querySelector(".action-list");
    const firstRow = list?.querySelector(".action-item");

    if (!list || !firstRow) {
      console.error("action-list/action-item not found");
      return;
    }

    const newRow = firstRow.cloneNode(true);

    newRow.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });

    list.appendChild(newRow);
    return;
  }

  const removeButton = event.target.closest("[data-remove-action]");

  if (removeButton) {
    event.preventDefault();

    const row = removeButton.closest(".action-item");
    const list = removeButton.closest(".action-list");

    if (!row || !list) return;

    const rows = list.querySelectorAll(".action-item");

    if (rows.length > 1) {
      row.remove();
    }
  }
});
// EXECUTION PLAN — ADD / REMOVE ACTION
// ======================================================
// CEO PROJECT REVIEW
// ======================================================

async function reviewProject(decision) {
  const projectId =
    localStorage.getItem("ohtProjectId");

  if (!projectId) {
    alert("No submitted project found.");
    return;
  }


  const priority = prioritySelect
    ? Number(prioritySelect.value) ||
      prioritySelect.selectedIndex + 1
    : 1;

  const payload = {
    decision,
    priority,
    ceo: "Jinsol",
    comment: q("#ceo-comment")?.value || "",
  };

  try {
    await api(
      `/api/projects/${projectId}/review`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (decision === "APPROVE") {
      alert("Project approved.");
      location.href = "project.html";
    } else if (
      decision === "REQUEST_REVISION"
    ) {
      alert("Revision requested.");
      location.href = "index.html";
    } else {
      alert("Project rejected.");
      location.href = "index.html";
    }
  } catch (error) {
    alert(error.message);
  }
}


q("#submit-project")?.addEventListener(
  "click",
  submitProject
);

q("#approve-project")?.addEventListener(
  "click",
  () => reviewProject("APPROVE")
);

q("#request-revision")?.addEventListener(
  "click",
  () => reviewProject("REQUEST_REVISION")
);

q("#reject-project")?.addEventListener(
  "click",
  () => reviewProject("REJECT")
);


// ======================================================
// CEO INPUT DASHBOARD
// ======================================================

async function loadDashboard() {
  if (!q('[data-page="dashboard"]')) return;

  try {
    const result = await api(
      "/api/ceo-inputs"
    );

    const container = q("#ceo-input-cards");

    if (!container) return;

    if (!result.projects.length) {
      container.innerHTML = `
        <div class="card">
          <div class="eyebrow">
            NO CEO INPUT NEEDED
          </div>
          <div class="sub" style="margin-top:10px">
            No blocked decisions right now.
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML =
      result.projects
        .map(
          (item) => `
        <a
          class="card clickable"
          href="review-all.html?project=${encodeURIComponent(
            item.project
          )}"
        >
          <div class="eyebrow">
            ${item.project}
          </div>

          <div
            class="metric"
            style="margin-top:12px"
          >
            ${item.count}
          </div>

          <div class="sub">
            inputs needed
          </div>

          <div
            class="sub"
            style="margin-top:14px"
          >
            REVIEW ALL →
          </div>
        </a>
      `
        )
        .join("");
  } catch (error) {
    console.error(error);
  }
}

loadDashboard();


// ======================================================
// REVIEW ALL NAVIGATION
// ======================================================

function updateReviewCounter() {
  const steps = qa(".review-step");

  const activeIndex = steps.findIndex((step) =>
    step.classList.contains("active")
  );

  const counter = q("#review-counter");

  if (counter) {
    counter.textContent =
      `${activeIndex + 1} / ${steps.length}`;
  }
}

qa("[data-review-next]").forEach(
  (button) => {
    button.addEventListener("click", () => {
      const steps = qa(".review-step");

      const index = steps.findIndex((step) =>
        step.classList.contains("active")
      );

      if (index < steps.length - 1) {
        steps[index].classList.remove(
          "active"
        );

        steps[index + 1].classList.add(
          "active"
        );

        updateReviewCounter();
      }
    });
  }
);

qa("[data-review-prev]").forEach(
  (button) => {
    button.addEventListener("click", () => {
      const steps = qa(".review-step");

      const index = steps.findIndex((step) =>
        step.classList.contains("active")
      );

      if (index > 0) {
        steps[index].classList.remove(
          "active"
        );

        steps[index - 1].classList.add(
          "active"
        );

        updateReviewCounter();
      }
    });
  }
);


// ======================================================
// LOAD REVIEW ALL
// ======================================================

async function loadReviewAll() {
  if (!q('[data-page="review-all"]')) {
    return;
  }

  const params =
    new URLSearchParams(location.search);

  const project =
    params.get("project") ||
    localStorage.getItem("ohtProjectName");

  if (!project) return;

  try {
    const result = await api(
      `/api/review-all?project=${encodeURIComponent(
        project
      )}`
    );

    const section =
      q(".review-step")?.parentElement;

    if (!section) return;

    if (!result.requests.length) {
      section.innerHTML = `
        <div class="notice">
          No unresolved CEO inputs.
        </div>
      `;
      return;
    }

    section.innerHTML =
      result.requests
        .map(
          (request, index) => `
        <div
          class="review-step ${
            index === 0 ? "active" : ""
          }"
          data-input-id="${request.id}"
        >
          <div class="decision-card">

            <div class="decision-head">

              <div>
                <div class="eyebrow muted">
                  ${
                    request.fields.Task ||
                    request.fields.Project ||
                    ""
                  }
                </div>

                <div
                  class="decision-title"
                  style="margin-top:8px"
                >
                  ${
                    request.fields[
                      "Request Title"
                    ] || ""
                  }
                </div>

                <div class="sub">
                  ${
                    request.fields
                      .Description || ""
                  }
                </div>
              </div>

              <span class="status blocked">
                ${
                  request.fields.Type ||
                  "INPUT"
                }
              </span>

            </div>

            <textarea
              class="ceo-response"
              style="margin-top:16px"
              placeholder="CEO response"
            ></textarea>

            <div class="decision-actions">

              <button
                class="btn primary"
                data-answer
              >
                APPROVE / ANSWER
              </button>

              <button
                class="btn"
                data-change
              >
                REQUEST CHANGE
              </button>

            </div>

          </div>
        </div>
      `
        )
        .join("");

    updateReviewCounter();

    bindReviewButtons();
  } catch (error) {
    alert(error.message);
  }
}

function bindReviewButtons() {
  qa("[data-answer]").forEach(
    (button) => {
      button.addEventListener(
        "click",
        async () => {
          const step =
            button.closest(
              ".review-step"
            );

          const id =
            step.dataset.inputId;

          const response =
            step.querySelector(
              ".ceo-response"
            )?.value || "Approved";

          try {
            await api(
              `/api/input-requests/${id}/respond`,
              {
                method: "POST",
                body: JSON.stringify({
                  action: "APPROVE",
                  response,
                }),
              }
            );

            step.querySelector(
              ".status"
            ).textContent = "ANSWERED";

            step.querySelector(
              ".status"
            ).className =
              "status ready";

            button.disabled = true;
          } catch (error) {
            alert(error.message);
          }
        }
      );
    }
  );

  qa("[data-change]").forEach(
    (button) => {
      button.addEventListener(
        "click",
        async () => {
          const step =
            button.closest(
              ".review-step"
            );

          const id =
            step.dataset.inputId;

          const response =
            step.querySelector(
              ".ceo-response"
            )?.value || "";

          try {
            await api(
              `/api/input-requests/${id}/respond`,
              {
                method: "POST",
                body: JSON.stringify({
                  action: "REQUEST_CHANGE",
                  response,
                }),
              }
            );

            step.querySelector(
              ".status"
            ).textContent =
              "REVISION NEEDED";
          } catch (error) {
            alert(error.message);
          }
        }
      );
    }
  );
}

loadReviewAll();


// ======================================================
// SUBMIT ALL CEO DECISIONS
// ======================================================

q("#submit-all-decisions")
  ?.addEventListener(
    "click",
    async () => {
      const params =
        new URLSearchParams(
          location.search
        );

      const project =
        params.get("project") ||
        localStorage.getItem(
          "ohtProjectName"
        );

      if (!project) return;

      try {
        const result = await api(
          "/api/ceo-inputs/submit-all",
          {
            method: "POST",
            body: JSON.stringify({
              project,
            }),
          }
        );

        alert(
          `${result.resolvedCount} input(s) resolved.`
        );

        location.href = "index.html";
      } catch (error) {
        alert(error.message);
      }
    }
  )