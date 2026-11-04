# Authentication and Integration — Sprint 2

**Team Member:** Sohel Mahibubasa Chapparband (PES2UG25CS826)  
**Role:** Authentication and Integration  
**Course:** UE24CS341A - Software Engineering, PES University  
**Sprint Window:** 26th Oct to 30th Oct 2026

---

## 1. Scope & Deliverables in Sprint-2

Sprint-2 finalizes the security, identity, cross-subsystem orchestration, and automated verification architecture specified in **SRS v1.0 Section 4.1 & 6**, **SAD v1.0 Section 3.9**, and **STP v1.0 Section 13 & 14**:

### 1. Robust Authentication & Identity Subsystem (`controllers/authController.js`, `routes/authRoutes.js`)
- **Student, Recruiter, and Admin Registration (`IPR-F-001`, `TC-Auth-01`)**:
  - Enforces strict email format validation and password length checks (>= 6 characters).
  - Automatically links new student accounts to default academic departments.
  - Rejects duplicate email registrations with `409 Conflict`.
- **Salted Adaptive Password Hashing (`IPR-SR-002`, `TC-Sec-02`)**:
  - Employs `bcryptjs` with 10 salt rounds to ensure passwords are never stored or transmitted in plaintext.
- **JWT Token Issuance & Lifecycle (`IPR-SR-001`, `TC-Sec-01`)**:
  - Issues signed JSON Web Tokens encoding user `id`, `email`, `role`, and `department` with a 24-hour expiration window.
- **Identity Introspection (`GET /api/auth/me`)**:
  - Returns authenticated user details and active session metadata.

### 2. Granular Role-Based Access Control (`middleware/rbacMiddleware.js`)
- Protects route groups by role (`student`, `recruiter`, `admin`) per `IPR-F-003` and `TC-Auth-03`.
- Returns `403 Forbidden` with standardized error formatting when a student attempts unauthorized administrative or recruiter operations.

### 3. Server-Side Input Sanitization (`middleware/sanitizeMiddleware.js`)
- Recursively strips malicious XSS vectors (`<script>`, `<iframe>`, `javascript:`, event handlers `onload`, `onerror`) from request bodies, query strings, and URL parameters (`IPR-SR-005`, `TC-Sec-05`).

### 4. Master Automated Verification Test Runner (`integration/testRunner.js`)
- Runs a comprehensive automated test suite testing **all 25+ STP test cases** spanning:
  - Authentication, Registration, and Login
  - Student Profile and Academic Validation
  - Internship Catalog Search & Filtering
  - Application Submission and Duplicate Application Rejection (`409 Conflict`)
  - Application Status Pipeline Progression
  - Aptitude Test Attempt Delivery, Auto-Scoring, and History Tracking
  - Placement Preparation Progress and Category Readiness Analytics
  - Recruiter Internship and Applicant Management
  - Administrator Governance, User Management, and Platform Metrics
  - Performance SLA (<= 3000ms) and High-Volume Concurrency Simulation (500 operations)
- Calculates and prints summary metrics complying with **STP Section 14 (Test Metrics & Reporting)**.

---

## 2. Running the Test Suite

```bash
cd "Sprint-2/sohel - Authentication and Integration"
npm install
node integration/testRunner.js
```
