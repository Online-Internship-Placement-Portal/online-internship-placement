# Backend Setup Module (Sprint-1)

> **Team Member:** Nikhil Raj G  
> **SRN:** PES2UG24CS319  
> **Role:** Backend Setup  
> **Sprint Period:** 19th Oct to 23rd Oct  
> **Project:** Online Internship & Placement Preparation Portal  

---

## 📌 Module Responsibilities & Contributions

In accordance with the **SRS v1.0**, **SAD v1.0**, and **Software Test Plan (STP v1.0)**, this module configures the Node.js + Express.js backend architecture, routing layers, centralized error handling (with 400, 401, 403, 404, 409, 500 status codes), request logging, CORS, and environment configuration.

### REST API Endpoints Provided
| Method | Endpoint | Description | Role Required | Traceability |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Server uptime and health status | Public | `IPR-NF-001`, `IPR-NF-002` |
| `GET` | `/api/internships` | View & search internship opportunities | Public / Student | `IPR-F-006`, `IPR-F-007` |
| `GET` | `/api/internships/:id` | View specific internship details | Authenticated | `SAD Section 4.3` |
| `POST` | `/api/internships` | Create internship listing | Recruiter / Admin | `IPR-F-016`, `TC-Rec-01` |
| `POST` | `/api/internships/:id/applications`| Apply for internship (duplicate prevention) | Student | `IPR-F-008`, `IPR-F-009`, `TC-Int-04` |
| `GET` | `/api/applications/me` | View candidate's applications & status | Student | `IPR-F-010` |
| `GET` | `/api/applications` | Review candidate applications | Recruiter / Admin | `IPR-F-017` |
| `PUT` | `/api/applications/:id/status` | Shortlist or reject applicants | Recruiter / Admin | `IPR-F-017`, `TC-Rec-02` |
| `GET` | `/api/tests` | View aptitude tests | Authenticated | `IPR-F-011`, `TC-Test-01` |
| `POST` | `/api/tests/:id/submit` | Submit test & automatic scoring | Student | `IPR-F-012`, `TC-Test-02` |
| `GET` | `/api/progress/me` | Preparation progress & analytics | Student | `IPR-F-014`, `IPR-F-015` |
| `GET` | `/api/admin/stats` | System overview analytics | Admin | `IPR-F-018` |

---

## 📁 Directory Structure

```
Sprint-1/nikhil_raj/
├── src/
│   ├── app.js                  # Express pipeline & middleware registration
│   ├── server.js               # Server startup & graceful shutdown
│   ├── config/
│   │   └── env.js              # Environment variable parsing
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized error handler
│   │   └── requestLogger.js    # HTTP request logger
│   └── routes/
│       ├── internshipRoutes.js  # Internship CRUD & application logic
│       ├── applicationRoutes.js # Candidate application status workflow
│       ├── testRoutes.js        # Test retrieval & auto-grading
│       ├── progressRoutes.js    # Placement preparation progress
│       └── adminRoutes.js       # Admin stats & management
├── .env.example                # Sample environment variables
├── package.json                # Server dependencies
└── README.md                   # This documentation file
```

---

## 🚀 How to Run the Backend

```bash
cd Sprint-1/nikhil_raj
npm install
npm start
```
Server starts on `http://localhost:5000`. Test via browser: `http://localhost:5000/api/health`.
