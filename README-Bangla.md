# EWO ড্যাশবোর্ড, Microsoft সাইন-ইন সংস্করণ (বাংলা)

**যেভাবে কাজ করে:** পেজ খুললে Microsoft সাইন ইন চাইবে। সাইন ইন হলে ব্রাউজার নিজেই
Microsoft Graph দিয়ে OneDrive থেকে দুটো ওয়ার্কবুক নামিয়ে পড়ে ড্যাশবোর্ড দেখাবে।
মাঝখানে কিছু নেই: GitHub Action নেই, Cloudflare worker নেই, `data.json` নেই, ফাইলের
কোনো পাবলিক লিংক নেই।

**যা পাবেন:** যার ফাইলে access আছে শুধু সে দেখতে পাবে। Excel এ সেভ করার সাথে সাথেই
ড্যাশবোর্ডে চলে আসবে, কোনো ১৫ মিনিটের অপেক্ষা নেই।

**যা লাগবে:** একটা Azure app registration। এই ফোল্ডারটা আলাদা একটা git repository
হিসেবে রাখুন, আগের ড্যাশবোর্ডটা যেমন আছে তেমনই চলতে থাকবে।

---

## এই ফোল্ডারে কী আছে

```
index.html         ড্যাশবোর্ড, সাইন-ইন সহ
config.js          আপনার সেটিং, এখানে CLIENT_ID বসবে
README-Bangla.md   এই গাইড
```

`config.js` আপনার নিজের ফাইল। ড্যাশবোর্ড আপডেট এলে শুধু `index.html` বদলাবেন।

---

## ধাপ ১: একটা directory পান

App registration একটা Microsoft Entra directory (tenant) এর ভিতরে থাকতে হয়।

**নিজে পরীক্ষা করতে (ব্যক্তিগত Gmail/Outlook দিয়ে):** `azure.microsoft.com/free` এ
সাইন আপ করুন। পরিচয় যাচাইয়ে কার্ড চায়, টাকা কাটে না, app registration ফ্রি। সাইন
আপ শেষে আপনার নিজের directory তৈরি হবে যার আপনি Global Administrator, তাই
consent নিজেই দিতে পারবেন। M365 Developer Program এখন আর সবার জন্য ফ্রি নয়,
ওটা বাদ।

**অফিসের জন্য:** app টা Epyllion এর directory তে থাকতে হবে, অথবা multi-tenant হলে
Epyllion এর admin কে consent দিতে হবে। এই ধাপে admin এর অনুমোদন লাগবেই।

## ধাপ ২: app registration বানান

1. portal.azure.com → **Microsoft Entra ID** → **App registrations** → **New registration**।
2. **Name:** যেমন `EWO Dashboard`।
3. **Supported account types:** এটা গুরুত্বপূর্ণ।

   | পরিস্থিতি | যা বাছবেন | `config.js` এ TENANT_ID |
   |---|---|---|
   | নিজে পরীক্ষা, ফাইল ব্যক্তিগত OneDrive এ | **Accounts in any organizational directory and personal Microsoft accounts** | `"common"` |
   | শুধু Epyllion এর লোক | **Accounts in this organizational directory only** (app টা Epyllion এর directory তে) | Epyllion এর tenant ID |

4. **Redirect URI:** platform এ **Single-page application (SPA)** বেছে আপনার GitHub Pages
   এর ঠিকানা দিন, **শেষে `/` সহ**, যেমন `https://epyrazib.github.io/ewo-dashboard/`।
   পরে ঠিকানা বদলালে এখানে **Authentication** পাতায় নতুনটা যোগ করতে হবে।
5. **Register** চাপুন।
6. **Overview** পাতা থেকে **Application (client) ID** কপি করুন। অফিসের জন্য হলে
   **Directory (tenant) ID** ও।

## ধাপ ৩: permission দিন

1. app এর পাতায় **API permissions** → **Add a permission** → **Microsoft Graph** →
   **Delegated permissions**।
2. খুঁজে টিক দিন: `Files.Read.All` আর `User.Read`। **Add permissions**।
3. এবার **Grant admin consent for <directory name>** বোতামে চাপুন। নিজের directory
   হলে আপনিই admin, চাপলেই হবে। অফিসের directory হলে admin কে চাপতে বলুন।

`Files.Read.All` লাগে কারণ ফাইল অন্য কারো OneDrive থেকে শেয়ার করা হতে পারে। শুধু
নিজের ফাইল পড়লে `Files.Read` ই যথেষ্ট, তখন `config.js` এ `GRAPH_SCOPES` বদলে
`["Files.Read", "User.Read"]` দেবেন।

## ধাপ ৪: config.js পূরণ করুন

```javascript
  CLIENT_ID: "এখানে Application (client) ID",
  TENANT_ID: "common",              // অফিসের হলে Directory (tenant) ID
  ONEDRIVE_FOLDER_PATH: "Dashboard", // সাইন-ইন করা অ্যাকাউন্টের OneDrive এর কোন ফোল্ডারে ফাইল দুটো আছে
```

ফাইল দুটো যদি **অন্য কারো** OneDrive থেকে আপনার সাথে শেয়ার করা হয়, তাহলে
`ONEDRIVE_FOLDER_PATH` খালি রেখে `ONEDRIVE_SHARE_URL` এ ওই ফোল্ডারের শেয়ার লিংক
দিন। এখানে লিংকটা "Anyone with the link" হওয়ার দরকার নেই, সাইন-ইন করা লোকের
access থাকলেই হয়।

ফোল্ডারে ফাইল নাম দেখে চেনা হয়: নামে "EWO ... Life ... Cycle" থাকলে EWO ওয়ার্কবুক,
"Fabric ... Delivery" থাকলে ডেলিভারি ওয়ার্কবুক। একাধিক থাকলে সবচেয়ে নতুনটা।

## ধাপ ৫: GitHub এ দিন

1. নতুন repository বানান। **Public** রাখলেও সমস্যা নেই, কারণ পেজে কোনো ডেটা নেই,
   ডেটা আসে সাইন-ইনের পরে সরাসরি OneDrive থেকে।
2. `index.html` আর `config.js` root এ আপলোড করুন।
3. **Settings** → **Pages** → Deploy from a branch, `main`, `/ (root)`, Save।
4. Pages যে ঠিকানা দেয় সেটা ধাপ ২ এর Redirect URI র সাথে **হুবহু** মিলছে কিনা
   মিলিয়ে নিন, শেষের `/` সহ। না মিললে সাইন ইন হবে না।

## ধাপ ৬: খুলে সাইন ইন করুন

পেজ খুলুন, **Sign in with Microsoft** চাপুন, popup এ অ্যাকাউন্ট বাছুন। প্রথমবার
permission মেনে নেওয়ার পাতা আসতে পারে, **Accept** দিন। এরপর:

- **Finding the workbooks**, তারপর **Downloading**, তারপর **Reading the sheets**।
  ১৭ মেগাবাইট নামে আর পড়ে, প্রথমবার ১০ থেকে ১৫ সেকেন্ড।
- পরের বার থেকে পেজ আগে দেখে ফাইল বদলেছে কিনা। না বদলালে ব্রাউজারের ক্যাশ থেকে
  এক সেকেন্ডের কমে খোলে। বদলালে আবার নামায়।
- খোলা পেজ প্রতি ৫ মিনিটে নিজে থেকে দেখে ফাইল বদলেছে কিনা, আর অন্য ট্যাব থেকে
  ফিরে এলেই একবার দেখে। **Refresh** চাপলে সাথে সাথে দেখে।
- উপরে ডানে কার অ্যাকাউন্টে সাইন ইন আছে দেখা যায়, আর **Sign out** বোতাম আছে।

---

## সমস্যা হলে

| যা দেখবেন | কারণ ও সমাধান |
|---|---|
| No CLIENT_ID is set | `config.js` এ CLIENT_ID বসানো হয়নি। |
| The Microsoft sign-in library did not load | ad-blocker বা অফিসের নেট `cdn.jsdelivr.net` আটকাচ্ছে। অন্য নেট বা private window। |
| popup খুলেই বন্ধ, বা `AADSTS50011` | Redirect URI মিলছে না। Azure এ Authentication পাতায় ঠিক Pages ঠিকানাটা, শেষের `/` সহ, SPA platform এ আছে কিনা দেখুন। |
| `AADSTS65001` বা `AADSTS90094`, "needs admin approval" | consent দেওয়া হয়নি। ধাপ ৩ এর Grant admin consent। |
| `AADSTS50020`, "account does not exist in tenant" | Supported account types আর TENANT_ID মিলছে না। ব্যক্তিগত অ্যাকাউন্টে `"common"` লাগবে আর app এ personal accounts allow থাকতে হবে। |
| Your account does not have access to these files (403) | সাইন-ইন করা অ্যাকাউন্টের ওই ফোল্ডারে access নেই, অথবা `Files.Read.All` grant হয়নি। |
| The folder or file was not found (404) | `ONEDRIVE_FOLDER_PATH` ভুল। OneDrive root থেকে পাথ, যেমন `Dashboard` বা `Reports/Planning`। |
| No workbook matching ... was found | ফোল্ডারে আছে কিন্তু নাম প্যাটার্নে মিলছে না। মেসেজে ফোল্ডারের ফাইলের নাম দেখাবে। |
| popup blocked | ব্রাউজার popup আটকেছে। ঠিকানা বারের ডানে popup allow করুন, আবার Sign in চাপুন। |

**Sign out** চাপলে ব্রাউজারের ক্যাশও মুছে যায়, তাই অন্য কেউ একই কম্পিউটারে
সাইন ইন করলে আগের ডেটা দেখবে না।

---

## ড্যাশবোর্ডে কী আছে

আগের সংস্করণের সবকিছু, একই কোড: সাতটা ট্যাব, ২০+ চার্ট, সাপ্তাহিক KPI রিপোর্ট
কেজি পর্যন্ত মিলিয়ে, Day/Week/Month সুইচ, সব ফিল্টার। শুধু ডেটা আসার পথটা বদলেছে।

ব্রাউজারের ভিতরে ওয়ার্কবুক পড়ার কোডটা Python exporter থেকে নিয়ম ধরে ধরে পোর্ট
করা, আর আপনার আসল দুটো ফাইল দিয়ে মিলিয়ে দেখা: Delivery, LockPlan, RFD আর
LockMeta তে শূন্য পার্থক্য, EWO শিটে শুধু Excel এর `#VALUE!` ঘরগুলো খালি হিসেবে
আসে, যেটা ড্যাশবোর্ডে একই অর্থ বহন করে।

**fab শিটের ভুলটা এখানেও ধরা পড়বে না।** এই সংস্করণও fab আর Sew গ্রিড পড়ে না,
EWO শিট থেকে নিজে হিসাব করে, তাই ওই চার সারির ভুল (271300, 271302, 271310,
271348) ড্যাশবোর্ডে ঢোকে না।
