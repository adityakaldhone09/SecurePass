# SecurePass

SecurePass is a password security dashboard built with React, TypeScript, Tailwind CSS, and FastAPI. It combines strength analysis, breach checking, password generation, attack-risk education, and printable audit reporting in one interface.

## Features

- Real-time password analysis with strength, entropy, guessability, weaknesses, and recommendations
- Cryptographically secure password generation with configurable character rules
- Breach checks through the Have I Been Pwned range API
- Attack-simulation and credential-security education
- Dashboard metrics, reports, and PDF-friendly audit output
- Responsive dark/light interface with animated UI elements
- Local frontend fallbacks when the FastAPI service is unavailable

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4 |
| UI | Framer Motion, Lucide React, Recharts |
| Backend | FastAPI, Pydantic, zxcvbn |
| Storage/configuration | SQLAlchemy, SQLite/PostgreSQL environment support |

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- Python 3.10 or newer

### Run the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API runs at `http://localhost:8000`. The health endpoint is `http://localhost:8000/health`.

Interactive API documentation is available at `http://localhost:8000/docs`.

### Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

To point the frontend at a different API, create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

### Environment

The backend example variables are in `backend/.env.example`:

```env
APP_NAME=SecurePass
APP_ENV=development
DATABASE_URL=sqlite:///./securepass.db
CORS_ORIGINS=http://localhost:5173
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Service health check |
| `POST` | `/api/analyze` | Analyze a password |
| `POST` | `/api/generate` | Generate passwords |
| `POST` | `/api/breach-check` | Check a password against breach data |
| `POST` | `/api/attack-simulation` | Estimate attack and dictionary risk |
| `GET` | `/api/risk-education` | Retrieve security education content |
| `GET` | `/api/recommendations` | Retrieve general recommendations |

## Privacy and Security

SecurePass uses HIBP k-anonymity: the application sends only the first five characters of a password's SHA-1 hash and compares the remaining suffix locally. The backend accepts passwords for analysis but does not currently persist passwords or completed audit results.

For real-world use, serve the frontend and API over HTTPS and review retention, logging, rate limiting, and production CORS settings.

## Development

```bash
cd frontend
npm run lint
npm run build
npm run preview
```
