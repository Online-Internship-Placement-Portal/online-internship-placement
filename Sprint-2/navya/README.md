# User Interface (Frontend) — Sprint 2

**Team Member:** NAVYA R (PES2UG24CS308)  
**Role:** User Interface (Frontend)  
**Course:** UE24CS341A - Software Engineering, PES University  
**Sprint Window:** 26th Oct to 30th Oct 2026

---

## 1. Scope & Deliverables in Sprint-2

In Sprint-2, the user interface was developed into a comprehensive, single-page application integrating all user roles specified in **SRS Section 2.2** and **SAD Section 4.5**:

### 1. Student Command Center & Profile Management (`IPR-F-004`, `IPR-F-005`, `TC-PROF-01`, `TC-PROF-02`)
- **Profile Editor**: Allows students to update USN, CGPA, semester, skills tags, resume link, GitHub/LinkedIn links, and bio.
- **Preparation Analytics Bar**: Live visual progress gauge (e.g. 78% Placement Ready) with category breakdown cards and interactive topic checklist.
- **Application Status Pipeline**: Real-time visual pipeline (`Submitted` → `Under Review` → `Shortlisted` → `Interview Scheduled` → `Selected`) displaying interview links and recruiter feedback notes.

### 2. Internship Catalog & 1-Click Application (`IPR-F-006`, `IPR-F-007`, `IPR-F-008`, `IPR-F-009`)
- Real-time keyword search and filtering by job type, location, company, and stipend.
- Detailed internship description modal with eligibility criteria (`minCgpa`).
- 1-Click application submission with custom cover notes and immediate duplicate application alert banner (`TC-INT-04`).

### 3. Aptitude Test Engine & Score History (`IPR-F-011`, `IPR-F-012`, `IPR-F-013`, `TC-TEST-01`, `TC-TEST-02`, `TC-TEST-03`)
- Real-time countdown timer with question pagination.
- Instant automated score computation and pass/fail verdict upon submission.
- Comprehensive question-by-question review displaying student selection, correct answer, and textbook explanation.
- Dedicated **Test History** view tracking score progression over time.

### 4. Recruiter Management Hub (`IPR-F-016`, `IPR-F-017`, `TC-REC-01`, `TC-REC-02`)
- "+ Post Internship" creation form with openings and criteria.
- Candidate application review table with status filter buttons (`All`, `Shortlisted`, `Rejected`).
- Recruiter status transition controls (`Shortlist`, `Schedule Interview`, `Reject`) with feedback notes.

### 5. Administrator Governance Hub (`IPR-F-018`, `TC-ADMIN-01`)
- Platform metrics cards (Total Users, Active Postings, Applications, Health 99.9%).
- User management table with search and toggle activate/deactivate account status.
- Test question bank authoring form to add new aptitude tests and multiple-choice questions.

### 6. Usability & Responsiveness (`IPR-NF-004`, `TC-UI-01`)
- Responsive CSS Grid and Flexbox styling verified on mobile, tablet, and desktop viewports.


---

## 2. Modular Component Architecture

```text
Sprint-2/navya/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboardView.jsx
│   │   │   └── UserManagementTable.jsx
│   │   ├── auth/
│   │   │   ├── LoginView.jsx
│   │   │   └── StudentRegisterView.jsx
│   │   ├── common/
│   │   │   ├── AlertBanner.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── layout/
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── recruiter/
│   │   │   ├── PostInternshipForm.jsx
│   │   │   └── RecruiterDashboardView.jsx
│   │   └── student/
│   │       ├── ApplicationTrackerView.jsx
│   │       ├── AptitudeTestView.jsx
│   │       ├── InternshipCatalogView.jsx
│   │       ├── InternshipFilterBar.jsx
│   │       ├── PrepChecklist.jsx
│   │       ├── PreparationGauge.jsx
│   │       ├── StudentDashboardView.jsx
│   │       ├── StudentProfileView.jsx
│   │       └── TestHistoryView.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── useTimer.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── internshipService.js
│   │   └── testService.js
│   ├── utils/
│   │   └── validators.js
│   ├── App.jsx
│   ├── index.js
│   └── styles.css
└── tests/
    └── uiSmokeTest.js
```

### Verify Frontend Structure
```bash
cd Sprint-2/navya
node tests/uiSmokeTest.js
```
