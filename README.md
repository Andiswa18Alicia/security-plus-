# Security+ SY0-701 Learning Platform — Setup Guide
## Mido Academy

---

## 📁 Project Files

```
your-repo/
├── index.html          ← Main learning platform (rename secplus_complete_platform.html)
├── login.html          ← Login / Register page
├── firebase-config.js  ← Firebase config reference (values go directly in HTML files)
└── README.md           ← This file
```

---

## 🔥 Step 1 — Create a Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"**
3. Name it: `mido-secplus` (or anything you like)
4. Disable Google Analytics (not needed) → **Create project**

---

## 🔑 Step 2 — Enable Authentication

1. In your Firebase project, click **Authentication** (left sidebar)
2. Click **"Get started"**
3. Under **Sign-in method**, enable **Email/Password**
4. Click **Save**

> Students will register with their `@midoacademy.org.za` email addresses.
> The platform enforces this domain restriction automatically.

---

## 🗄️ Step 3 — Create Firestore Database

1. Click **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select your region (e.g. `europe-west1` for South Africa proximity)
5. Click **Enable**

### Set Firestore Security Rules

In Firestore → **Rules** tab, paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own progress document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish**.

> This rule ensures each student can only see and modify their own progress — not others'.

---

## ⚙️ Step 4 — Get Your Firebase Config

1. In Firebase project overview, click the **web icon** (`</>`)
2. Register your app (name: `secplus-platform`)
3. **Do NOT** enable Firebase Hosting (you're using Vercel)
4. Copy the `firebaseConfig` object — it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mido-secplus.firebaseapp.com",
  projectId: "mido-secplus",
  storageBucket: "mido-secplus.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 📝 Step 5 — Add Config to Your Files

You need to paste your Firebase config in **TWO places**:

### In `login.html` — find this section and replace:
```javascript
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",        // ← replace
  authDomain:        "YOUR_PROJECT_ID...",  // ← replace
  projectId:         "YOUR_PROJECT_ID",     // ← replace
  storageBucket:     "YOUR_PROJECT_ID...",  // ← replace
  messagingSenderId: "YOUR_MESSAGING...",   // ← replace
  appId:             "YOUR_APP_ID"          // ← replace
};
```

### In `index.html` — find the same section (near the top of the `<script type="module">` block) and replace the same values.

---

## 🚀 Step 6 — Deploy to Vercel

Since you already have GitHub connected to Vercel:

1. **Rename** `secplus_complete_platform.html` → `index.html`
2. Push all three files to your GitHub repo:
   ```
   index.html
   login.html
   README.md
   ```
3. Vercel auto-deploys — your platform is live!

---

## 👨‍🎓 How Students Use It

1. Visit your Vercel URL
2. They are redirected to `login.html` automatically
3. First time: click **REGISTER**, enter `name@midoacademy.org.za` + password
4. Non-academy emails are rejected with an error message
5. After login, they are redirected to the platform
6. **Progress saves automatically to Firestore** after every quiz
7. Progress persists across devices — student can continue on any device

---

## 🔒 Security Notes

- Only `@midoacademy.org.za` email addresses can register (enforced client-side + Firestore rules)
- Each student's progress is stored in their own Firestore document (`users/{uid}`)
- Students cannot access each other's data (Firestore rules enforce this)
- Passwords are managed by Firebase Authentication (secure, hashed by Google)
- To **create accounts for students manually**: Firebase Console → Authentication → Add user

---

## 📊 View Student Progress (Admin)

In Firebase Console → **Firestore Database** → `users` collection:
- Each document = one student
- Document ID = Firebase UID
- Fields: `email`, `progress` (all 18 topic scores), `lastUpdated`

You can export this data or build an admin dashboard later.

---

## 🆘 Troubleshooting

| Problem | Solution |
|---|---|
| "Only @midoacademy.org.za allowed" | Student must use their academy email |
| Progress not saving | Check Firebase config values are correctly copied |
| Blank page / redirect loop | Clear browser cache, check console for errors |
| Firebase config error | Verify all 6 config values are correctly pasted |
| Can't register | Check Authentication is enabled in Firebase Console |

---

## 📧 To Reset a Student Password

Firebase Console → Authentication → find the student email → click ⋮ → **Reset password**

Or the student can use the **"Forgot password?"** link on the login page.
