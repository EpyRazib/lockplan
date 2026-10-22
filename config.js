/* ============================================================
   EWO dashboard settings, Microsoft sign-in edition
   Epyllion Group tenant, Files.SelectedOperations.Selected

   This file is YOURS. Dashboard updates replace index.html but never
   this file, so anything you set here survives every update.
   ============================================================ */
window.EWO_CONFIG = {

  /* Azure portal > App registrations > "Dashboard" > Overview >
     Application (client) ID. Required. */
  CLIENT_ID: "f52fc87b-2ce5-404d-aab3-acb90675308c",

  /* Epyllion Group's Directory (tenant) ID. Only Epyllion accounts can sign in. */
  TENANT_ID: "09438fa4-a67e-4666-a9c2-fcc1c2252472",

  /* Must match a Redirect URI on the app registration EXACTLY. */
  REDIRECT_URI: "https://epyrazib.github.io/lockplan/index.html",

  /* What the app asks for, as agreed with the admin. With
     Files.SelectedOperations.Selected the app can only reach the files
     (or folder) that were explicitly granted to it. */
  GRAPH_SCOPES: ["User.Read", "Files.SelectedOperations.Selected"],

  /* Whose OneDrive holds the files. */
  ONEDRIVE_OWNER: "razib.hossain@epylliongroup.com",

  /* Where the two workbooks are, as paths from the OneDrive root. With these
     set, each file is fetched directly and the folder is never listed, which
     is what per-file grants allow. Keep the names exactly as in OneDrive. */
  EWO_FILE_PATH: "Dashboard/EWOLifeCycle.xlsx",
  DELIVERY_FILE_PATH: "Dashboard/FabricDelivery.xlsx",

  /* Used only when EWO_FILE_PATH is empty: the folder is listed and files are
     picked by name. Needs a grant on the FOLDER (or Files.Read.All). */
  ONEDRIVE_FOLDER_PATH: "Dashboard",
  EWO_FILE_PATTERN: "EWO.*Life.*Cycle",
  DELIVERY_FILE_PATTERN: "Fabric.*Delivery",

  /* Not used in this setup. */
  ONEDRIVE_SHARE_URL: "",

  /* ----------------------------------------------------------
     The ERP's TNA calendar, which supplies the ACTUAL completion dates the
     OTT tab compares against the plan in the EWO sheet.

     READ THIS BEFORE FILLING IT IN. The address carries a token, and this
     file is served to anyone who opens the dashboard. On a public GitHub
     Pages repository that means the token is public too, and anyone who
     finds it can pull the same report. Two safe ways round it:

       1. Make the repository private (GitHub Pages on a private repo needs
          a paid plan), or
       2. Put the address and token in a Cloudflare Worker, as the 4P
          edition does for its rebuild button, and point ERP_TNA_URL at the
          Worker instead. The Worker keeps the token and only answers
          requests from this dashboard.

     Ask the ERP team for a token issued for this dashboard alone, so it can
     be withdrawn without disturbing anything else.

     The last part of the address is the date range the report covers, as
     from,to in MM/DD/YYYY with the slashes written %2F. Narrowing it is the
     quickest way to make the report answer faster.
     ---------------------------------------------------------- */
 ERP_TNA_URL: "https://texerp.epylliongroup.com/api/reports/generic-report"
             + "?token=c2208612-f67b-40a8-ae8b-4b27d028fb94"
             + "&reportName=TNACalenderByDate"
             + "&values=01%2F01%2F2026%2C12%2F31%2F2027",
  ERP_TIMEOUT_SECONDS: 300,

  /* The events the OTT tab follows, and which EWO sheet column holds the plan
     date for each one. The ERP's own name is on the LEFT, the EWO sheet column
     on the RIGHT.

     This list is also the filter: when it has entries, ONLY these events are
     read from the ERP calendar. The report carries 53 event types for every
     order, and the rest are of no interest here. Leave it empty to go back to
     pairing by name automatically.

     The order below is the order the OTT tab lists them in, so keep it in
     lifecycle order. "Yarn InHouse  End" has no event in the ERP, so it is
     absent rather than paired with something approximate.                  */
  ERP_EVENT_ALIASES: {
    "Yarn Allocation":                          "Yarn InHouse  Start",
    "PP/TAG Sample fabric Delivery":            "PP/TAG Sample fabric Delivery",
    "Labdip Approval":                          "Labdip Approval",
    "Final Confirmation For Fabric Production": "Final Confirmation For Fabric Production",
    "Fabric Delivery start":                    "Fabric Delivery start",
    "Fabric Delivery complete":                 "Fabric Delivery complete",
    "PP/TAG sample approve":                    "PP/TAG sample approve",
    "PCD [Cutting Input]":                      "PCD [Cutting Input]",
    "Sewing trims inhouse":                     "Sewing trims inhouse",
    "Sewing Input":                             "Adjusted sew start",
    "Sewing Complete":                          "Adjusted sew end",
    "Gmt Receive From Wash [Start]":            "wash start",
    "Gmt Receive From Wash [Complete]":         "wash end",
    "Final inspection done":                    "RFI"
  },

  /* How often, in seconds, an open page checks whether the files changed.
     The ERP calendar is re-read on the same beat. */
  POLL_SECONDS: 300
};
