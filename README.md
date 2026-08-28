# JobEase - Intelligent Job Application Autofill Assistant

**JobEase** is an intelligent, user-controlled job application autofill system designed to reduce repetitive form filling while adhering to strict safety and privacy guardrails.

---

## 🌟 Core Principles & Guardrails

1. **NEVER Auto-Submit**: JobEase fills form fields for user review. Final submission is ALWAYS performed manually by the user.
2. **Review-First Architecture**: Features a floating review overlay that categorizes fields into High Confidence (✓), Needs Confirmation (⚠), and Unknown Questions (?).
3. **Sensitive Field Protection**: Critical questions (work authorization, legal status, disability accommodations, demographics) are NEVER guessed or automatically filled without explicit prior consent.
4. **No Anti-Bot Bypassing**: CAPTCHA and anti-bot mechanisms are completely respected and never bypassed.

---

## 🏗 System Architecture

```text
jobease/
├── apps/
│   ├── web/                 # React + Vite + TypeScript + Tailwind CSS User Dashboard
│   ├── api/                 # Node.js + Express + TypeScript + MongoDB (JWT & bcrypt)
│   └── extension/           # Manifest V3 Chrome Extension (React popup, Content Scripts, Service Worker)
│
├── packages/
│   ├── shared-types/        # Shared TypeScript interfaces for models and API payload contracts
│   └── field-engine/        # 3-Layer Field Matching Pipeline (Rule, Semantic, AI Fallback Classifier)
│
├── docker-compose.yml       # Local MongoDB container setup
├── package.json             # Workspace monorepo root
└── README.md
```

### 3-Layer Field Matching Pipeline (`@jobease/field-engine`)

```text
[ Detect Form Fields ]
          │
          ▼
┌───────────────────────────┐
│ Layer 1: Rule Matching    │ ──(Match Found)──► Confidence >= 0.90 ──► AUTO FILL
└───────────────────────────┘
          │ (No match)
          ▼
┌───────────────────────────┐
│ Layer 2: Semantic Match   │ ──(Custom Q&A / Synonym Match)──► 0.65 <= Conf < 0.90 ──► SUGGEST & CONFIRM
└───────────────────────────┘
          │ (Low confidence)
          ▼
┌───────────────────────────┐
│ Layer 3: AI Classifier    │ ──(Field Intent & Sensitivity Check)──► ASK USER
└───────────────────────────┘                                           │
                                                                        ▼
                                                             "Remember this answer?"
                                                                        │ (Yes)
                                                                        ▼
                                                             [ Save Custom Answer ]
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm / pnpm
- MongoDB (Running locally on port `27017` or via Docker Compose)

---

### Step 1: Install Dependencies

From the workspace root directory:

```bash
npm install
```

---

### Step 2: Start Local MongoDB

Using Docker Compose:

```bash
docker-compose up -d
```

Or ensure local MongoDB is running on `mongodb://localhost:27017/jobease`.

---

### Step 3: Run Backend API & Web Application

Open terminal windows or run:

```bash
# Terminal 1: Run Node.js API (Port 5000)
npm run dev:api

# Terminal 2: Run React Web Dashboard (Port 5173)
npm run dev:web
```

Access the Web Dashboard at: `http://localhost:5173`

---

### Step 4: Build & Load Chrome Extension

```bash
# Build the Chrome Extension dist bundle
npm run dev:extension
```

To load into Google Chrome:
1. Open `chrome://extensions/` in Google Chrome.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked**.
4. Select the directory: `jobease/apps/extension/dist`.

---

## 🧪 Testing the Field Matching Engine

Run the Vitest unit test suite covering deterministic rule matching, semantic matching, custom answer fallback, and sensitivity guardrails:

```bash
npm test
```

---

## 📋 Supported Field Types

- Text Inputs (`<input type="text">`, `<input type="email">`, `<input type="tel">`)
- Textareas (`<textarea>`)
- Native Select Dropdowns (`<select>`)
- Radio Button Groups (`<input type="radio">`)
- Checkbox Groups (`<input type="checkbox">`)
- React-controlled inputs (handled via native prototype value setter and synthetic input/change event dispatching)

---

## 🛡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate and obtain JWT token
- `GET /api/auth/me` - Fetch authenticated user

### Profile Management
- `GET /api/profile` - Fetch full user profile & completeness percentage
- `PUT /api/profile` - Update profile sections (Personal, Education, Experience, Projects, Skills, Preferences)

### Custom Q&A
- `GET /api/custom-answers` - Fetch saved custom answers
- `POST /api/custom-answers` - Create a new custom answer
- `DELETE /api/custom-answers/:id` - Delete a custom answer

### Field Engine API
- `POST /api/fields/match` - Batch match detected fields against user profile and custom Q&A answers
- `POST /api/fields/classify` - Classify individual field intent using AI classifier fallback
