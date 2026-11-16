from __future__ import annotations

import hashlib
import math
import re
import secrets
import string
from typing import Any

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from zxcvbn import zxcvbn

app = FastAPI(title="SecurePass API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SPECIAL_CHARACTERS = "!@#$%^&*()_+-=[]{}|;:,.<>?/"
COMMON_PASSWORDS = {
    "password",
    "welcome",
    "admin",
    "letmein",
    "qwerty",
    "dragon",
    "monkey",
    "football",
    "shadow",
    "sunshine",
    "princess",
    "login",
    "secret",
}
KEYBOARD_PATTERNS = [
    "qwerty",
    "asdf",
    "zxcvbn",
    "123456",
    "password1",
    "1qaz2wsx",
    "abc123",
]


class PasswordRequest(BaseModel):
    password: str = Field(..., min_length=1, description="Password to evaluate")


class GeneratePasswordRequest(BaseModel):
    length: int = Field(16, ge=8, le=128)
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_numbers: bool = True
    include_symbols: bool = True
    exclude_ambiguous: bool = True
    count: int = Field(3, ge=1, le=12)


class BreachCheckRequest(BaseModel):
    password: str = Field(..., min_length=1, description="Password to test against breach datasets")


def classify_strength(score: int) -> str:
    labels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"]
    return labels[min(max(score, 0), 4)]


def estimate_guessability(password: str) -> dict[str, Any]:
    result = zxcvbn(password)
    score = int(result.get("score", 0))
    guesses = float(result.get("guesses", 1))
    return {
        "score": score,
        "strength": classify_strength(score),
        "guesses": guesses,
        "crack_time": result.get("crack_times_display", {}).get("offline_fast_hashing_1e10_per_second", "Instant"),
        "feedback": result.get("feedback", {}).get("suggestions", []),
        "warning": result.get("feedback", {}).get("warning"),
    }


def detect_repeated_characters(password: str) -> bool:
    return bool(re.search(r'(.)\1{2,}', password))


def detect_sequences(password: str) -> list[str]:
    lowered = password.lower()
    sequences: list[str] = []
    for candidate in ["abc", "bcd", "cde", "def", "efg", "fgh", "ghi", "hij", "ijk", "jkl", "klm", "lmn", "mno", "nop", "opq", "pqr", "qrs", "rst", "stu", "tuv", "uvw", "vwx", "wxy", "xyz"]:
        if candidate in lowered or candidate[::-1] in lowered:
            sequences.append(candidate)
    for number_pattern in ["123", "234", "345", "456", "567", "678", "789", "890", "012", "987", "876", "765", "654", "543", "432", "321"]:
        if number_pattern in lowered or number_pattern[::-1] in lowered:
            sequences.append(number_pattern)
    return sequences


def detect_keyboard_patterns(password: str) -> list[str]:
    lowered = password.lower()
    return [pattern for pattern in KEYBOARD_PATTERNS if pattern in lowered]


def theoretical_entropy(password: str) -> float:
    length = len(password)
    if not length:
        return 0.0
    pool_size = 0
    if any(ch.islower() for ch in password):
        pool_size += 26
    if any(ch.isupper() for ch in password):
        pool_size += 26
    if any(ch.isdigit() for ch in password):
        pool_size += 10
    if any(ch in SPECIAL_CHARACTERS for ch in password):
        pool_size += len(SPECIAL_CHARACTERS)
    if pool_size == 0:
        return 0.0
    return round(length * math.log2(pool_size), 2)


def analyze_password(password: str) -> dict[str, Any]:
    if not password:
        raise HTTPException(status_code=400, detail="Password is required.")

    lower = password.lower()
    length = len(password)
    uppercase = sum(1 for ch in password if ch.isupper())
    lowercase_count = sum(1 for ch in password if ch.islower())
    digits = sum(1 for ch in password if ch.isdigit())
    symbols = sum(1 for ch in password if not ch.isalnum())

    weakness_details: list[str] = []
    if length < 12:
        weakness_details.append("Password length is below 12 characters, which reduces brute-force resistance.")
    if uppercase == 0:
        weakness_details.append("No uppercase letters present.")
    if lowercase_count == 0:
        weakness_details.append("No lowercase letters present.")
    if digits == 0:
        weakness_details.append("No numeric characters present.")
    if symbols == 0:
        weakness_details.append("No special characters present.")
    if detect_repeated_characters(password):
        weakness_details.append("Repeated character sequences may make the password easier to guess.")
    sequences = detect_sequences(password)
    if sequences:
        weakness_details.append(f"Sequential patterns found: {', '.join(sequences[:3])}.")
    keyboard_hits = detect_keyboard_patterns(password)
    if keyboard_hits:
        weakness_details.append(f"Keyboard-based patterns detected: {', '.join(keyboard_hits[:3])}.")
    if any(word in lower for word in COMMON_PASSWORDS):
        weakness_details.append("Dictionary word or common password material detected.")
    if password.startswith("Password") or password.startswith("Admin"):
        weakness_details.append("Predictable prefix patterns were detected.")
    if len(set(password)) == 1:
        weakness_details.append("All characters are identical, which is an indicator of poor entropy.")

    zxcvbn_result = estimate_guessability(password)
    entropy = theoretical_entropy(password)
    score = min(100, max(10, zxcvbn_result["score"] * 25 + int(min(length, 20) * 1.6)))

    recommendations = []
    if length < 14:
        recommendations.append("Increase the password to at least 14 characters.")
    if any(word in lower for word in COMMON_PASSWORDS):
        recommendations.append("Remove common dictionary words and personal references.")
    if detect_repeated_characters(password) or sequences:
        recommendations.append("Avoid repeated characters and sequential patterns like 'abc' or '1234'.")
    if zxcvbn_result["score"] <= 2:
        recommendations.append("Use a passphrase or randomly generated password with more unpredictable characters.")
    if not recommendations:
        recommendations.append("Continue using unique, non-reused passwords and enable MFA for high-value accounts.")

    return {
        "password_length": length,
        "character_pool": {
            "uppercase": uppercase,
            "lowercase": lowercase_count,
            "digits": digits,
            "symbols": symbols,
        },
        "strength_score": score,
        "strength_label": classify_strength(zxcvbn_result["score"]),
        "estimated_guesses": int(zxcvbn_result["guesses"]),
        "guesses_required": zxcvbn_result["crack_time"],
        "entropy_bits": entropy,
        "entropy_summary": "Theoretical entropy measures character-set size and length, but real-world guessability depends on password patterns and reuse.",
        "weaknesses": weakness_details,
        "recommendations": recommendations,
        "breach_intelligence": {
            "privacy_notice": "Passwords are hashed locally and only the first five characters of the SHA-1 hash are sent to the HIBP API for k-anonymity.",
            "status": "Ready",
        },
    }


def generate_passwords(payload: GeneratePasswordRequest) -> dict[str, Any]:
    chars: list[str] = []
    if payload.include_uppercase:
        chars.extend(string.ascii_uppercase)
    if payload.include_lowercase:
        chars.extend(string.ascii_lowercase)
    if payload.include_numbers:
        chars.extend(string.digits)
    if payload.include_symbols:
        chars.extend(SPECIAL_CHARACTERS)
    if payload.exclude_ambiguous:
        ambiguous = set("0O1Il|\"'`~")
        chars = [ch for ch in chars if ch not in ambiguous]
    if not chars:
        raise HTTPException(status_code=400, detail="At least one character set must be selected.")

    generated: list[str] = []
    while len(generated) < payload.count:
        candidate = ''.join(secrets.choice(chars) for _ in range(payload.length))
        if payload.include_uppercase and not any(ch.isupper() for ch in candidate):
            continue
        if payload.include_lowercase and not any(ch.islower() for ch in candidate):
            continue
        if payload.include_numbers and not any(ch.isdigit() for ch in candidate):
            continue
        if payload.include_symbols and not any(not ch.isalnum() for ch in candidate):
            continue
        generated.append(candidate)

    return {"passwords": generated, "length": payload.length}


def check_breach(password: str) -> dict[str, Any]:
    digest = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
    prefix = digest[:5]
    suffix = digest[5:]
    url = f"https://api.pwnedpasswords.com/range/{prefix}"

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
    except requests.RequestException:
        return {
            "is_compromised": False,
            "status": "unavailable",
            "count": 0,
            "message": "Breach detection could not reach the HIBP service. The password was not sent in plaintext.",
        }

    for line in response.text.splitlines():
        candidate_hash, count = line.split(":")
        if candidate_hash == suffix:
            return {
                "is_compromised": True,
                "status": "matched",
                "count": int(count),
                "message": "This password appears in known breach datasets. Consider changing it immediately.",
            }

    return {
        "is_compromised": False,
        "status": "clear",
        "count": 0,
        "message": "No match was found in the checked dataset for this password hash prefix.",
    }


def simulate_attack_risk(password: str) -> dict[str, Any]:
    analysis = analyze_password(password)
    password_length = len(password)
    entropy = analysis["entropy_bits"]
    return {
        "brute_force": {
            "theoretical_attempts": f"{10 ** max(4, password_length)} possible combinations at minimum",
            "explanation": "Brute-force resistance depends on password length and character diversity, not just a single entropy number.",
        },
        "dictionary": {
            "is_vulnerable": any(word in password.lower() for word in COMMON_PASSWORDS),
            "explanation": "Dictionary and common word attacks use known words and leaked credential patterns.",
        },
        "credential_stuffing": {
            "risk": "High" if analysis["strength_label"] in {"Very Weak", "Weak"} else "Moderate",
            "explanation": "Credential stuffing reuses compromised passwords across unrelated web services, which makes reuse especially dangerous.",
        },
        "entropy": {
            "bits": entropy,
            "explanation": "Theoretical entropy estimates the search space but does not account for real-world password reuse or human predictability.",
        },
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "SecurePass"}


@app.post("/api/analyze")
def analyze_endpoint(payload: PasswordRequest) -> dict[str, Any]:
    return analyze_password(payload.password)


@app.post("/api/generate")
def generate_endpoint(payload: GeneratePasswordRequest) -> dict[str, Any]:
    return generate_passwords(payload)


@app.post("/api/breach-check")
def breach_check_endpoint(payload: BreachCheckRequest) -> dict[str, Any]:
    return check_breach(payload.password)


@app.get("/api/risk-education")
def risk_education() -> dict[str, Any]:
    return {
        "principles": [
            "Brute-force attacks try every possible combination and become exponentially harder with longer passwords.",
            "Dictionary attacks exploit common words, names, and patterns that humans naturally choose.",
            "Credential stuffing reuses known leaked credentials across unrelated web services.",
            "Password reuse creates a cascade effect where one breach can compromise many accounts.",
        ],
        "education": "The safest protections are strong passwords, password managers, unique credentials, and MFA.",
    }


@app.post("/api/attack-simulation")
def attack_simulation(payload: PasswordRequest) -> dict[str, Any]:
    return simulate_attack_risk(payload.password)


@app.get("/api/recommendations")
def recommendation_endpoint() -> dict[str, Any]:
    return {
        "recommendations": [
            "Use 14+ characters when possible.",
            "Avoid dictionary words, names, and predictable patterns.",
            "Generate passwords with a password manager when available.",
            "Never reuse passwords across multiple accounts.",
            "Enable multi-factor authentication for sensitive logins.",
        ]
    }


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "SecurePass backend is running."}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
