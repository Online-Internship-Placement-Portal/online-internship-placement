# User Interface (Frontend) Module (Sprint-1)

> **Team Member:** Navya R  
> **SRN:** PES2UG24CS308  
> **Role:** User Interface (Frontend)  
> **Sprint Period:** 19th Oct to 23rd Oct  
> **Project:** Online Internship & Placement Preparation Portal  

---

## 📌 Module Responsibilities & Contributions

In accordance with the **SRS v1.0**, **SAD v1.0**, and **Software Test Plan (STP v1.0)**, this module delivers the frontend user interface built with React.js, responsive layouts, role-based navigation, and student/recruiter/admin interactive views.

### User Interface Views & Features
| Screen / Component | Functional Capabilities | Traceability | STP Test Case |
| :--- | :--- | :--- | :--- |
| **Login (`Login.jsx`)** | Email & password auth with quick demo account buttons | `IPR-F-002`, `IPR-SR-001` | `TC-Auth-02`, `TC-Sec-01` |
| **Registration (`Register.jsx`)** | Student sign up with department and validations | `IPR-F-001` | `TC-Auth-01` |
| **Student Dashboard (`StudentDashboard.jsx`)** | Progress bars, application tracker table, benchmark scores | `IPR-F-010`, `IPR-F-014`, `IPR-F-015` | `TC-Prof-01`, `TC-Prog-01` |
| **Internship Search (`InternshipList.jsx`)** | Live search, type filter, one-click apply & duplicate blocker alert | `IPR-F-006`, `IPR-F-007`, `IPR-F-008`, `IPR-F-009` | `TC-Int-01`, `TC-Int-02`, `TC-Int-03`, `TC-Int-04` |
| **Aptitude Test Engine (`AptitudeTestView.jsx`)** | Interactive quiz, auto score computation, evaluation breakdown | `IPR-F-011`, `IPR-F-012` | `TC-Test-01`, `TC-Test-02` |
| **Recruiter Dashboard (`RecruiterDashboard.jsx`)** | Post internships, candidate review & Shortlist/Reject workflow | `IPR-F-016`, `IPR-F-017` | `TC-Rec-01`, `TC-Rec-02` |
| **Admin Dashboard (`AdminDashboard.jsx`)** | System metrics, user account table, platform health | `IPR-F-018` | `TC-Admin-01` |

---

## 📁 Directory Structure

```
Sprint-1/navya/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Role-aware navigation bar
│   ├── pages/
│   │   ├── Login.jsx           # Sign in view
│   │   ├── Register.jsx        # Registration view
│   │   ├── StudentDashboard.jsx# Student stats & application status
│   │   ├── InternshipList.jsx  # Internship search & apply
│   │   ├── AptitudeTestView.jsx# Quiz engine & auto grading
│   │   ├── RecruiterDashboard.jsx# Recruiter candidate workflow
│   │   └── AdminDashboard.jsx  # System administration
│   ├── App.jsx                 # Master application routing & state
│   ├── index.jsx               # React DOM render entrypoint
│   └── styles.css              # Responsive styling (desktop, tablet, mobile)
├── package.json                # React dependencies
└── README.md                   # This documentation file
```

---

## 🚀 How to Run the Frontend

```bash
cd Sprint-1/navya
npm install
npm start
```
Runs at `http://localhost:3000`.
