const API_URL = "https://oht-internal-ops-api.yesimdiane.workers.dev";

function qa(sel){ return [...document.querySelectorAll(sel)]; }
const q = (s) => document.querySelector(s);
const qa = (s) => [...document.querySelectorAll(s)];

// ======================================================
// DAILY REPORT
// ======================================================

let dailyProjectTasks = [];

async function initDailyReport() {
  const submitButton = q("#submit-daily-report");

  // daily-update.html이 아니면 실행하지 않음
  if (!submitButton) return;

  const projectSelect = q("#daily-project");

  try {
    // --------------------------------------------------
    // LOAD PROJECTS
    // --------------------------------------------------
    const projectData = await api("/api/projects");

    const activeProjects = (projectData.records || []).filter((record) => {
      const status = record.fields?.Status || "";

      return [
        "APPROVED",
        "IN PROGRESS",
        "BLOCKED",
        "READY"
      ].includes(status);
    });

    projectSelect.innerHTML =
      `<option value="">Select project</option>` +
      activeProjects
        .map((record) => {
          const name = record.fields["Project Name"] || "";

          return `
            <option value="${escapeHtml(name)}">
              ${escapeHtml(name)}
            </option>
          `;
        })
        .join("");

  } catch (error) {
    console.error("Could not load projects:", error);

    projectSelect.innerHTML =
      `<option value="">Could not load projects</option>`;
  }


  // --------------------------------------------------
  // PROJECT CHANGE → LOAD TASKS
  // --------------------------------------------------
  projectSelect.addEventListener("change", async function () {
    const projectName = this.value;

    dailyProjectTasks = [];

    clearDailyTaskDropdowns();

    if (!projectName) return;

    try {
      const taskData = await api("/api/tasks");

      dailyProjectTasks = (taskData.records || []).filter(
        (record) =>
          record.fields?.Project === projectName
      );

      refreshDailyTaskDropdowns();

    } catch (error) {
      console.error("Could not load tasks:", error);
    }
  });


  // --------------------------------------------------
  // ADD / REMOVE RESULT
  // --------------------------------------------------
  document.addEventListener("click", function (event) {

    // + ADD RESULT
    const addButton = event.target.closest("[data-add-daily-result]");

    if (addButton) {
      event.preventDefault();

      const list = q("#daily-result-list");
      const firstRow = list?.querySelector(".daily-result-row");

      if (!list || !firstRow) return;

      const newRow = firstRow.cloneNode(true);

      const select = newRow.querySelector(".daily-task");
      const number = newRow.querySelector(".daily-result-number");

      if (select) {
        select.value = "";
      }

      if (number) {
        number.value = "";
      }

      list.appendChild(newRow);

      refreshDailyTaskDropdowns();

      return;
    }


    // × REMOVE RESULT
    const removeButton = event.target.closest(
      "[data-remove-daily-result]"
    );

    if (removeButton) {
      event.preventDefault();

      const row = removeButton.closest(".daily-result-row");
      const list = removeButton.closest("#daily-result-list");

      if (!row || !list) return;

      const rows = list.querySelectorAll(".daily-result-row");

      if (rows.length > 1) {
        row.remove();
      } else {
        row.querySelector(".daily-task").value = "";
        row.querySelector(".daily-result-number").value = "";
      }
    }
  });


  // --------------------------------------------------
  // WAITING FOR
  // --------------------------------------------------
  const waitingFor = q("#daily-waiting-for");
  const waitingWrap = q("#daily-waiting-details-wrap");
  const waitingDetails = q("#daily-waiting-details");

  waitingFor?.addEventListener("change", function () {
    const selected = this.value;

    if (!selected) {
      waitingWrap.style.display = "none";
      waitingDetails.value = "";
      return;
    }

    waitingWrap.style.display = "block";

    waitingDetails.placeholder =
      `What do you need from ${selected}?`;
  });


  // --------------------------------------------------
  // SPECIAL REQUEST TO CEO
  // --------------------------------------------------
  const ceoRequest = q("#daily-ceo-request");
  const ceoDetails = q("#daily-ceo-request-details");

  ceoRequest?.addEventListener("change", function () {
    const isYes = this.value === "YES";

    ceoDetails.style.display = isYes
      ? "block"
      : "none";

    if (!isYes) {
      q("#daily-ceo-request-type").value = "";
      q("#daily-ceo-request-note").value = "";
    }
  });


  // --------------------------------------------------
  // SUBMIT DAILY REPORT
  // --------------------------------------------------
  submitButton.addEventListener("click", submitDailyReport);
}


// ======================================================
// TASK DROPDOWNS
// ======================================================

function refreshDailyTaskDropdowns() {
  qa(".daily-task").forEach((select) => {
    const currentValue = select.value;

    select.innerHTML =
      `<option value="">Select task</option>` +
      dailyProjectTasks
        .map((record) => {
          const taskName =
            record.fields?.["Task Name"] || "";

          return `
            <option value="${escapeHtml(taskName)}">
              ${escapeHtml(taskName)}
            </option>
          `;
        })
        .join("");

    if (
      dailyProjectTasks.some(
        (record) =>
          record.fields?.["Task Name"] === currentValue
      )
    ) {
      select.value = currentValue;
    }
  });
}


function clearDailyTaskDropdowns() {
  qa(".daily-task").forEach((select) => {
    select.innerHTML =
      `<option value="">Select task</option>`;
  });
}


// ======================================================
// SUBMIT DAILY REPORT
// ======================================================

async function submitDailyReport() {
  const button = q("#submit-daily-report");

  const project = q("#daily-project")?.value || "";

  if (!project) {
    alert("Please select a project.");
    return;
  }


  // --------------------------------------------------
  // TODAY'S RESULTS
  // --------------------------------------------------
  const results = qa(".daily-result-row")
    .map((row) => {
      const task =
        row.querySelector(".daily-task")?.value || "";

      const rawNumber =
        row.querySelector(".daily-result-number")?.value;

      if (
        !task &&
        (rawNumber === "" || rawNumber === undefined)
      ) {
        return null;
      }

      return {
        task,
        todayResult: Number(rawNumber || 0)
      };
    })
    .filter(Boolean);


  // At least one task/result pair
  for (const result of results) {
    if (!result.task) {
      alert("Please select a task for each result.");
      return;
    }

    if (
      Number.isNaN(result.todayResult) ||
      result.todayResult < 0
    ) {
      alert("Today's result must be a valid number.");
      return;
    }
  }


  // --------------------------------------------------
  // AUTO USER INFO
  //
  // Later this will come from real login.
  // For now localStorage can hold current login data.
  // --------------------------------------------------
  const employee =
    localStorage.getItem("ohtUserName") || "Diane";

  const department =
    localStorage.getItem("ohtUserDepartment") ||
    "KOREA OPS";


  // --------------------------------------------------
  // WAITING FOR
  // --------------------------------------------------
  const waitingFor =
    q("#daily-waiting-for")?.value || "";

  const waitingDetails =
    q("#daily-waiting-details")?.value.trim() || "";


  // --------------------------------------------------
  // CEO REQUEST
  // --------------------------------------------------
  const hasCEORequest =
    q("#daily-ceo-request")?.value === "YES";

  const ceoRequestType = hasCEORequest
    ? q("#daily-ceo-request-type")?.value || ""
    : "";

  const ceoRequestNote = hasCEORequest
    ? q("#daily-ceo-request-note")?.value.trim() || ""
    : "";


  if (hasCEORequest && !ceoRequestType) {
    alert("Please select the CEO request type.");
    return;
  }


  // --------------------------------------------------
  // FINAL PAYLOAD
  // --------------------------------------------------
  const payload = {
    date: new Date().toISOString(),

    employee,
    department,

    project,

    results,

    update:
      q("#daily-update-note")?.value.trim() || "",

    waitingFor,
    waitingForDetails: waitingDetails,

    specialRequestCEO: hasCEORequest,
    ceoRequestType,
    ceoRequestNote
  };


  console.log("DAILY REPORT PAYLOAD:", payload);


  button.disabled = true;
  button.textContent = "SUBMITTING...";

  try {

    // NEXT BACKEND ENDPOINT
    const response = await api("/api/daily-reports", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    alert("Daily report submitted.");

    console.log("DAILY REPORT RESPONSE:", response);

    location.href = "project.html";

  } catch (error) {

    console.error(error);

    alert(error.message);

    button.disabled = false;
    button.textContent =
      "SUBMIT DAILY REPORT →";
  }
}


// ======================================================
// SAFE HTML
// ======================================================

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// START DAILY REPORT
initDailyReport();

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
let dailyProjectTasks = [];

async function initDailyReport() {
  const submitButton = q("#submit-daily-report");

  // daily-update.html이 아니면 실행하지 않음
  if (!submitButton) return;
    const projectSelect = q("#daily-project");
  // ======================================================
// DAILY REPORT
// ======================================================

let dailyProjectTasks = [];

async function initDailyReport() {
  const submitButton = q("#submit-daily-report");

  // daily-update.html이 아니면 실행하지 않음
  if (!submitButton) return;

  const projectSelect = q("#daily-project");

  try {
    // --------------------------------------------------
    // LOAD PROJECTS
    // --------------------------------------------------
    const projectData = await api("/api/projects");

    const activeProjects = (projectData.records || []).filter((record) => {
      const status = record.fields?.Status || "";

      return [
        "APPROVED",
        "IN PROGRESS",
        "BLOCKED",
        "READY"
      ].includes(status);
    });
    projectSelect.innerHTML =
      `<option value="">Select project</option>` +
      activeProjects
        .map((record) => {
          const name = record.fields["Project Name"] || "";

          return `
            <option value="${escapeHtml(name)}">
              ${escapeHtml(name)}
            </option>
          `;
        })
        .join("");

  } catch (error) {

    console.error("Could not load projects:", error);
  }
}

 projectSelect.innerHTML =
      `<option value="">Could not load projects</option>`;
  }
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

  const container = q("#ceo-input-cards");
  if (!container) return;

  try {
    // Daily Reports에서 CEO special request 불러오기
    const result = await api("/api/daily-reports");

    const reports = result.records || [];

    // CEO 요청이 YES인 report만 추출
    const ceoRequests = reports.filter((record) => {
      const fields = record.fields || {};

      return (
        fields["Special Request CEO"] === true ||
        fields["Special Request CEO"] === "YES"
      );
    });

    // 요청 없음
    if (!ceoRequests.length) {
      container.innerHTML = `
        <div class="card">
          <div class="eyebrow">
            NO CEO INPUT NEEDED
          </div>

          <div class="sub" style="margin-top:10px">
            No pending CEO requests right now.
          </div>
        </div>
      `;

      return;
    }

    // CEO 요청 카드 생성
    container.innerHTML = ceoRequests
      .map((record) => {
        const f = record.fields || {};

        const project =
          f["Project"] || "Untitled Project";

        const employee =
          f["Employee"] || "";

        const department =
          f["Department"] || "";

        const type =
          f["CEO Request Type"] || "REQUEST";

        const note =
          f["CEO Request Note"] || "";

        const date =
          f["Date"] || "";

        return `
          <div class="card">

            <div class="eyebrow">
              ${escapeHtml(type)}
            </div>

            <div class="project" style="margin-top:8px">
              ${escapeHtml(project)}
            </div>

            <div class="sub" style="margin-top:6px">
              ${escapeHtml(employee)}
              ${department ? " · " + escapeHtml(department) : ""}
            </div>

            <div style="margin-top:16px">
              ${escapeHtml(note)}
            </div>

            ${
              date
                ? `
                  <div class="sub" style="margin-top:12px">
                    ${escapeHtml(date)}
                  </div>
                `
                : ""
            }

          </div>
        `;
      })
      .join("");

  } catch (error) {
    console.error("CEO dashboard load failed:", error);

    container.innerHTML = `
      <div class="card">
        <div class="eyebrow">
          COULD NOT LOAD CEO REQUESTS
        </div>

        <div class="sub" style="margin-top:10px">
          ${escapeHtml(error.message)}
        </div>
      </div>
    `;
  }
}

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
    
