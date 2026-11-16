# SecurePass

SecurePass is a professional password security analyzer and secure password generator built with a React + Vite frontend and a FastAPI backend.

## Features

- Password strength analysis with zxcvbn guidance
- Entropy calculations and score visualization
- Secure random password generation with customizable rules
- HIBP-style breach detection using SHA-1 k-anonymity
- Attack simulation and risk education
- Responsive cybersecurity dashboard design

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Docker Compose

```bash
docker compose up --build
```

## API

- GET /health
- POST /api/analyze
- POST /api/generate
- POST /api/breach-check
- GET /api/risk-education
- POST /api/attack-simulation

## Notes

This project is designed as an intermediate-level cybersecurity portfolio application. It intentionally avoids storing or logging user passwords and uses local hashing before any remote breach lookup.
