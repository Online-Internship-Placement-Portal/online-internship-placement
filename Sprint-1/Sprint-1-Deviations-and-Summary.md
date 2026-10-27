# Sprint-1 Summary & Deviations Report

> **Project:** Online Internship & Placement Preparation Portal  
> **Course:** UE24CS341A - Software Engineering (5th Semester, AY 2026-27)  
> **Sprint Period:** 19th Oct to 23rd Oct  
> **Team Members:**  
> 1. Patnaikuni Sai Dheeraj (PES2UG24CS341) - Database Setup  
> 2. Sohel Mahibubasa Chapparband (PES2UG25CS826) - Authentication and Integration  
> 3. Navya R (PES2UG24CS308) - User Interface (Frontend)  
> 4. Nikhil Raj G (PES2UG24CS319) - Backend Setup  

---

## 1. Executive Summary & Sprint-1 Objectives

The primary objective of **Sprint-1** was to establish the foundational architecture, secure authentication subsystem, role-based access control, database schemas, core backend REST APIs, responsive frontend dashboards, and automated CI pipelines as specified in the **Software Requirements Specification (SRS v1.0)**, **Software Architecture and Design Specification (SAD v1.0)**, and **Software Test Plan (STP v1.0)**.

All four team members have executed their respective responsibilities in isolated, modular folders to facilitate autonomous pull requests, code reviews, and automated verification via GitHub Actions.

---

## 2. Requirements Implemented & Traceability (Sprint-1)

| Requirement ID | Requirement Description | Module / Owner | Test Case ID | Status |
| :--- | :--- | :--- | :--- | :---: |
| **IPR-F-001** | Student Registration with validation | Sohel (Auth & Integration) | `TC-Auth-01` | **VERIFIED** |
| **IPR-F-002** | User Authentication & JWT generation | Sohel (Auth & Integration) | `TC-Auth-02` | **VERIFIED** |
| **IPR-F-003** | Role-Based Access Control (Student, Recruiter, Admin) | Sohel (Auth & Integration) | `TC-Auth-03` | **VERIFIED** |
| **IPR-F-004** | Student Profile & Placement Details | Dheeraj (Database Setup) | `TC-Prof-01` | **VERIFIED** |
| **IPR-F-006** | Internship Opportunities Catalog Display | Nikhil (Backend) & Navya (UI) | `TC-Int-01` | **VERIFIED** |
| **IPR-F-007** | Internship Search & Filtering | Nikhil (Backend) & Navya (UI) | `TC-Int-02` | **VERIFIED** |
| **IPR-F-008** | Internship Application Submission | Nikhil (Backend) & Navya (UI) | `TC-Int-03` | **VERIFIED** |
| **IPR-F-009** | Prevent Duplicate Internship Applications | Dheeraj (DB) & Nikhil (Backend) | `TC-Int-04` | **VERIFIED** |
| **IPR-F-010** | Student Application Status Tracking | Navya (UI) & Nikhil (Backend) | `TC-Int-05` | **VERIFIED** |
| **IPR-F-011** | Aptitude Test Engine Participation | Navya (UI) & Nikhil (Backend) | `TC-Test-01` | **VERIFIED** |
| **IPR-F-012** | Automatic Aptitude Test Scoring | Nikhil (Backend) & Sohel (Tests) | `TC-Test-02` | **VERIFIED** |
| **IPR-F-014** | Placement Preparation Progress Recording | Dheeraj (DB) & Nikhil (Backend) | `TC-Prog-01` | **VERIFIED** |
| **IPR-F-015** | Placement Preparation Analytics | Navya (UI) & Nikhil (Backend) | `TC-Prog-02` | **VERIFIED** |
| **IPR-F-016** | Recruiter Internship Management | Nikhil (Backend) & Navya (UI) | `TC-Rec-01` | **VERIFIED** |
| **IPR-F-017** | Recruiter Application Status Management | Nikhil (Backend) & Navya (UI) | `TC-Rec-02` | **VERIFIED** |
| **IPR-F-018** | Administrator Governance & Metrics | Nikhil (Backend) & Navya (UI) | `TC-Admin-01` | **VERIFIED** |
| **IPR-SR-001** | Authentication protection of protected APIs | Sohel (Auth & Integration) | `TC-Sec-01` | **VERIFIED** |
| **IPR-SR-002** | Salted adaptive password hashing (bcrypt) | Sohel (Auth & Integration) | `TC-Sec-02` | **VERIFIED** |
| **IPR-SR-005** | Server-side Input Sanitization (XSS) | Sohel (Auth & Integration) | `TC-Sec-05` | **VERIFIED** |
| **IPR-NF-004** | Responsive UI across mobile/tablet/desktop | Navya (UI) | `TC-UI-01` | **VERIFIED** |

---

## 3. Analysis of Deviations from Submitted SRS, SAD & STP

Per project instruction (item i: *"Deviations from the submitted document should be documented and explained during the final demo"*), the following minor architectural adaptations were implemented:

### 1. Dual-Mode Storage Architecture (MongoDB Mongoose + In-Memory Fallback)
- **Submitted Design:** MongoDB was defined as the sole persistence layer (SAD Section 3.6).
- **Implemented Adaptation:** While full Mongoose models (`User`, `StudentProfile`, `Internship`, `Application`, `AptitudeTest`, `TestResult`, `PreparationProgress`) and connection modules were created by Dheeraj, an adaptive in-memory fallback layer was incorporated into the controller modules.
- **Justification & Benefit:** This ensures that CI/CD pipelines (GitHub Actions runners) and local evaluation environments without an active MongoDB background service can run 100% of the unit, integration, and UI tests seamlessly without intermittent connection timeouts. The schema contracts and unique indexing constraints are strictly adhered to in both modes.

### 2. Mock Cloud Storage for Resume Binary Blobs
- **Submitted Design:** Student resumes were listed under `StudentProfile.resumeUrl` and `Application.resume` (SAD Fig 1).
- **Implemented Adaptation:** In Sprint-1, resume links are stored as simulated secure HTTPS storage URLs (e.g., `https://storage.portal.pes.edu/resumes/...`) rather than integrating an external AWS S3 or Google Cloud Storage bucket.
- **Justification & Benefit:** Complies directly with STP Section 4 (*"Features Not to be Tested: Underlying cloud-provider infrastructure provisioning"*), avoiding third-party network egress and secret management overhead in local grading.

### 3. Folder Partitioning by Team Member for Distributed SCM
- **Submitted Design:** SAD depicted unified frontend and backend directories.
- **Implemented Adaptation:** Sprint-1 partitioned the codebase into distinct member workspaces (`sohel/`, `navya/`, `nikhil_raj/`, `dheeraj/`) alongside the unified root runner.
- **Justification & Benefit:** Allows each student to maintain independent Git feature branches, raise isolated Pull Requests, and undergo individual automated evaluation without merge collisions.

---

## 4. GitHub Actions CI & PR Automation Summary

- **Workflow File:** `.github/workflows/ci.yml`
- **Automation Features:**
  - Automated testing on Node.js matrix (18.x and 20.x).
  - Automated execution of `Sprint-1/sohel/integration/testRunner.js`.
  - Directory structure and artifact verification on all Pull Requests targeting `main`.
  - Pass/Fail status checks preventing broken PR merges.

---

## 5. Conclusion

Sprint-1 deliverables are **100% complete**, yielding a fully functional, integrated MERN product ready for the 1-minute video demonstration and evaluation.
