# Mentor.mn: National Academic Mentorship & Intelligence Infrastructure

> **An institutional civic-tech ecosystem designed to dismantle educational disparity across Mongolia.**  
> Backed by the Ministry of Education & Science standards, Mentor.mn replaces passive, outdated classroom lectures with proven students who guide younger peers through focused 1–3 week sprint classes, producing verified deliverables and earning Ministry-accredited formal credentials.

---

## 🏛️ Key Architectural Pillars

### 1. Unified Dual-Identity Network (Learners & Mentors in One)
There are no rigid silos separating "tutors" from "students". Any student can learn a subject they struggle with and teach a subject they have mastered:
- **Demographics & Alignment**: Location across 21 Aimags & Ulaanbaatar, Grade (9–12 & University), School, Specializations, and Learning Goals.
- **Dual Workspace**:
  - **My Learning**: Enrolled sprint classes, active deliverables, and graduation status.
  - **My Mentoring**: Classes taught, seat management, deliverable evaluations, and formal tier progression.

### 2. Flexible Sprint Classes (1 to 10 Seats)
- **Customizable Capacity**: Mentors choose 1-on-1 intensive, 2–3 student micro-pods, or 4–10 student small cohorts.
- **Time-Bound Sprints**: High-urgency 1 to 3-week durations with scheduled meeting links (Google Meet/Zoom).
- **Dual Enrollment**: Students browse open seats or use auto-grouping to match into open cohorts.

### 3. Deliverable-Gated Anti-Gaming Engine
- Progression requires tangible **Artifacts of Learning** (e.g. working codebases, solved proof sets, lab reports).
- Zero time-farming: Hours are only credited when deliverables are formally reviewed and certified by mentors.

### 4. Formal 4-Tier Progression Hierarchy
Mentors advance through formal academic tiers recognized on Ministry certificates:
- **Tier 1: Junior Mentor** (*Дагалдан Ментор*)
- **Tier 2: Senior Mentor** (*Ахлах Ментор*)
- **Tier 3: Master Mentor** (*Мастер Ментор*)
- **Tier 4: National Laureate Mentor** (*Үндэсний Лауреат Ментор*)

### 5. Cryptographic SHA-256 Verifiable Credentials
- Every certificate features a tamper-proof SHA-256 digital signature and QR verification link (`/verify/[id]`).
- Admissions boards, universities, and ministry officials can instantly verify hours, student counts, and authenticity.

### 6. The Self-Sustaining Knowledge Flywheel
When a student's deliverable is certified, they receive the **Pay-It-Forward** invitation: *"You have mastered this sprint. Ready to open your own class and teach 1–3 younger peers?"*

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node.js v22)
- npm or pnpm

### Installation

```bash
# Clone repository
git clone git@github.com:mentormn/mentor.git
cd mentor

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧭 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx               # National Platform Landing Page & Live Flywheel Stats
│   │   ├── classes/
│   │   │   ├── page.tsx           # Sprint Classes Directory & Seat Claiming
│   │   │   └── create/page.tsx    # Mentor Class Creation Wizard (1-10 seats, dates)
│   │   ├── class/[id]/page.tsx    # Active Class Space (Video link, Deliverable submission/review)
│   │   ├── profile/page.tsx       # Dual-Identity Profile ("My Learning" & "My Mentoring")
│   │   ├── verify/[id]/page.tsx   # Public SHA-256 Certificate Verification Portal
│   │   ├── ministry/audit/page.tsx# Ministry Provincial Telemetry Audit
│   │   ├── layout.tsx             # Root layout with institutional navigation & branding
│   │   └── globals.css            # Tailwind design system tokens
│   ├── components/
│   │   ├── Navbar.tsx             # Institutional navigation with dual-profile pill
│   │   └── Footer.tsx             # Accreditation notice & formal tier legend
│   └── lib/
│       ├── types/index.ts         # TypeScript models for users, classes, deliverables, certs
│       ├── engine/
│       │   ├── tierProgression.ts # 4-tier formal leveling logic & XP calculations
│       │   └── certificate.ts     # SHA-256 cryptographic generator & validator
│       ├── mockData.ts            # Realistic seed data across UB and 21 Aimags
│       └── store.ts               # Client store with localStorage persistence
```

---

## 📜 License
Developed for the youth and educational advancement of Mongolia.
All rights reserved © 2026 Mentor.mn.
