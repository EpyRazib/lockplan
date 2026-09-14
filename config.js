/* ============================================================
   EWO dashboard settings, Microsoft sign-in edition

   This file is YOURS. Dashboard updates replace index.html but never
   this file, so anything you set here survives every update.
   ============================================================ */
window.EWO_CONFIG = {

  /* From Azure portal > App registrations > your app > Overview.
     Application (client) ID. Required. */
  CLIENT_ID: "",

  /* Who may sign in. Use one of:
       "common"                          work, school AND personal Microsoft accounts
       "consumers"                       personal Microsoft accounts only
       "organizations"                   any work or school account
       "<Directory (tenant) ID>"         one company only, e.g. Epyllion's tenant
     The app registration's "Supported account types" must allow the same. */
  TENANT_ID: "common",

  /* Must match a Redirect URI on the app registration EXACTLY, including the
     trailing slash. Leave empty to use this page's own address. */
  REDIRECT_URI: "",

  /* Where the two workbooks live. Fill in ONE of these.

     ONEDRIVE_FOLDER_PATH: a folder in the signed-in user's own OneDrive,
       written from the root, e.g. "Dashboard" or "Reports/Planning".

     ONEDRIVE_SHARE_URL: the sharing link of a folder that someone else
       shared with you (any sharing link works here, it does not need to be
       "Anyone with the link"; the signed-in user just needs access). */
  ONEDRIVE_FOLDER_PATH: "Dashboard",
  ONEDRIVE_SHARE_URL: "",

  /* How the two files are recognised inside that folder, by name. */
  EWO_FILE_PATTERN: "EWO.*Life.*Cycle",
  DELIVERY_FILE_PATTERN: "Fabric.*Delivery",

  /* How often, in seconds, an open page checks whether the files changed. */
  POLL_SECONDS: 300
};
