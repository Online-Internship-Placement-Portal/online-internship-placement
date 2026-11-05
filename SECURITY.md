# Security Policy & Cryptographic Assurance

## Supported Versions

| Version | Supported          | Security Status |
| :------ | :----------------- | :-------------- |
| 2.0.x   | :white_check_mark: | Sprint-2 Final Development Freeze |
| 1.0.x   | :white_check_mark: | Sprint-1 Maintenance |
| < 1.0   | :x:                | Deprecated |

---

## Security Architecture & Cryptographic Controls

The **Online Internship & Placement Preparation Portal** implements defense-in-depth architecture adhering to **SAD Section 3.9** and **OWASP Top 10** standards:

### 1. Password Hashing (`IPR-SR-002`)
- **Algorithm:** Adaptive `bcryptjs` with 10 salt rounds.
- Passwords are salted with unique cryptographic entropy before hashing. Plaintext passwords are never logged, stored in databases, or transferred in API payloads.

### 2. Stateless Authentication (`IPR-SR-001`)
- **Standard:** JSON Web Tokens (JWT) adhering to RFC 7519.
- **Signing Algorithm:** HMAC-SHA256 (`HS256`).
- **Signature Secret:** Configured via `JWT_SECRET` environment variable with fallback rotation support.
- Tokens enforce an expiration duration (`expiresIn: '24h'`).

### 3. Role-Based Access Control (RBAC) (`IPR-F-003`, `IPR-SR-003`)
- Authorization is checked at the middleware level before reaching controller execution.
- Roles: `student`, `recruiter`, `admin`.
- Role escalation attempts trigger automated `403 Forbidden` responses.

### 4. Input Sanitization & Injection Prevention (`IPR-SR-005`)
- Server-side recursive sanitization strips `<script>`, `<iframe>`, javascript pseudo-protocols, and inline DOM event attributes.
- Mongoose schema typing and parameter binding prevent NoSQL injection vectors.

### 5. Brute-Force & Rate Limiting (`IPR-SR-002`)
- In-memory sliding-window rate limiters gate authentication endpoints (`/api/auth/login`), returning `429 Too Many Requests` after threshold violations.

---

## Reporting a Security Vulnerability

If you discover a security vulnerability within this repository, please report it privately:

1. **Email:** `sohelchapparband4@gmail.com`
2. **Subject:** `[SECURITY] Potential Vulnerability in Placement Portal`
3. Include detailed steps to reproduce the issue along with a proof-of-concept payload.
4. Security advisories will be acknowledged within 24 hours with remediation patches released via pull request.
