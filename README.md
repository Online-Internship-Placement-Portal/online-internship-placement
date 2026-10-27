# Online Internship & Placement Preparation Portal

> **Department of CSE, PES University**  
> **Course:** UE24CS341A - Software Engineering (5th Semester, AY 2026-27)  
> **Sprint-1 Period:** 19th October to 23rd October 2026  
> **Repository:** [online-internship-placement](https://github.com/Online-Internship-Placement-Portal/online-internship-placement)  

---

## 📌 Sprint-1 Working Product Overview

The **Online Internship & Placement Preparation Portal** is an integrated web-based platform built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It bridges the gap between students preparing for placement drives and recruiters seeking prospective interns.

This repository contains the complete deliverables for **Sprint-1**, including:
1. **Automated CI/CD Workflow with GitHub Actions** (`.github/workflows/ci.yml`)
2. **Four Dedicated Team Member Workspaces** for independent branches and pull requests
3. **Comprehensive Software Requirements & Test Coverage** mapping directly to the submitted **SRS v1.0**, **SAD v1.0**, and **STP v1.0**
4. **Working End-to-End Product** ready for live demonstration and the 1-minute outcome video

---

## 👥 Team Members & Sprint-1 Roles

| S. No. | Student Name | SRN | Assigned Module / Role | Directory |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Sohel Mahibubasa Chapparband** | `PES2UG25CS826` | **Authentication and Integration** | [`Sprint-1/sohel/`](./Sprint-1/sohel/) |
| 2 | **Navya R** | `PES2UG24CS308` | **User Interface (Frontend)** | [`Sprint-1/navya/`](./Sprint-1/navya/) |
| 3 | **Nikhil Raj G** | `PES2UG24CS319` | **Backend Setup** | [`Sprint-1/nikhil_raj/`](./Sprint-1/nikhil_raj/) |
| 4 | **Patnaikuni Sai Dheeraj** | `PES2UG24CS341` | **Database Setup** | [`Sprint-1/dheeraj/`](./Sprint-1/dheeraj/) |

---

## 🚀 Quick Start: Running the Working Product

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Online-Internship-Placement-Portal/online-internship-placement.git
cd online-internship-placement
npm install
```

### 2. Run the Automated Test Suite (100% Pass Rate)
```bash
npm test
```

### 3. Launch the Integrated Application
```bash
npm start
```
Open **`http://localhost:5000`** in any web browser to interact with the working system!

---

## 🎬 1-Minute Working Product Video Demo

- **Demonstration Guide & Script:** Refer to [`Sprint-1/VIDEO_DEMO_GUIDE.md`](./Sprint-1/VIDEO_DEMO_GUIDE.md) for a second-by-second walkthrough.
- **Pre-seeded Demo Accounts:**
  - **Student:** `sohel@pes.edu` / `Password123`
  - **Recruiter:** `recruiter@google.com` / `RecruiterPass123`
  - **Administrator:** `admin@pes.edu` / `AdminPass123`

---

## 📁 Repository Structure

```
online-internship-placement/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated testing & PR verification pipeline
│       └── pr-automation.yml       # PR title and compliance checker
├── Sprint-1/
│   ├── README.md                  # Sprint-1 summary and module launch instructions
│   ├── Sprint-1-Deviations-and-Summary.md # Deviations & traceability matrix report
│   ├── VIDEO_DEMO_GUIDE.md        # 1-minute video demo script and recording instructions
│   ├── sohel/                     # Sohel: JWT Auth, RBAC, Security Sanitization & E2E Tests
│   ├── navya/                     # Navya: React UI, Dashboards & Responsive Design
│   ├── nikhil_raj/                # Nikhil Raj: Express REST APIs, Route Handlers & Logger
│   └── dheeraj/                   # Dheeraj: MongoDB Connection, Mongoose Schemas & Seeder
├── public/
│   └── index.html                 # Integrated Single-Page Working Application
├── server.js                      # Unified Server Entrypoint (Sprint-1)
├── package.json                   # Root package definitions and scripts
└── README.md                      # Project master readme
```

---

## 📑 Traceability & Documentation
- **Requirements Traceability Matrix:** See Section 2 of [`Sprint-1-Deviations-and-Summary.md`](./Sprint-1/Sprint-1-Deviations-and-Summary.md).
- **Test Results & Metrics:** Executed via `node Sprint-1/sohel/integration/testRunner.js`.

---
*Department of Computer Science & Engineering, PES University*
