# Database Setup — Sprint 2

**Team Member:** Patnaikuni Sai Dheeraj (PES2UG24CS341)  
**Role:** Database Setup  
**Course:** UE24CS341A - Software Engineering, PES University  
**Sprint Window:** 26th Oct to 30th Oct 2026

---

## 1. Scope & Deliverables in Sprint-2

In Sprint-2, the database subsystem was expanded from the foundational schema baseline into a fully realized persistence architecture supporting the entire functional lifecycle specified in **SRS v1.0** and **SAD v1.0**.

### Implemented Collections & Schemas:
1. **`users` (`models/User.js`)**: User identity with status verification (`active`, `inactive`), role-based typing, last login timestamps, and hashed credentials.
2. **`studentprofiles` (`models/StudentProfile.js`)**: Comprehensive student profile tracking USN, CGPA, semester, skills array, resume URLs, portfolio links, and placement status (`Eligible`, `Placed`, `Opted Out`).
3. **`internships` (`models/Internship.js`)**: Recruiter job listings with full text-indexing on title, company, and description, stipend details, openings, and academic eligibility criteria (`minCgpa`, `allowedDepartments`).
4. **`applications` (`models/Application.js`)**: Candidate applications featuring a **unique compound index** on `{ student: 1, internship: 1 }` to physically guarantee rejection of duplicate submissions (`IPR-F-009`, `TC-INT-04`), multi-stage status progression, recruiter feedback notes, and interview schedule metadata.
5. **`aptitudetests` (`models/AptitudeTest.js`)**: Multi-category aptitude test question banks (Quantitative, Logical, Verbal, Technical) with multiple choice options, marks, and explanation text.
6. **`testresults` (`models/TestResult.js`)**: Historical student test submission records storing question-level student answers, pass/fail indicators, percentage, duration taken, and historical timestamps (`IPR-F-013`, `TC-TEST-03`).
7. **`preparationprogresses` (`models/PreparationProgress.js`)**: Topic-by-topic placement readiness metrics with unique compound index `{ student: 1, topic: 1 }`, topic completion flags, and category readiness scores (`IPR-F-014`, `IPR-F-015`).
8. **`auditlogs` (`models/AuditLog.js`)**: System-wide governance audit trails capturing user registrations, internship creation, and application status modifications (`IPR-F-018`).

---

## 2. Integrity, Constraints & Indexing

- **Compound Unique Constraints:**
  - `applications.index({ student: 1, internship: 1 }, { unique: true })`: Enforces `IPR-F-009` at the database layer.
  - `preparationprogresses.index({ student: 1, topic: 1 }, { unique: true })`: Prevents duplicate topic tracking entries.
- **Search & Filter Indexes:**
  - `internships.index({ title: 'text', company: 'text', description: 'text' })`: High-speed full-text keyword search (`IPR-F-007`).
  - `applications.index({ internship: 1, status: 1 })`: Optimized query performance for recruiter applicant pipelines (`IPR-NF-001`).

---

## 3. Running the Seeder

Set `MONGO_URI` to the MongoDB connection string for the database you want to seed. If it is omitted, the connection helper uses the local `internship_placement_portal` database. The seeder clears its target collections before inserting the sample records, so use a development database.

```bash
cd "Sprint-2/dheeraj"
npm install
npm run seed
```

The connection timeout defaults to 5 seconds. Set `MONGO_SERVER_SELECTION_TIMEOUT_MS` to a positive number of milliseconds to change it.
