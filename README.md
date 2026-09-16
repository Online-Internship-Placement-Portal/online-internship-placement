# Online Internship & Placement Preparation Portal

> **Department of CSE, PES University**  
> **Course:** UE24CS341A - Software Engineering (5th Semester, AY 2026-27)  
> **Document:** Software Requirements Specification (SRS) v1.0  

---

## 📌 Project Overview

The **Online Internship & Placement Preparation Portal** is an integrated web-based platform built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It bridges the gap between students preparing for placement drives and recruiters seeking prospective interns.

The system empowers:
- **Students** to discover internship opportunities, track application statuses, attempt aptitude tests, and monitor their preparation progress with real-time analytics.
- **Recruiters** to post internship listings, evaluate candidate profiles, and manage shortlisting/rejection workflows.
- **Administrators** to oversee user accounts, manage tests/questions, and monitor system performance.

---

## Key Features

### 1. Student Module
- **User Authentication & Profile:** Secure registration, login, and academic profile maintenance (skills, resume, grade details).
- **Internship Search & Discovery:** Search and filter internships by title, company, location, and role type.
- **Application Workflow:** One-click internship application with duplicate application prevention and real-time status tracking (Submitted, Shortlisted, Rejected).
- **Aptitude Test Engine:** Interactive online test engine with automated scoring and immediate test result calculation.
- **Preparation Analytics:** Graphical tracking of placement preparation progress, score history, and performance analytics.

### 🏢 2. Recruiter Module
- **Listing Management:** Create, update, edit, and close internship postings.
- **Candidate Evaluation:** View applicant profiles, review resumes, and change application statuses (Shortlist / Reject).

### ⚙️ 3. Admin Module
- **User & Content Governance:** Manage student and recruiter accounts.
- **Test Repository Management:** Create and maintain aptitude test modules and question banks.
- **System Analytics:** Access overall platform metrics and system usage logs.

---

## 🛠️ Technology Stack & Architecture

### Tech Stack
| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **API Architecture** | RESTful APIs (JSON over HTTP/HTTPS) |
| **IDE / Version Control** | Visual Studio Code, Git & GitHub |

### System Architecture Flow


---

## System Requirements Summary

### Functional Requirements (18 Total)
- **Authentication:** `IPR-F-001` (Student Reg), `IPR-F-002` (Login), `IPR-F-003` (RBAC)
- **Profile:** `IPR-F-004` (Profile Update), `IPR-F-005` (Academic & Resume Management)
- **Internships:** `IPR-F-006` (Display Listings), `IPR-F-007` (Search/Filter), `IPR-F-008` (Apply), `IPR-F-009` (Prevent Duplicates), `IPR-F-010` (Track Status)
- **Aptitude Tests:** `IPR-F-011` (Take Tests), `IPR-F-012` (Auto Evaluation), `IPR-F-013` (Store Test History)
- **Progress & Analytics:** `IPR-F-014` (Record Progress), `IPR-F-015` (Performance Analytics)
- **Recruiter:** `IPR-F-016` (Manage Listings), `IPR-F-017` (Candidate Status Updates)
- **Admin:** `IPR-F-018` (System & Question Management)

### Non-Functional Requirements & Security (13 Total)
- **Performance:** Main dashboard loads within 3s (`IPR-NF-001`)
- **Reliability:** 99% availability (`IPR-NF-002`)
- **Scalability:** Supports 500 concurrent users (`IPR-NF-003`)
- **Usability:** Responsive across desktop, tablet, and mobile (`IPR-NF-004`)
- **Security:** Password hashing (`IPR-SR-002`), Input validation & sanitization (`IPR-NF-005`, `IPR-SR-005`), HTTPS/TLS communication (`IPR-SR-004`)

---

## System Models & Design

The project specification includes complete UML Use-Case Diagrams, Class Diagrams, Sequence Diagrams, and Activity Diagrams detailing:
1. **Student Module Use Case & Domain Model**
2. **Recruiter & Admin Module Use Case Model**
3. **Sequence Diagram for User Management**
4. **Activity Diagram for Internship Management**
5. **Requirements Traceability Matrix (RTM)** mapping all requirements to test cases `TC-AUTH-*`, `TC-INT-*`, `TC-TEST-*`, `TC-REC-*`, and `TC-ADMIN-*`.

---

## Project Team & Contributions

| S. No. | Student Name | SRN | Contribution |
| :---: | :--- | :--- | :--- |
| 1 | **Nikhil Raj G** | PES2UG24CS319 | Introduction & Overall Description |
| 2 | **NAVYA** | PES2UG24CS308 | External Interface Requirements & System Features |
| 3 | **Patnaikuni Sai Dheeraj** | PES2UG24CS341 | Non-Functional Requirements, Quality Attributes & Acceptance Tests |
| 4 | **Sohel M Chapparband** | PES2UG25CS826 | UML Use-Case Diagrams & Requirements Traceability Matrix (RTM) |

---

##  Repository Files

- [`README.md`](./README.md) - Project overview, features, tech stack, and documentation.
- [`SRS.pdf`](./SRS.pdf) - Complete Software Requirements Specification document.

---
*Submitted for Review - Department of CSE, PES University*
