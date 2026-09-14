/* ============================================================
   EWO dashboard settings, Microsoft sign-in edition
   Epyllion Group tenant

   This file is YOURS. Dashboard updates replace index.html but never
   this file, so anything you set here survives every update.
   ============================================================ */
window.EWO_CONFIG = {

  /* Azure portal > App registrations > "Dashboard" > Overview >
     Application (client) ID. Required. Paste the ID of the app named
     "Dashboard" that you registered in the Epyllion directory. */
  CLIENT_ID: "",

  /* Epyllion Group's Directory (tenant) ID. With this set, only Epyllion
     accounts can sign in. */
  TENANT_ID: "09438fa4-a67e-4666-a9c2-fcc1c2252472",

  /* Must match a Redirect URI on the app registration EXACTLY. The one
     registered on the "Dashboard" app ends in /index.html, so it is set
     here in full rather than left to the page's own address, which would
     differ if the page is opened without the file name. */
  REDIRECT_URI: "https://epyrazib.github.io/lockplan/index.html",

  /* What the app asks for. Read-only, delegated: each person still only
     sees what SharePoint already lets them see. */
  GRAPH_SCOPES: ["Files.Read.All", "User.Read"],

  /* Whose OneDrive holds the folder, and where in it.
     ONEDRIVE_OWNER is the owner's work email. With it set, colleagues who
     have been given access to the folder can use the dashboard too.
     Leave it "" to read only the signed-in person's own OneDrive. */
  ONEDRIVE_OWNER: "razib.hossain@epylliongroup.com",
  ONEDRIVE_FOLDER_PATH: "Dashboard",

  /* Not recommended: Graph's Shares API needs Files.ReadWrite for this. */
  ONEDRIVE_SHARE_URL: "",

  /* How the two files are recognised inside that folder, by name. */
  EWO_FILE_PATTERN: "EWO.*Life.*Cycle",
  DELIVERY_FILE_PATTERN: "Fabric.*Delivery",

  /* How often, in seconds, an open page checks whether the files changed. */
  POLL_SECONDS: 300
};
