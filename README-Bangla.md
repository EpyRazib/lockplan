# EWO ড্যাশবোর্ড, Microsoft সাইন-ইন সংস্করণ, Epyllion অ্যাকাউন্টে (বাংলা)

**যেভাবে কাজ করে:** পেজ খুললে Epyllion এর Microsoft সাইন ইন চাইবে। সাইন ইন হলে
ব্রাউজার নিজেই Microsoft Graph দিয়ে আপনার Epyllion OneDrive এর `Dashboard` ফোল্ডার
থেকে দুটো ওয়ার্কবুক নামিয়ে পড়ে ড্যাশবোর্ড দেখাবে। মাঝখানে কিছু নেই: GitHub Action
নেই, Cloudflare worker নেই, `data.json` নেই, ফাইলের কোনো পাবলিক লিংক নেই।

**যা পাবেন:** শুধু Epyllion অ্যাকাউন্ট দিয়ে ঢোকা যাবে, আর যাকে আপনি ফোল্ডারটা শেয়ার
করেছেন শুধু সে দেখতে পাবে। Excel এ সেভ করার সাথে সাথেই ড্যাশবোর্ডে চলে আসবে।

**যা লাগবে:** Epyllion এর Azure directory তে app registration এ **admin consent**।
এটাই একমাত্র বাধা, বাকি সব তৈরি।

---

## এই ফোল্ডারে কী আছে

```
index.html         ড্যাশবোর্ড, সাইন-ইন সহ
config.js          আপনার সেটিং, Epyllion এর tenant ID আর ফাইলের পথ বসানো আছে, client ID বসাবেন
README-Bangla.md   এই গাইড
```

আলাদা একটা git repository তে রাখুন। আগের ড্যাশবোর্ড যেমন আছে তেমনই চলবে।

---

## ধাপ ১: ফাইল দুটো Epyllion OneDrive এ রাখুন

1. আপনার অফিসের OneDrive (`OneDrive - EPYLLION GROUP`) এর root এ `Dashboard` নামে
   ফোল্ডার বানান।
2. `EWO Life Cycle 2026-27.xlsx` আর `Fabric Delivery 2026-27_LockPlan.xlsx` ওখানে
   রাখুন। এখন থেকে এই কপিতেই কাজ হবে।
3. যারা ড্যাশবোর্ড দেখবেন, ফোল্ডারটা তাদের সাথে **Share** করুন, "Can view" যথেষ্ট।
   কোনো পাবলিক লিংক লাগবে না। যাকে শেয়ার করেননি সে সাইন ইন করলেও কিছু দেখবে না।

ফোল্ডারের নাম অন্য কিছু দিলে `config.js` এ `ONEDRIVE_FOLDER_PATH` বদলে নেবেন।

## ধাপ ২: app registration

আপনি Epyllion directory তে **Dashboard** নামে app বানিয়েছেন, ওটাই ব্যবহার হবে।
portal.azure.com এ **Microsoft Entra ID → App registrations → Dashboard → Overview**
থেকে **Application (client) ID** কপি করে `config.js` এ `CLIENT_ID` তে বসান।

**Redirect URI**

Authentication পাতায় SPA platform এ `https://epyrazib.github.io/lockplan/index.html`
আগেই আছে। `config.js` এর `REDIRECT_URI` ও হুবহু ওটাই। repository র নাম বদলালে
দুই জায়গাতেই বদলাবেন।

**Permission ঠিক করুন, admin যেভাবে চেয়েছেন**

admin `Files.Read.All` এর বদলে **`Files.SelectedOperations.Selected`** চেয়েছেন। এটা
সবচেয়ে সংকীর্ণ permission: app শুধু সেই ফাইলগুলোই দেখতে পাবে যেগুলো আলাদা করে
grant করা হয়েছে, আর কিছু না। কোড আর `config.js` সেভাবেই বদলে দেওয়া আছে।

1. app এর পাতায় **API permissions**।
2. `Files.Read.All` এর ডান পাশে **...** → **Remove permission**।
3. **Add a permission → Microsoft Graph → Delegated permissions**। সার্চে লিখুন
   `SelectedOperations`, টিক দিন **`Files.SelectedOperations.Selected`**, **Add permissions**।
4. থাকা উচিত ঠিক দুটো: `User.Read` আর `Files.SelectedOperations.Selected`।

## ধাপ ৩: admin consent, তারপর ফাইল দুটো app কে grant করুন

এই permission এ **তিনটা** ধাপ লাগে, একটাও বাদ গেলে চলবে না:

1. admin **Grant admin consent for Epyllion Group** চাপবেন (আপনার app এর API
   permissions পাতায়)।
2. আপনি, ফাইলের মালিক হিসেবে, প্রতিটা ফাইলে app কে **read** অধিকার দেবেন (নিচে)।
3. ড্যাশবোর্ড সাইন ইনের সময় ওই scope চাইবে (কোডে করা আছে)।

**ফাইল grant করার ধাপ, Graph Explorer দিয়ে**

আমাদের দুটো ফাইল, তাই POST দুইবার। Drive ID লাগবে না, `/me/drive/items/...` পথটাই চলে।

1. `https://developer.microsoft.com/graph/graph-explorer` খুলে **Sign in** করুন,
   Epyllion অ্যাকাউন্ট দিয়ে।
2. বাঁ পাশে **Modify permissions** ট্যাবে `Files.ReadWrite` খুঁজে **Consent** দিন।
   POST করতে এটুকু লাগে। এখানে "needs admin approval" এলে admin কে Graph Explorer
   এ ওই consent দিতে বলবেন, অথবা admin নিজে নিচের POST গুলো চালাবেন।
3. প্রথম ফাইলের ID: method **GET**, ঠিকানা:

   ```
   https://graph.microsoft.com/v1.0/me/drive/root:/Dashboard/EWO Life Cycle 2026-27.xlsx
   ```

   **Run query**। উত্তরে `"id": "01ABC..."` টা কপি করুন।

4. method **POST**, ঠিকানা (ওই id বসিয়ে):

   ```
   https://graph.microsoft.com/v1.0/me/drive/items/01ABC.../permissions
   ```

   **Request body** ট্যাবে (আপনার app এর client ID বসিয়ে):

   ```json
   {
     "grantedToV2": {
       "application": {
         "id": "এখানে Dashboard app এর Application (client) ID"
       }
     },
     "roles": ["read"]
   }
   ```

   **Run query**। উত্তর **201 Created** আর ভিতরে `"roles": ["read"]`,
   `"displayName": "Dashboard"` এলে হয়ে গেছে।

5. দ্বিতীয় ফাইলের জন্য ৩ আর ৪ আবার, ঠিকানায়:

   ```
   https://graph.microsoft.com/v1.0/me/drive/root:/Dashboard/Fabric Delivery 2026-27_LockPlan.xlsx
   ```

**বিকল্প, এক POST এ দুটোই: ফোল্ডারটা grant করুন**

Microsoft এর ডকুমেন্টেশন অনুযায়ী grant টা ফোল্ডারে দিলে ভিতরের ফাইলগুলোতেও খাটে
(inheritance)। তাহলে ধাপ ৩ এ `.../root:/Dashboard` দিয়ে ফোল্ডারের id নিয়ে একবার
POST করলেই দুটো ফাইল, আর ভবিষ্যতে ওই ফোল্ডারে রাখা নতুন ফাইলও, চলে আসবে।
এই পথ নিলে `config.js` এ `EWO_FILE_PATH` আর `DELIVERY_FILE_PATH` **খালি** করে দিন,
তখন ড্যাশবোর্ড ফোল্ডার তালিকা করে নাম দেখে ফাইল চিনে নেবে। admin যদি নির্দিষ্ট
ফাইলেই সীমাবদ্ধ রাখতে চান, তাহলে উপরের প্রতি-ফাইল পথটাই থাকুক।

**ফাইল বদলালে বা নতুন করে আপলোড করলে**

grant টা ফাইলের সাথে থাকে। OneDrive এ একই ফাইল **সেভ** করলে grant থাকে। কিন্তু
ফাইল মুছে **নতুন ফাইল আপলোড** করলে সেটা নতুন item, grant হারাবে, আবার POST করতে
হবে। ফোল্ডার grant নিলে এই ঝামেলা নেই।

## ধাপ ৪: config.js মিলিয়ে নিন

```javascript
  CLIENT_ID: "",                                        // Dashboard app এর Application (client) ID বসান
  TENANT_ID: "09438fa4-a67e-4666-a9c2-fcc1c2252472",   // Epyllion Group
  REDIRECT_URI: "https://epyrazib.github.io/lockplan/index.html",
  GRAPH_SCOPES: ["User.Read", "Files.SelectedOperations.Selected"],
  ONEDRIVE_OWNER: "razib.hossain@epylliongroup.com",
  EWO_FILE_PATH: "Dashboard/EWO Life Cycle 2026-27.xlsx",
  DELIVERY_FILE_PATH: "Dashboard/Fabric Delivery 2026-27_LockPlan.xlsx",
```

ফাইলের নাম OneDrive এ হুবহু এই রকম কিনা মিলিয়ে নেবেন, স্পেস আর হাইফেন সহ। নাম
আলাদা হলে এখানে বদলান। `ONEDRIVE_OWNER` ভুল হলে "folder or file was not found"
আসবে।

## ধাপ ৫: GitHub এ দিন

1. নতুন repository বানান। Public রাখলেও সমস্যা নেই, পেজে কোনো ডেটা নেই।
2. `index.html` আর `config.js` root এ আপলোড করুন।
3. **Settings → Pages** → Deploy from a branch, `main`, `/ (root)`, Save।
4. Pages যে ঠিকানা দেয় সেটা ধাপ ২ এর Redirect URI র সাথে **হুবহু** মিলছে কিনা,
   শেষের `/` সহ, মিলিয়ে নিন।

## ধাপ ৬: খুলে সাইন ইন করুন

**Sign in with Microsoft** চাপুন, Epyllion অ্যাকাউন্ট বাছুন।

- consent দেওয়া না থাকলে এখানেই "needs admin approval" আসবে। ওটাই ধাপ ৩।
- consent থাকলে: **Finding the workbooks → Downloading → Reading the sheets**।
  প্রথমবার ১০ থেকে ১৫ সেকেন্ড, ১৭ মেগাবাইট নামে।
- পরের বার থেকে ফাইল না বদলালে ব্রাউজারের ক্যাশ থেকে এক সেকেন্ডের কমে খোলে।
- খোলা পেজ প্রতি ৫ মিনিটে দেখে ফাইল বদলেছে কিনা। **Refresh** চাপলে সাথে সাথে।
- উপরে ডানে কার অ্যাকাউন্ট, আর **Sign out**।

---

## consent পাওয়ার আগে নিজে পরীক্ষা করতে চাইলে

Epyllion এর consent ছাড়া এই সংস্করণ Epyllion অ্যাকাউন্টে চলবে না। তার আগে পুরো
পথটা নিজে দেখতে চাইলে:

1. `azure.microsoft.com/free` এ ব্যক্তিগত Gmail দিয়ে Azure free account খুলুন।
   কার্ড চায়, টাকা কাটে না। নিজের একটা directory পাবেন যার আপনিই admin।
2. ওখানে app বানান, Supported account types এ **personal Microsoft accounts** allow
   করে, Delegated `Files.Read` আর `User.Read`, নিজেই Grant admin consent।
   ব্যক্তিগত অ্যাকাউন্টে Selected permission নেই, তাই `config.js` এ সাময়িকভাবে
   `GRAPH_SCOPES: ["User.Read", "Files.Read"]` আর `EWO_FILE_PATH: ""` দেবেন।
3. `config.js` এ ওই client ID, `TENANT_ID: "common"`, `ONEDRIVE_OWNER: ""`, আর
   ফাইল দুটো ব্যক্তিগত OneDrive এর `Dashboard` ফোল্ডারে (ওখানে এখনো আছে)।

পরীক্ষা শেষে `config.js` আবার Epyllion এর মানে ফিরিয়ে দিলেই হবে।

---

## সমস্যা হলে

| যা দেখবেন | কারণ ও সমাধান |
|---|---|
| "needs admin approval", `AADSTS65001`, `AADSTS90094` | consent দেওয়া হয়নি। ধাপ ৩। |
| popup খুলেই বন্ধ, `AADSTS50011` | Redirect URI মেলেনি। Authentication পাতায় ঠিক Pages ঠিকানাটা, শেষের `/` সহ, SPA platform এ আছে কিনা দেখুন। |
| `AADSTS50020`, "account does not exist in tenant" | ব্যক্তিগত অ্যাকাউন্ট দিয়ে ঢোকার চেষ্টা। Epyllion অ্যাকাউন্ট দিয়ে ঢুকুন। |
| `AADSTS700016`, "application not found" | CLIENT_ID ভুল, বা app টা অন্য directory তে। |
| Access refused (403) | তিনটার একটা: admin consent হয়নি, ফাইলে app কে read grant করা হয়নি (ধাপ ৩ এর POST), অথবা সাইন-ইন করা ব্যক্তিকে ফাইল/ফোল্ডার শেয়ার করা হয়নি। |
| The folder or file was not found (404) | `ONEDRIVE_OWNER` এর ইমেইল বা `ONEDRIVE_FOLDER_PATH` ভুল। |
| No workbook matching ... was found | ফোল্ডারে আছে কিন্তু নামে "EWO Life Cycle" বা "Fabric Delivery" নেই। মেসেজে ফোল্ডারের ফাইলের নাম দেখাবে। |
| The Microsoft sign-in library did not load | অফিসের নেট বা ad-blocker `cdn.jsdelivr.net` আটকাচ্ছে। |
| popup blocked | ঠিকানা বারের ডানে popup allow করে আবার Sign in। |

**Sign out** চাপলে ব্রাউজারের ক্যাশও মুছে যায়।

---

## ড্যাশবোর্ডে কী আছে

আগের সংস্করণের সবকিছু, একই কোড: সাতটা ট্যাব, ২০+ চার্ট, সাপ্তাহিক KPI রিপোর্ট
কেজি পর্যন্ত মিলিয়ে, Day/Week/Month সুইচ, সব ফিল্টার। শুধু ডেটা আসার পথ বদলেছে।

ব্রাউজারে ওয়ার্কবুক পড়ার কোড Python exporter থেকে নিয়ম ধরে ধরে পোর্ট করা, আর
আপনার আসল দুটো ফাইল দিয়ে ঘর ধরে ধরে মিলিয়ে দেখা। fab শিটের ওই চার সারির ভুল
এখানেও ড্যাশবোর্ডে ঢোকে না, কারণ fab আর Sew গ্রিড পড়া হয় না, EWO শিট থেকে হিসাব হয়।
