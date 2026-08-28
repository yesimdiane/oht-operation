const ROUTES = {
  LOGIN: "html/oht_dashboard_login.html",

  MARKETING: "html/dashboard/oht_dashboard_marketing.html",
  CONTENT: "html/dashboard/oht_dashboard_content.html",
  SHIPPING: "html/dashboard/oht_dashboard_shipping.html",
  INVENTORY: "html/dashboard/oht_dashboard_inventory.html",
  OPERATIONS: "html/dashboard/oht_dashboard_operations.html",
  KOREA OPS: "html/dashboard/oht_dashboard_korea_ops.html",

  WELCOME: "html/oht_welcome_unregistered.html",

  ADMIN: "html/oht_dashboard_admin.html",
  EXECUTIVE: "html/oht_dashboard_executive.html",
  CEO: "html/oht_dashboard_ceo.html",

  NO_ACCESS: "html/oht_no_access.html"
};

// ======================================================
// CONFIG
// ======================================================

const APP_CONFIG = {
  app: "OHT Operations",
  version: "3.1.0",

  oauth: {
    google_client_id:
      "337829766336-097j7o7h2nahieg07vc8ib1hppanr46m.apps.googleusercontent.com"
  }
};


// ======================================================
// CONSTANTS
// ======================================================

const CEO_EMAIL = "jinsol@ohtnyc.com";


// ======================================================
// FIND APP ROOT
//
// This makes routing work even when current HTML is
// inside /html/ or /html/Dashboard/... etc.
// ======================================================

function getAppRoot() {

  const scripts =
    Array.from(
      document.querySelectorAll("script[src]")
    );


  const appScript =
    scripts.find((script) => {

      const src =
        script.getAttribute("src") || "";

      return (
        src.endsWith("app.js") ||
        src.includes("/app.js")
      );

    });


  if (appScript) {

    const absoluteScriptURL =
      new URL(
        appScript.src,
        window.location.href
      );


    return new URL(
      ".",
      absoluteScriptURL
    );

  }


  // fallback
  return new URL(
    "/",
    window.location.origin
  );
}


const APP_ROOT =
  getAppRoot();


function appUrl(path) {

  return new URL(
    String(path || "")
      .replace(/^\/+/, ""),

    APP_ROOT

  ).href;

}


// ======================================================
// ROUTES
// ======================================================
const ROUTES = {

    // LOGIN
    LOGIN:
        "index.html",

    // CEO / EXECUTIVE / ADMIN
    CEO:
        "html/dashboard/ceo_dashboard_layout_preview.html",

    EXECUTIVE:
        "html/dashboard/oht_dashboard_executive.html",

    ADMIN:
        "html/access-management.html",

    // DEPARTMENT DASHBOARDS
    MARKETING:
        "html/dashboard/oht_dashboard_marketing.html",

    CONTENT:
        "html/dashboard/oht_dashboard_content.html",

    SHIPPING:
        "html/dashboard/oht_dashboard_shipping.html",

    INVENTORY:
        "html/dashboard/oht_dashboard_inventory.html",

    OPERATIONS:
        "html/dashboard/oht_dashboard_operations.html",

    // PROJECT / APPROVAL
    SUBMIT_PROJECT:
        "html/submit-project.html",

    CEO_APPROVAL:
        "html/oht_ceo_approval_queue.html",

    PROJECT_APPROVAL:
        "html/oht_ceo_project_approval.html",

    APPROVAL_DETAIL:
        "html/oht_approval_request_detail.html",

    // DAILY / REVIEW
    DAILY_UPDATE:
        "html/daily-update.html",

    REVIEW_ALL:
        "html/review-all.html",

    PROJECT:
        "html/project.html"
};
  // DEPARTMENT COMMUNICATION DASHBOARDS
  MARKETING:
    "html/dashboard/department_communication/marketing_communicating.html",

  CONTENT:
    "html/dashboard/department_communication/content_communicating.html",

  SHIPPING:
    "html/dashboard/department_communication/shipping_communicating.html",

  INVENTORY:
    "html/dashboard/department_communication/inventory_communicating.html",

  OPERATIONS:
    "html/dashboard/department_communication/operations_communicating.html",

  "KOREA OPS":
    "html/dashboard/oht_dashboard_korea_ops.html",


  // ACCESS
  WELCOME:
    "html/dashboard/oht_welcome_unregistered.html",

  NO_ACCESS:
    "html/oht_no_access.html",


  // OTHER EXISTING PAGES
  ACCESS_MANAGEMENT:
    "html/access-management.html",

  CEO_APPROVAL:
    "html/ceo-approval.html",

  DAILY_UPDATE:
    "html/daily-update.html",

  PROJECT:
    "html/project.html",

  REVIEW_ALL:
    "html/review-all.html",

  SUBMIT_PROJECT:
    "html/submit-project.html",

  MORNING_BRIEF:
    "html/oht_morning_brief_airtable.html"

};


// ======================================================
// BASIC HELPERS
// ======================================================

function normalize(value) {

  return String(
    value ?? ""
  )
    .trim()
    .toUpperCase();

}


function normalizeEmail(value) {

  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase();

}


function routeUrl(routeName) {

  const path =
    ROUTES[routeName] ||
    routeName;


  return appUrl(path);

}


function goTo(
  routeName,
  replace = false
) {

  const destination =
    routeUrl(routeName);


  console.log(
    "[OHT NAVIGATION]",
    routeName,
    "→",
    destination
  );


  if (replace) {

    window.location.replace(
      destination
    );

  } else {

    window.location.href =
      destination;

  }

}


// ======================================================
// SESSION
//
// SINGLE SOURCE OF TRUTH:
//
// sessionStorage.oht_user
//
// {
//   email,
//   name,
//   picture,
//   title,
//   department,
//   team
// }
//
// ======================================================

function normalizeUser(user) {

  return {

    email:
      normalizeEmail(
        user?.email
      ),

    name:
      String(
        user?.name || ""
      ).trim(),

    picture:
      String(
        user?.picture || ""
      ).trim(),

    title:
      normalize(
        user?.title
      ),

    department:
      normalize(
        user?.department
      ),

    team:
      normalize(
        user?.team
      ),

    timestamp:
      Date.now()

  };

}


function saveCurrentUser(user) {

  const normalizedUser =
    normalizeUser(user);


  sessionStorage.setItem(

    "oht_user",

    JSON.stringify(
      normalizedUser
    )

  );


  // OLD PAGE COMPATIBILITY

  sessionStorage.setItem(
    "oht_user_email",
    normalizedUser.email
  );

  sessionStorage.setItem(
    "oht_user_name",
    normalizedUser.name
  );

  sessionStorage.setItem(
    "oht_user_title",
    normalizedUser.title
  );

  sessionStorage.setItem(
    "oht_user_department",
    normalizedUser.department
  );

  sessionStorage.setItem(
    "oht_user_team",
    normalizedUser.team
  );


  localStorage.setItem(
    "ohtUserEmail",
    normalizedUser.email
  );

  localStorage.setItem(
    "ohtUserName",
    normalizedUser.name
  );

  localStorage.setItem(
    "ohtUserTitle",
    normalizedUser.title
  );

  localStorage.setItem(
    "ohtUserDepartment",
    normalizedUser.department
  );

  localStorage.setItem(
    "ohtUserTeam",
    normalizedUser.team
  );


  return normalizedUser;

}


function getCurrentUser() {

  try {

    const stored =
      sessionStorage.getItem(
        "oht_user"
      );


    if (!stored) {

      return null;

    }


    return normalizeUser(
      JSON.parse(stored)
    );


  } catch (error) {

    console.error(
      "[OHT] Could not read session:",
      error
    );


    return null;

  }

}


function clearCurrentUser() {

  sessionStorage.removeItem(
    "oht_user"
  );

  sessionStorage.removeItem(
    "oht_unregistered_user"
  );

  sessionStorage.removeItem(
    "attempted_email"
  );


  sessionStorage.removeItem(
    "oht_user_email"
  );

  sessionStorage.removeItem(
    "oht_user_name"
  );

  sessionStorage.removeItem(
    "oht_user_title"
  );

  sessionStorage.removeItem(
    "oht_user_department"
  );

  sessionStorage.removeItem(
    "oht_user_team"
  );


  [
    "ohtUserEmail",
    "ohtUserName",
    "ohtUserTitle",
    "ohtUserDepartment",
    "ohtUserTeam"
  ]
    .forEach((key) => {

      localStorage.removeItem(
        key
      );

    });

}


// ======================================================
// RBAC
// ======================================================

function isCEO(user) {

  if (!user) {

    return false;

  }


  return (

    normalizeEmail(
      user.email
    ) === CEO_EMAIL

    &&

    normalize(
      user.department
    ) === "EXECUTIVE"

  );

}


function isAdmin(user) {

  if (!user) {

    return false;

  }


  return (

    normalize(
      user.title
    ) === "ADMIN"

    &&

    normalize(
      user.department
    ) === "ALL"

    &&

    normalize(
      user.team
    ) === "ALL"

  );

}


function isExecutive(user) {

  if (!user) {

    return false;

  }


  return (

    !isCEO(user)

    &&

    normalize(
      user.department
    ) === "EXECUTIVE"

  );

}


// ======================================================
// ROUTING
// ======================================================

function getUserRoute(user) {

  if (
    !user ||
    !user.email
  ) {

    return "LOGIN";

  }


  // CEO

  if (
    isCEO(user)
  ) {

    return "CEO";

  }


  // ADMIN

  if (
    isAdmin(user)
  ) {

    return "ADMIN";

  }


  // EXECUTIVE

  if (
    isExecutive(user)
  ) {

    return "EXECUTIVE";

  }


  // TEAM

  const team =
    normalize(
      user.team
    );


  const TEAM_ROUTES = {

    MARKETING:
      "MARKETING",

    CONTENT:
      "CONTENT",

    SHIPPING:
      "SHIPPING",

    INVENTORY:
      "INVENTORY",

    OPERATIONS:
      "OPERATIONS",

    "KOREA OPS":
      "KOREA OPS"

  };


  if (
    TEAM_ROUTES[team]
  ) {

    return TEAM_ROUTES[team];

  }


  // REGISTERED BUT INVALID PERMISSION

  return "NO_ACCESS";

}


function routeUser(user) {

  const route =
    getUserRoute(user);


  console.log(

    "[OHT ROUTER]",

    user?.email,

    "title:",
    user?.title,

    "department:",
    user?.department,

    "team:",
    user?.team,

    "→",

    route

  );


  goTo(route);

}


// ======================================================
// MVP USER DATABASE
//
// BACKEND 없음.
// 나중에 이 함수만 Airtable/API로 교체.
// ======================================================

const MVP_USERS = [

  // CEO

  {

    email:
      "jinsol@ohtnyc.com",

    name:
      "Jinsol Woo",

    title:
      "CEO",

    department:
      "EXECUTIVE",

    team:
      "ALL"

  },


  // ADMIN DEMO

  {

    email:
      "admin@ohtnyc.com",

    name:
      "Admin Demo",

    title:
      "ADMIN",

    department:
      "ALL",

    team:
      "ALL"

  },


  // EXECUTIVE DEMO

  {

    email:
      "executive@ohtnyc.com",

    name:
      "Executive Demo",

    title:
      "DIRECTOR",

    department:
      "EXECUTIVE",

    team:
      "ALL"

  },


  // DIANE MVP TEST

  {

    email:
      "diane@ohtnyc.com",

    name:
      "Diane",

    title:
      "COORDINATOR",

    department:
      "MARKETING",

    team:
      "MARKETING"

  }

];


async function lookupRegisteredUser(
  email
) {

  const target =
    normalizeEmail(email);


  return (

    MVP_USERS.find(
      (user) =>

        normalizeEmail(
          user.email
        ) === target

    )

    ||

    null

  );

}


// ======================================================
// GOOGLE LOGIN
// ======================================================

function initializeGoogleSignIn() {

  if (

    !window.google

    ||

    !window.google.accounts

    ||

    !window.google.accounts.id

  ) {

    console.warn(
      "[OHT] Google login script not ready."
    );


    return false;

  }


  window.google.accounts.id.initialize({

    client_id:
      APP_CONFIG.oauth.google_client_id,

    callback:
      handleCredentialResponse

  });


  return true;

}


// ======================================================
// GOOGLE TOKEN
// ======================================================

function decodeGoogleCredential(
  credential
) {

  const tokenPart =
    credential
      ?.split(".")
      ?.[1];


  if (!tokenPart) {

    throw new Error(
      "Invalid Google token."
    );

  }


  const base64 =
    tokenPart

      .replace(
        /-/g,
        "+"
      )

      .replace(
        /_/g,
        "/"
      );


  const padded =
    base64

    +

    "=".repeat(

      (
        4 -
        (
          base64.length %
          4
        )
      )

      %

      4

    );


  const binary =
    atob(padded);


  const decoded =
    decodeURIComponent(

      Array.from(binary)

        .map((character) => {

          return (

            "%"

            +

            character
              .charCodeAt(0)
              .toString(16)
              .padStart(
                2,
                "0"
              )

          );

        })

        .join("")

    );


  return JSON.parse(
    decoded
  );

}


// ======================================================
// GOOGLE CALLBACK
// ======================================================

function handleCredentialResponse(
  response
) {

  try {

    if (
      !response?.credential
    ) {

      throw new Error(
        "Google credential missing."
      );

    }


    const googleUser =
      decodeGoogleCredential(
        response.credential
      );


    loginUser(
      googleUser
    );


  } catch (error) {

    console.error(
      "[OHT] Google Login Error:",
      error
    );


    alert(
      "Google login failed."
    );

  }

}


// ======================================================
// LOGIN
// ======================================================

async function loginUser(
  googleUser
) {

  const email =
    normalizeEmail(
      googleUser?.email
    );


  if (!email) {

    goTo(
      "LOGIN"
    );

    return;

  }


  const registeredUser =
    await lookupRegisteredUser(
      email
    );


  // UNREGISTERED EMAIL

  if (!registeredUser) {

    routeUnregistered({

      email,

      name:
        googleUser?.name || "",

      picture:
        googleUser?.picture || ""

    });


    return;

  }


  // REGISTERED

  const user =
    saveCurrentUser({

      email,

      name:
        registeredUser.name
        ||
        googleUser?.name
        ||
        "",

      picture:
        googleUser?.picture
        ||
        "",

      title:
        registeredUser.title,

      department:
        registeredUser.department,

      team:
        registeredUser.team

    });


  routeUser(
    user
  );

}


// ======================================================
// UNREGISTERED
// ======================================================

function routeUnregistered(
  user
) {

  clearCurrentUser();


  const pendingUser = {

    email:
      normalizeEmail(
        user?.email
      ),

    name:
      user?.name || "",

    picture:
      user?.picture || "",

    timestamp:
      Date.now()

  };


  sessionStorage.setItem(

    "oht_unregistered_user",

    JSON.stringify(
      pendingUser
    )

  );


  sessionStorage.setItem(

    "attempted_email",

    pendingUser.email

  );


  const destination =
    new URL(
      routeUrl(
        "WELCOME"
      )
    );


  destination.searchParams.set(

    "email",

    pendingUser.email

  );


  window.location.href =
    destination.href;

}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

  clearCurrentUser();


  try {

    window.google
      ?.accounts
      ?.id
      ?.disableAutoSelect();

  } catch (error) {

    console.warn(
      error
    );

  }


  goTo(
    "LOGIN"
  );

}


// ======================================================
// TEST BYPASS
//
// page.html?test=1
//
// MVP ONLY.
// ======================================================

function testMode() {

  return (

    new URLSearchParams(
      window.location.search
    )
      .get("test")

    ===

    "1"

  );

}


// ======================================================
// DEPARTMENT PAGE GUARD
// ======================================================

function requirePageAccess(
  requiredTeam
) {

  if (
    testMode()
  ) {

    console.warn(
      "[OHT DEV] test=1 bypass."
    );


    return true;

  }


  const user =
    getCurrentUser();


  if (!user) {

    goTo(
      "LOGIN",
      true
    );


    return false;

  }


  // CEO & ADMIN
  // can see all departments

  if (

    isCEO(user)

    ||

    isAdmin(user)

  ) {

    return true;

  }


  if (

    normalize(
      user.team
    )

    ===

    normalize(
      requiredTeam
    )

  ) {

    return true;

  }


  goTo(
    "NO_ACCESS",
    true
  );


  return false;

}


// ======================================================
// CEO PAGE GUARD
// ======================================================

function requireCEOAccess() {

  if (
    testMode()
  ) {

    return true;

  }


  const user =
    getCurrentUser();


  if (!user) {

    goTo(
      "LOGIN",
      true
    );


    return false;

  }


  if (
    isCEO(user)
  ) {

    return true;

  }


  goTo(
    "NO_ACCESS",
    true
  );


  return false;

}


// ======================================================
// EXECUTIVE PAGE GUARD
// ======================================================

function requireExecutiveAccess() {

  if (
    testMode()
  ) {

    return true;

  }


  const user =
    getCurrentUser();


  if (!user) {

    goTo(
      "LOGIN",
      true
    );


    return false;

  }


  if (

    isCEO(user)

    ||

    isAdmin(user)

    ||

    isExecutive(user)

  ) {

    return true;

  }


  goTo(
    "NO_ACCESS",
    true
  );


  return false;

}


// ======================================================
// ADMIN PAGE GUARD
// ======================================================

function requireAdminAccess() {

  if (
    testMode()
  ) {

    return true;

  }


  const user =
    getCurrentUser();


  if (!user) {

    goTo(
      "LOGIN",
      true
    );


    return false;

  }


  if (
    isAdmin(user)
  ) {

    return true;

  }


  goTo(
    "NO_ACCESS",
    true
  );


  return false;

}


// ======================================================
// DEMO CEO
// ======================================================

function loginAsDemoCEO() {

  const user =
    saveCurrentUser({

      email:
        CEO_EMAIL,

      name:
        "Jinsol Woo",

      title:
        "CEO",

      department:
        "EXECUTIVE",

      team:
        "ALL"

    });


  routeUser(
    user
  );

}


// ======================================================
// DEMO EMPLOYEE
// ======================================================

function loginAsDepartmentDemo() {
    const select = document.getElementById("demoDepartment");
    const department = select ? select.value : "";

    if (!department) {
        alert("Please select a department.");
        return;
    }

    const demoUsers = {
        "MARKETING": {
            email: "demo.marketing@ohtnyc.com",
            name: "Demo Marketing",
            title: "EMPLOYEE",
            department: "MARKETING",
            team: "MARKETING"
        },

        "CONTENT": {
            email: "demo.content@ohtnyc.com",
            name: "Demo Content",
            title: "EMPLOYEE",
            department: "CONTENT",
            team: "CONTENT"
        },

        "SHIPPING": {
            email: "demo.shipping@ohtnyc.com",
            name: "Demo Shipping",
            title: "EMPLOYEE",
            department: "SHIPPING",
            team: "SHIPPING"
        },

        "INVENTORY": {
            email: "demo.inventory@ohtnyc.com",
            name: "Demo Inventory",
            title: "EMPLOYEE",
            department: "INVENTORY",
            team: "INVENTORY"
        },

        "OPERATIONS": {
            email: "demo.operations@ohtnyc.com",
            name: "Demo Operations",
            title: "EMPLOYEE",
            department: "OPERATIONS",
            team: "OPERATIONS"
        },

        "KOREA OPS": {
            email: "demo.koreaops@ohtnyc.com",
            name: "Demo Korea Ops",
            title: "EMPLOYEE",
            department: "KOREA OPS",
            team: "KOREA OPS"
        },

        "EXECUTIVE": {
            email: "demo.executive@ohtnyc.com",
            name: "Demo Executive",
            title: "EXECUTIVE",
            department: "EXECUTIVE",
            team: "ALL"
        }
    };

    const user = demoUsers[department];

    sessionStorage.setItem(
        "oht_user",
        JSON.stringify(user)
    );

    const routes = {
        "MARKETING":
            "dashboard/oht_dashboard_marketing.html",

        "CONTENT":
            "dashboard/oht_dashboard_content.html",

        "SHIPPING":
            "dashboard/oht_dashboard_shipping.html",

        "INVENTORY":
            "dashboard/oht_dashboard_inventory.html",

        "OPERATIONS":
            "dashboard/oht_dashboard_operations.html",

        "KOREA OPS":
            "oht_dashboard_korea_ops.html",

        "EXECUTIVE":
            "oht_dashboard_executive.html"
    };

    const destination = routes[department];

    if (!destination) {
        window.location.href =
            "oht_welcome_unregistered.html";
        return;
    }

    window.location.href = destination;
}

  const user =
    saveCurrentUser({

      email:

        "demo-"

        +

        selected
          .toLowerCase()
          .replace(
            /\s+/g,
            "-"
          )

        +

        "@ohtnyc.com",

      name:
        selected +
        " Demo",

      title:
        "EMPLOYEE",

      department:
        selected,

      team:
        selected

    });


  routeUser(
    user
  );

}


// ======================================================
// USER HEADER
//
// OPTIONAL IDs:
//
// oht-user-name
// oht-user-email
// oht-user-access
// ======================================================

function hydrateUserHeader() {

  const user =
    getCurrentUser();


  if (!user) {

    return;

  }


  const name =
    document.getElementById(
      "oht-user-name"
    );


  const email =
    document.getElementById(
      "oht-user-email"
    );


  const access =
    document.getElementById(
      "oht-user-access"
    );


  if (name) {

    name.textContent =
      user.name ||
      user.email;

  }


  if (email) {

    email.textContent =
      user.email;

  }


  if (access) {

    if (
      isCEO(user)
    ) {

      access.textContent =
        "CEO ACCESS";

    }

    else if (
      isAdmin(user)
    ) {

      access.textContent =
        "ADMIN ACCESS";

    }

    else if (
      isExecutive(user)
    ) {

      access.textContent =
        "EXECUTIVE ACCESS";

    }

    else {

      access.textContent =

        (
          user.team
          ||
          user.department
        )

        +

        " ACCESS";

    }

  }

}


// ======================================================
// LOGO
//
// Optional:
//
// <img data-oht-logo>
//
// Since oht_logo.png is in root,
// this always resolves correctly.
// ======================================================

function hydrateLogo() {

  document
    .querySelectorAll(
      "[data-oht-logo]"
    )
    .forEach((image) => {

      image.src =
        appUrl(
          "oht_logo.png"
        );

    });

}


// ======================================================
// INITIALIZE
// ======================================================

function initOHT() {

  hydrateLogo();

  hydrateUserHeader();


  if (
    !initializeGoogleSignIn()
  ) {

    window.addEventListener(

      "load",

      function () {

        initializeGoogleSignIn();

      },

      {
        once: true
      }

    );

  }

}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(

    "DOMContentLoaded",

    initOHT

  );

}

else {

  initOHT();

}


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.OHT = {

  APP_CONFIG,

  ROUTES,

  appUrl,

  routeUrl,

  goTo,

  getCurrentUser,

  saveCurrentUser,

  clearCurrentUser,

  isCEO,

  isAdmin,

  isExecutive,

  getUserRoute,

  routeUser,

  loginUser,

  logout,

  loginAsDemoCEO,

  loginAsDepartmentDemo,

  requirePageAccess,

  requireCEOAccess,

  requireExecutiveAccess,

  requireAdminAccess

};


// SUPPORT INLINE HTML onclick="..."

window.loginUser =
  loginUser;

window.logout =
  logout;

window.loginAsDemoCEO =
  loginAsDemoCEO;

window.loginAsDepartmentDemo =
  loginAsDepartmentDemo;

window.requirePageAccess =
  requirePageAccess;

window.requireCEOAccess =
  requireCEOAccess;

window.requireExecutiveAccess =
  requireExecutiveAccess;

window.requireAdminAccess =
  requireAdminAccess;
