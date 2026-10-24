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

  /* The OTT sheet in the fabric delivery workbook is the source of actual
     dates, so the ERP report endpoint is not called and its token is not
     published with this file. Fill this in only to fall back to the live
     report when that sheet is missing. */
  ERP_TNA_URL: "",
  ERP_TIMEOUT_SECONDS: 300,

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
