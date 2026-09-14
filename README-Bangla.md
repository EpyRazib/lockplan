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
config.js          আপনার সেটিং, Epyllion এর tenant ID আর আগের app এর client ID বসানো আছে
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

আপনি আগেই Epyllion directory তে একটা app বানিয়েছিলেন (client ID `f52fc87b-…`,
`config.js` এ বসানো আছে)। ওটাই ব্যবহার করুন, নতুন বানানোর দরকার নেই। অফিসের
অ্যাকাউন্টে portal.azure.com এ ঢুকে **Microsoft Entra ID → App registrations →
All applications** এ ওটা পাবেন।

নতুন বানাতে চাইলে **New registration**, নাম `EWO Dashboard`, Supported account
types এ **Accounts in this organizational directory only (Epyllion Group)**।
তারপর Overview থেকে নতুন Application (client) ID টা `config.js` এ বসাবেন।

**Redirect URI ঠিক করুন**

1. app এর পাতায় **Authentication**।
2. **Add a platform → Single-page application**।
3. Redirect URI তে নতুন repository র GitHub Pages ঠিকানা, **শেষে `/` সহ**, যেমন
   `https://epyrazib.github.io/ewo-dashboard/`।
4. **Configure**। আগের app এ পুরনো ঠিকানা (`.../4P/`) থাকলে ওটা রেখে দিলেও ক্ষতি নেই।

**Permission ঠিক করুন**

1. app এর পাতায় **API permissions**।
2. আগের app এ যা আছে তা দেখুন। থাকা উচিত শুধু:
   - Microsoft Graph, Delegated: **`Files.Read.All`**
   - Microsoft Graph, Delegated: **`User.Read`**
3. অন্য কিছু থাকলে (যেমন `Sites.Read.All`) মুছে দিন। যত কম চাইবেন, admin তত সহজে
   দেবেন। না থাকলে **Add a permission → Microsoft Graph → Delegated** থেকে যোগ করুন।

`Files.Read.All` কেন, শুধু `Files.Read` নয়: `Files.Read` দিয়ে একজন শুধু নিজের
OneDrive পড়তে পারে। তাহলে ড্যাশবোর্ড শুধু আপনিই দেখতে পারতেন। সহকর্মীরা আপনার
ফোল্ডার পড়তে পারবেন `Files.Read.All` দিয়ে, আর তাতেও SharePoint এর শেয়ারিং
নিয়মই খাটে, যাকে শেয়ার করেননি সে পাবে না। দুটোই **read-only**।

## ধাপ ৩: admin consent

এটাই আগে আটকেছিল। app এর **API permissions** পাতায় **Grant admin consent for
Epyllion Group** বোতামটা admin এর অ্যাকাউন্ট থেকে চাপতে হবে।

admin কে ঠিক এই কথাগুলো বললে কাজ দ্রুত হয়:

> App: `EWO Dashboard`, client ID `f52fc87b-2ce5-404d-aab3-acb90675308c`।
> ধরন: Single-page application, শুধু Epyllion Group অ্যাকাউন্ট।
> চাওয়া permission: Microsoft Graph **Delegated** `Files.Read.All` আর `User.Read`।
> দুটোই read-only, delegated মানে app নিজে কিছু পড়ে না, সাইন-ইন করা ব্যক্তি যা
> এমনিতেই পড়তে পারেন সেটাই পড়ে। কোনো Application permission নেই, কোনো
> client secret নেই, কোনো লেখার permission নেই।

Entra তে "admin consent request" চালু থাকলে আপনি সাইন ইন করার সময় নিজেই
**Request approval** চাপতে পারবেন, admin এর কাছে notification যাবে।

## ধাপ ৪: config.js মিলিয়ে নিন

```javascript
  CLIENT_ID: "f52fc87b-2ce5-404d-aab3-acb90675308c",   // নতুন app বানালে বদলাবেন
  TENANT_ID: "09438fa4-a67e-4666-a9c2-fcc1c2252472",   // Epyllion Group
  ONEDRIVE_OWNER: "razib.hossain@epylliongroup.com",   // আপনার অফিসের ইমেইল, যার OneDrive এ ফোল্ডার
  ONEDRIVE_FOLDER_PATH: "Dashboard",
```

`ONEDRIVE_OWNER` এ আপনার অফিসের ইমেইলটা ঠিক আছে কিনা দেখে নেবেন। ভুল হলে
"folder or file was not found" আসবে।

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
   করে, Delegated `Files.Read.All` আর `User.Read`, নিজেই Grant admin consent।
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
| Your account does not have access to these files (403) | সাইন-ইন করা ব্যক্তিকে ফোল্ডারটা শেয়ার করা হয়নি, অথবা `Files.Read.All` grant হয়নি। |
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
