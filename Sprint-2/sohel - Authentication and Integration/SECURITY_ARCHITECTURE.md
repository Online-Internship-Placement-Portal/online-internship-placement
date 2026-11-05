# Defense-in-Depth Security Architecture (Sprint-2)

> **Author:** Sohel Mahibubasa Chapparband (PES2UG25CS826)  
> **Role:** Authentication & Integration Specialist  
> **Traceability:** SRS Section 4 (Security Requirements), SAD Section 3.9, STP Section 13

---

## 1. Security Architecture Overview

The **Online Internship & Placement Preparation Portal** employs a multi-tiered Defense-in-Depth security architecture designed to prevent unauthorized access, mitigate brute-force vectors, and enforce role boundary integrity:

```
[ Incoming HTTP Client Request ]
             │
             ▼
[ Layer 1: HTTP Security Headers Middleware (OWASP nosniff, DENY, HSTS) ]
             │
             ▼
[ Layer 2: Sliding-Window Rate Limiter (Brute-Force & DoS Blocker) ]
             │
             ▼
[ Layer 3: Recursive Input Sanitization (XSS & Script Injection Filter) ]
             │
             ▼
[ Layer 4: Stateless JWT Authentication Barrier (HMAC-SHA256 Token Verify) ]
             │
             ▼
[ Layer 5: Role-Based Access Control (RBAC: Student, Recruiter, Admin) ]
             │
             ▼
[ Layer 6: Business Logic & Data Layer with Compound Unique Indexes ]
```

---

## 2. Cryptographic Specifications

| Control | Implementation | Specification | Standard |
| :--- | :--- | :--- | :--- |
| **Password Storage** | `bcryptjs` | Salted adaptive hashing (10 rounds) | `IPR-SR-002` |
| **Session State** | Stateless JWT | HMAC-SHA256 signature (`HS256`) | RFC 7519, `IPR-SR-001` |
| **Token Expiry** | Automatic invalidation | 24-hour expiration (`expiresIn: '24h'`) | `TC-Sec-01` |
| **Tampering Guard** | Signature check | Cryptographic mismatch rejection | `TC-Token-03` |

---

## 3. Granular RBAC Matrix (`IPR-F-003`, `IPR-SR-003`)

| Resource / Endpoint | Student | Recruiter | Administrator |
| :--- | :---: | :---: | :---: |
| `POST /api/auth/register` | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| `POST /api/auth/login` | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| `GET /api/profile/me` | :white_check_mark: | :x: (403) | :white_check_mark: |
| `PUT /api/profile/me` | :white_check_mark: | :x: (403) | :x: (403) |
| `POST /api/applications/apply/:id` | :white_check_mark: | :x: (403) | :x: (403) |
| `POST /api/internships` (Create) | :x: (403) | :white_check_mark: | :white_check_mark: |
| `PUT /api/applications/:id/status` | :x: (403) | :white_check_mark: | :white_check_mark: |
| `GET /api/admin/metrics` | :x: (403) | :x: (403) | :white_check_mark: |
| `POST /api/admin/tests` | :x: (403) | :x: (403) | :white_check_mark: |

---

## 4. Verification & Audit Trail

All security layers are backed by automated regression tests in:
- `Sprint-2/sohel - Authentication and Integration/integration/testRunner.js`
- `Sprint-2/sohel - Authentication and Integration/integration/tokenLifecycle.test.js`
- `Sprint-2/sohel - Authentication and Integration/integration/loadStress.test.js`

Every test suite runs continuously under GitHub Actions CI pipeline, enforcing strict quality gates on all pull requests.
