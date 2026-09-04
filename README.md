# Future Nurse Creator 🩺✨
### AI เห็นฉันเป็นพยาบาลแบบไหน?
**Interactive Kiosk PWA for NSMU Open House 2026 — Faculty of Nursing, Mahidol University**

---

## 🌟 Overview
**Future Nurse Creator** is a client-side first, portrait-optimized Progressive Web Application (PWA) tailored for **iPad Kiosk Mode** at NSMU Open House 2026. Participants answer 3 questions to discover their **Nursing Path**, **Nursing Superpower**, and **AI Skill**, receiving a high-resolution 9:16 downloadable **Future Nurse Card** (1080×1920 px) with QR code hand-off for instant mobile saving and social sharing at **zero server cost per play**.

---

## 🏗️ Architecture & Stack
- **Frontend / PWA**: React 18, TypeScript, Tailwind CSS, Vite
- **Deployment**: Cloudflare Pages (Static SPA)
- **Offline / Caching**: Vite PWA / Workbox Service Worker
- **Scoring Engine**: 100% Deterministic rule-based scoring (512 permutations verified)
- **Card Generation**: Client-side HTML5 Canvas 2D Engine (1080×1920 PNG export)
- **State Hand-off**: URL Hash State Compression (`/#result=...`) for QR mobile sync without a backend database
- **Testing & Tooling**: Python 3 Automated Test Suite & Data Integrity Validator

---

## 🎯 8 Nursing Paths & Rules
1. 👶 **Pediatric Nursing** — การพยาบาลเด็ก
2. 🧠 **Mental Health Nursing** — การพยาบาลสุขภาพจิตและจิตเวช
3. 🚑 **Emergency Nursing** — การพยาบาลอุบัติเหตุและฉุกเฉิน
4. 👵 **Older Adult Nursing** — การพยาบาลผู้สูงอายุ
5. 🤱 **Maternal & Newborn Nursing** — การพยาบาลมารดา ทารกแรกเกิด และการผดุงครรภ์
6. 🏘️ **Community Nursing** — การพยาบาลชุมชน
7. 🌏 **International Nursing** — การพยาบาลระดับสากลและสุขภาวะโลก
8. 💻 **Nursing + Technology** — นวัตกรรมและเทคโนโลยีทางการพยาบาล

---

## 🚀 Quick Start & Development

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```

### 3. Run automated tests & validation
```bash
# Validate all JSON schemas, messages, and reachability
npm run validate

# Run exhaustive 512 combination scoring test
npm run test
```

### 4. Build for Production (Cloudflare Pages)
```bash
npm run build
```
Output directory: `dist/`

---

## 📱 iPad Kiosk Setup Instructions
1. Open the deployed Cloudflare Pages URL on Safari on the iPad.
2. Tap the **Share** button in Safari $\rightarrow$ tap **Add to Home Screen**.
3. Open the app from the Home Screen (runs in fullscreen standalone PWA mode with no browser bars).
4. *(Optional)* Enable **Guided Access** in iOS Settings (`Settings > Accessibility > Guided Access`) to lock the iPad into kiosk mode.
5. Inactivity auto-reset will automatically monitor touches, popping a 15s warning at 45s of inactivity and resetting back to the Welcome screen at 60s.

---

## 📁 Project Structure
```text
├── src/
│   ├── data/                 # Single Source of Truth
│   │   ├── paths.json        # 8 Nursing Paths metadata
│   │   ├── questions.json    # Q1, Q2, Q3 (8 options each)
│   │   ├── scoring.json      # Scoring weights & tie-breaker rules
│   │   ├── ai-skills.json    # Path + Superpower AI skills
│   │   └── messages.json     # 64 personalized combination messages
│   ├── engine/
│   │   ├── scoringEngine.ts  # Deterministic scoring algorithm
│   │   ├── cardRenderer.ts   # 1080x1920 Canvas 2D card generator
│   │   ├── stateCompressor.ts# URL hash state compressor for QR
│   │   └── idleManager.ts    # 45s/60s Kiosk idle reset timer
│   ├── views/
│   │   ├── WelcomeView.tsx
│   │   ├── CharacterSelectView.tsx
│   │   ├── QuizView.tsx       # 2x4 Touch grid for iPad
│   │   ├── AnalysisView.tsx   # 2.5-3s Discovery animation
│   │   ├── ResultView.tsx     # Kiosk Card + QR modal
│   │   └── MobileResultView.tsx# Mobile Save/Share/Caption
│   ├── components/
│   │   ├── Header.tsx
│   │   └── IdleModal.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   ├── validate_data.py      # JSON schema integrity validator
│   └── generate_messages.py  # Message permutation generator
└── tests/
    └── test_scoring.py       # Exhaustive 512 combination test
```

---

## 🏷️ Social Sharing & Official Hashtags
```text
My Future Nursing Path is Pediatric Nursing 👶
ค้นพบ Future Nurse ในแบบของฉันที่ NSMU Open House 2026

#NSMUOPENHOUSE2026 #NURSESOFTHELAND #NSMUTCAS70 #MahidolNursing #คณะพยาบาลศาสตร์มหิดล
```
