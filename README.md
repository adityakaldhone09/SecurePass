# SecurePass — Intelligent Password Security & Cryptographic Analyzer
> **Apple-Inspired Cybersecurity Platform | Liquid Glass Aesthetics | Advanced Motion Design**

SecurePass is an enterprise-grade password security analyzer, cryptographic generator, and breach intelligence platform built with a **React 19 + TypeScript + Vite + Tailwind CSS v4** frontend and a high-performance **FastAPI** backend.

---

## 🌟 Key Highlights

- **Apple-Inspired Liquid Glass Design Language:**
  Translucent surfaces, frosted glass panels with specular highlights (`backdrop-blur-2xl`), ambient gradient orbs, and spring-physics micro-interactions inspired by macOS Sequoia/Tahoe and iOS Control Center.
- **7 Complete Views & Workflows:**
  1. **Overview / Landing Page:** Cinematic hero section, animated security badge, live interactive terminal preview, feature grid, and zero-knowledge architecture breakdown.
  2. **Security Posture Dashboard:** Comprehensive health index, session strength distribution donut chart, dimensional metric bars, and recent session audit table (zero plaintext retention).
  3. **Cryptographic Password Analyzer:** Real-time feedback, Apple Watch-style circular score gauge (`ScoreRing`), information entropy meter (`EntropyMeter`), character composition breakdown, weakness detection, and actionable hardening recommendations.
  4. **Secure Password Generator:** Interactive length slider, rule configuration (uppercase, lowercase, digits, symbols, ambiguous filter), batch generation, color-coded credentials, and one-click copy with celebration confetti.
  5. **Breach Intelligence Scanner:** Visualized SHA-1 k-anonymity protocol explaining client-side hash separation (5-char prefix query vs. 35-char local suffix match) with zero plaintext leakage.
  6. **Cybersecurity Academy:** Interactive crack-time simulator projecting commodity CPU vs. 8x RTX 4090 GPU clusters vs. nation-state supercomputers, plus 8 curated interactive learning modules.
  7. **Executive Audit Reports:** Official NIST SP 800-63B compliance checklist, identified threat indicators, vector PDF print styling (`@media print`), and sanitized JSON audit summary download.
- **Strict Zero-Knowledge & Sovereign Privacy:**
  Passwords never leave client memory in plaintext. Breach queries transmit only the 5-character SHA-1 prefix to Have I Been Pwned (HIBP) APIs.
- **Resilient Dual-Mode Execution:**
  Direct integration with FastAPI backend on `http://localhost:8000`, with graceful, instant client-side cryptographic fallback (Web Crypto CSPRNG & zxcvbn model) if the backend is booting or offline.

---

## 🚀 Quick Start

### 1. Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```

The application will launch on `http://localhost:5173`.

### 2. Backend FastAPI Service

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Health check endpoint: `http://localhost:8000/health`

### 3. Production Build & Linting

```bash
cd frontend
npm run lint    # Runs oxlint (0 errors, 0 warnings)
npm run build   # Production TypeScript bundle with code-split vendor chunks
npm run preview # Runs production preview server
```

---

## 🛡️ Architecture & Cryptography

```
┌────────────────────────────────────────────────────────┐
│                   SecurePass Client                    │
│      React 19 + Framer Motion + Tailwind CSS v4        │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
    (5-char SHA-1 Prefix)      (POST /api/analyze, /api/generate)
               ▼                          ▼
┌──────────────────────────────┐ ┌──────────────────────┐
│  HIBP Range API (k-Anonymity)│ │   FastAPI Backend    │
│  Zero Plaintext Exposure     │ │   zxcvbn + CSPRNG    │
└──────────────────────────────┘ └──────────────────────┘
```

### Standards & Guidance
- **NIST SP 800-63B:** Focuses on length and credential screening rather than arbitrary composition rules.
- **Troy Hunt HIBP v3:** k-anonymity hash prefix verification.
- **Dropbox zxcvbn:** Realistic brute-force time and guessability modeling.
- **Shannon Information Entropy:** $H = L \cdot \log_2(N)$ combinatorial search space measurement.

---

## 📜 License

MIT License. Designed and engineered for high-security environments and portfolio demonstrations.
