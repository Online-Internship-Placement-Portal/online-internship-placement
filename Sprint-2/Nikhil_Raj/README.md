# Backend Setup — Sprint 2

**Team Member:** Nikhil Raj G (PES2UG24CS319)  
**Role:** Backend Setup  
**Course:** UE24CS341A - Software Engineering, PES University  
**Sprint Window:** 26th Oct to 30th Oct 2026

---

## 1. Scope & Deliverables in Sprint-2

Sprint-2 completes all remaining backend subsystems specified in **SRS v1.0 Section 4** and **SAD v1.0 Section 4.3**:

1. **Student Profile API (`controllers/profileController.js`, `routes/profileRoutes.js`)**:
   - `GET /api/profile/me`: Retrieves student academic details, skills, links, and placement status (`IPR-F-004`).
   - `PUT /api/profile/me`: Validates and persists updates to student profile (`IPR-F-004`, `IPR-F-005`, `TC-PROF-01`, `TC-PROF-02`).
2. **Internship Management API (`controllers/internshipController.js`, `routes/internshipRoutes.js`)**:
   - `GET /api/internships`: Full-text search and filtering by location, type, company, stipend (`IPR-F-006`, `IPR-F-007`).
   - `POST /api/internships`: Recruiter publishes new internship opportunities with eligibility criteria (`IPR-F-016`, `TC-REC-01`).
   - `PUT /api/internships/:id` & `DELETE /api/internships/:id`: Listing maintenance.
3. **Application & Duplicate Prevention API (`controllers/applicationController.js`, `routes/applicationRoutes.js`)**:
   - `POST /api/internships/:id/applications`: Enforces duplicate submission check, returning `409 Conflict` on duplicates (`IPR-F-008`, `IPR-F-009`, `TC-INT-04`).
   - `GET /api/applications/me`: Student visual application status pipeline (`IPR-F-010`, `TC-INT-05`).
   - `GET /api/applications/recruiter`: Recruiter applicant review with profile lookups (`IPR-F-017`, `TC-REC-02`).
   - `PUT /api/applications/:id/status`: Updates application state (`Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`) with feedback notes.
4. **Aptitude Test Evaluation & History Engine (`controllers/testController.js`, `routes/testRoutes.js`)**:
   - `GET /api/tests`: Delivers active tests with sanitized question payloads (`IPR-F-011`, `TC-TEST-01`).
   - `POST /api/tests/:id/submit`: Automatic score calculation, pass/fail grading, question review generation (`IPR-F-012`, `TC-TEST-02`).
   - `GET /api/tests/history/me`: Student historical test attempts log (`IPR-F-013`, `TC-TEST-03`).
5. **Preparation Progress & Analytics Engine (`controllers/progressController.js`, `routes/progressRoutes.js`)**:
   - `GET /api/progress/me`: Category breakdown analytics, average readiness score, placement readiness benchmark (`IPR-F-014`, `IPR-F-015`, `TC-PROG-02`).
   - `PUT /api/progress/me`: Interactive topic status updates (`TC-PROG-01`).
6. **Administrator Governance API (`controllers/adminController.js`, `routes/adminRoutes.js`)**:
   - `GET /api/admin/metrics`: Platform counters, active user counts, health status (`IPR-F-018`, `TC-ADMIN-01`).
   - `GET /api/admin/users`: User management list.
   - `PUT /api/admin/users/:id/status`: Account activation/deactivation.
   - `POST /api/admin/tests`: Admin test & question authoring.
7. **Cross-Cutting Concerns**:
   - `middleware/errorHandler.js`: Standardized status mapping (400, 401, 403, 404, 409, 500) per `SAD Section 4.4` & `IPR-NF-008`.
   - `middleware/requestLogger.js`: Request latency profiling verifying `IPR-NF-001` (response time <= 3s).
