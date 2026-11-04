# Sprint 2 — Online Internship & Placement Preparation Portal

> **Course:** UE24CS341A - Software Engineering (5th Semester, AY 2026-27)  
> **Department:** Department of Computer Science and Engineering, PES University  
> **Sprint Duration:** 26 October 2026 – 30 October 2026  
> **Status:** Sprint-2 Feature Complete & Development Freeze

---

## 1. Project Overview

The **Online Internship & Placement Preparation Portal** is a unified, full-stack web platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It empowers PES University students to manage academic placement profiles, discover and filter internship listings, submit applications with duplicate prevention, attend online aptitude assessments with automated scoring, monitor category-wise preparation progress, and track application pipelines.

Recruiters manage company listings, review applicant resumes, schedule interviews, and deliver feedback. Administrators govern user accounts, monitor system health metrics, manage the question bank, and oversee platform integrity.

---

## 2. Sprint 2 Team Members & Module Allocations

| Team Member | SRN | Responsibility | Module Directory |
|---|---|---|---|
| **Patnaikuni Sai Dheeraj** | PES2UG24CS341 | Database Setup & Persistence | [`Sprint-2/dheeraj/`](./dheeraj/) |
| **Nikhil Raj G** | PES2UG24CS319 | Backend Setup & REST APIs | [`Sprint-2/nikhil_raj/`](./nikhil_raj/) |
| **NAVYA R** | PES2UG24CS308 | User Interface (Frontend) | [`Sprint-2/navya/`](./navya/) |
| **Sohel Mahibubasa Chapparband** | PES2UG25CS826 | Authentication & Integration | [`Sprint-2/sohel - Authentication and Integration/`](./sohel%20-%20Authentication%20and%20Integration/) |

---

## 3. Sprint 2 Deliverables Summary

- 📄 [`Sprint-2-Deviations-and-Summary.md`](./Sprint-2-Deviations-and-Summary.md): Detailed report of Sprint-2 activities, 100% Requirement Traceability Matrix (RTM) mapping, and architectural compliance analysis.
- 🎬 [`VIDEO_DEMO_GUIDE.md`](./VIDEO_DEMO_GUIDE.md): 2-minute video demo script with scene-by-scene timing and demonstration steps.
- ⚙️ Modular codebases in each team member's respective directory.
- 🚀 Unified, working product running at `http://localhost:5000`.

---

## 4. Quick Start: Running the Modules

### Run Sohel's Module (Authentication & Integration Test Suite)
```bash
cd "Sprint-2/sohel - Authentication and Integration"
npm install
node integration/testRunner.js
```

### Run Dheeraj's Module (Database Seeder)
```bash
cd "Sprint-2/dheeraj"
npm install
npm run seed
```

### Run Nikhil Raj's Module (Backend REST API)
```bash
cd "Sprint-2/nikhil_raj"
npm install
npm start
```

### Run the Integrated Portal Server
```bash
cd "C:\Users\HP\Desktop\SE\Sprint-1\online-internship-placement"
npm start
```
Open **`http://localhost:5000`** in any web browser.
