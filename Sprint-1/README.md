feature/sohel-auth-integration
# Sprint 1 — Online Internship & Placement Preparation Portal

## 1. Project Overview

The **Online Internship & Placement Preparation Portal** is a web application designed to help students discover internship opportunities and prepare for placements.

The portal will allow students to manage profiles, search and apply for internships, track application status, take aptitude tests, and monitor preparation progress. Recruiters will manage internship listings and applications, while administrators will manage users and portal resources.

## 2. Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js and Express.js
- **Database:** MongoDB
- **API:** REST API
- **Data Format:** JSON
- **Version Control:** Git and GitHub
- **CI/CD:** GitHub Actions

## 3. Sprint 1 Schedule

**Duration:** 19 October 2026 – 23 October 2026

Sprint 1 focuses on setting up the project foundation, developing the initial frontend and backend, configuring the database, and implementing authentication and integration.

## 4. Team Members and Responsibilities

| Team Member | SRN | Responsibility | Module Directory |
|---|---|---|---|
| **NAVYA R** | PES2UG24CS308 | Frontend / User Interface | [`Sprint-1/navya/`](./navya/) |
| **Nikhil Raj G** | PES2UG24CS319 | Backend Setup | [`Sprint-1/nikhil_raj/`](./nikhil_raj/) |
| **Patnaikuni Sai Dheeraj** | PES2UG24CS341 | Database Setup | [`Sprint-1/dheeraj/`](./dheeraj/) |
| **Sohel Mahibubasa Chapparband** | PES2UG25CS826 | Authentication and Integration | [`Sprint-1/sohel - Authentication and Integration/`](./sohel%20-%20Authentication%20and%20Integration/) |

### Member 1 — NAVYA R: Frontend / User Interface
- Set up the React frontend.
- Develop the initial user interface and reusable components.
- Create registration and login screens.
- Design the interface to communicate with backend APIs.
- Ensure a responsive and user-friendly layout (`IPR-NF-004`, `TC-UI-01`).

### Member 2 — Nikhil Raj G: Backend Setup
- Set up Node.js and Express.js backend architecture.
- Organize backend routes, controllers, and middleware.
- Configure REST API endpoints (`/api/internships`, `/api/applications`, `/api/tests`, `/api/progress`, `/api/admin`).
- Implement request handling, input validation, and logging.
- Provide consistent API responses and centralized error handling (`SAD Section 4.4`).

### Member 3 — Patnaikuni Sai Dheeraj: Database Setup
- Configure the MongoDB connection with Mongoose ODM.
- Plan required schemas: `User`, `StudentProfile`, `Internship`, `Application`, `AptitudeTest`, `TestResult`, `PreparationProgress`.
- Support user data persistence and enforce unique indexing to prevent duplicate applications (`IPR-F-009`, `TC-Int-04`).
- Provide seeder script with test data matching STP Section 6.

### Member 4 — Sohel Mahibubasa Chapparband: Authentication and Integration
- Implement user registration (`IPR-F-001`, `TC-Auth-01`) and login (`IPR-F-002`, `TC-Auth-02`).
- Implement salted adaptive password hashing using bcrypt (`IPR-SR-002`).
- Support Student, Recruiter, and Admin roles via RBAC middleware (`IPR-F-003`, `TC-Auth-03`).
- Implement input sanitization to strip script payloads and prevent XSS (`IPR-SR-005`, `TC-Sec-05`).
- Integrate frontend authentication screens with backend REST APIs and MongoDB.
- Automated test runner verifying 100% test pass rate (`Sprint-1/sohel/integration/testRunner.js`).

## 5. Sprint 1 Deliverables

- 📄 [`Sprint-1-Deviations-and-Summary.md`](./Sprint-1-Deviations-and-Summary.md) - Detailed report of Sprint-1 activities, requirement traceability mapping, and architectural deviations explanation.
- 🎬 [`VIDEO_DEMO_GUIDE.md`](./VIDEO_DEMO_GUIDE.md) - 60-second video demo script and recording instructions.
- ⚙️ [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) - GitHub Actions CI pipeline automating PR checks and test executions.
- Working product: Unified frontend and backend running at `http://localhost:5000`.

## 6. Quick Start: Running the Modules

### Run Sohel's Module (Authentication & Integration)
```bash
cd Sprint-1/sohel
npm install
node integration/testRunner.js
```

### Run Dheeraj's Module (Database Setup & Seeder)
```bash
cd Sprint-1/dheeraj
npm install
npm run seed
```

### Run Nikhil Raj's Module (Backend Server)
```bash
cd Sprint-1/nikhil_raj
npm install
npm start
```

### Run Navya's Module (Frontend UI)
```bash
cd Sprint-1/navya
npm install
npm start
```

### Run the Integrated Working Product
```bash
# In the root repository directory
npm install
npm start
```
Open **`http://localhost:5000`** in your browser.

## 7. GitHub Workflow

1. Each member works in their assigned folder (`Sprint-1/<member_folder>`).
2. Commit changes using clear commit messages.
3. Push changes to a feature branch (e.g. `feature/sohel-auth-integration`).
4. Open a pull request (PR) against `main`.
5. GitHub Actions automatically executes the verification test suite.
6. Repository owners review and approve the changes.
7. Merge the approved PR.

## 8. Testing and Quality

Testing follows the submitted Software Test Plan (STP).

Verification checks:
- Frontend and backend startup.
- Database connectivity and fallback integrity.
- Valid and invalid registration and login (`TC-Auth-01`, `TC-Auth-02`).
- Password hashing and JWT protection (`TC-Sec-01`, `TC-Sec-02`).
- Role-based access restrictions (`TC-Auth-03`).
- Duplicate application prevention (`TC-Int-04`).
- XSS input sanitization (`TC-Sec-05`).

## 9. Project References

- Software Requirements Specification (SRS), Version 1.0
- Software Architecture and Design Specification (SAD), Version 1.0
- Software Test Plan (STP), Version 1.0

## 10. Sprint Status

- [x] Authentication and integration (Sohel - PES2UG25CS826)
- [x] GitHub Actions CI automation enabled (`.github/workflows/ci.yml`)
- [x] Sprint-1 Deviations and Summary documented (`Sprint-1-Deviations-and-Summary.md`)
- [x] Working product and 1-minute video demo script prepared (`VIDEO_DEMO_GUIDE.md`)
- [ ] Pull request review and merge
- [ ] One-minute demo video uploaded to repository

# Sprint 1 — Online Internship & Placement Preparation Portal

## 1. Project Overview

The **Online Internship & Placement Preparation Portal** is a web application designed to help students discover internship opportunities and prepare for placements.

The portal will allow students to manage profiles, search and apply for internships, track application status, take aptitude tests, and monitor preparation progress. Recruiters will manage internship listings and applications, while administrators will manage users and portal resources.

## 2. Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js and Express.js
- **Database:** MongoDB
- **API:** REST API
- **Data Format:** JSON
- **Version Control:** Git and GitHub

## 3. Sprint 1 Schedule

**Duration:** 19 October 2026 – 23 October 2026

Sprint 1 focuses on setting up the project foundation, developing the initial frontend and backend, configuring the database, and implementing authentication and integration.

## 4. Team Members and Responsibilities

| Team Member | SRN | Responsibility |
|---|---|---|
| NAVYA R | PES2UG24CS308 | Frontend / User Interface |
| Nikhil Raj G | PES2UG24CS319 | Backend Setup |
| Patnaikuni Sai Dheeraj | PES2UG24CS341 | Database Setup |
| Sohel Mahibubasa Chapparband | PES2UG25CS826 | Authentication and Integration |

### Member 1 — NAVYA R: Frontend / User Interface
- Set up the React frontend.
- Develop the initial user interface and reusable components.
- Create registration and login screens.
- Design the interface to communicate with backend APIs.
- Ensure a responsive and user-friendly layout.

### Member 2 — Nikhil Raj G: Backend Setup
- Set up Node.js and Express.js.
- Organize backend routes, controllers, and middleware.
- Configure REST API endpoints.
- Implement request handling and input validation.
- Provide consistent API responses and error handling.

### Member 3 — Patnaikuni Sai Dheeraj: Database Setup
- Configure the MongoDB connection.
- Plan the required collections and document structures.
- Support user data persistence.
- Define suitable data validation and integrity checks.
- Test database connectivity and database operations.

### Member 4 — Sohel Mahibubasa Chapparband: Authentication and Integration
- Implement user registration and login functionality.
- Implement secure password hashing.
- Support Student, Recruiter, and Admin roles.
- Integrate the frontend authentication screens with backend APIs.
- Connect authentication operations with MongoDB.
- Test authentication, authorization, validation, and error handling.

## 5. Sprint 1 Deliverables

- Initial frontend project setup.
- Initial backend project setup.
- MongoDB connectivity and initial data structure.
- Registration and login workflow.
- Initial frontend-backend integration.
- GitHub commits and reviewed pull requests.
- GitHub Actions automation for relevant commits and pull requests.
- A one-minute video demonstrating the working product.
- Documentation of any deviations from the submitted SRS, SAD, or STP.

## 6. GitHub Workflow

1. Each member works in their assigned folder or agreed project files.
2. Commit changes using clear commit messages.
3. Push changes to a feature branch.
4. Open a pull request (PR) against the agreed target branch.
5. Repository owners review and approve the changes.
6. Merge the approved PR.
7. Run the configured GitHub Actions checks and resolve failures.

## 7. Testing and Quality

Testing will follow the submitted Software Test Plan (STP).

Initial checks include:
- Frontend and backend startup.
- Database connectivity.
- Valid and invalid registration and login.
- Password protection.
- Role-based access restrictions.
- API integration and error responses.
- Basic input validation.

## 8. Project References

- Software Requirements Specification (SRS), Version 1.0
- Software Architecture and Design Specification (SAD), Version 1.0
- Software Test Plan (STP), Version 1.0

## 9. Sprint Status

Update this section as work progresses.

- [ ] Frontend setup
- [ ] Backend setup
- [ ] Database setup
- [ ] Authentication and integration
- [ ] GitHub Actions checks
- [ ] Pull request review and merge
- [ ] One-minute demo video uploaded
- [ ] Deviations documented

**Note:** Mark tasks complete only after the work has been implemented and verified.

