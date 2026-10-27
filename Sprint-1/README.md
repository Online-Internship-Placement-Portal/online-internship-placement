# Sprint-1 Deliverables Overview

> **Project:** Online Internship & Placement Preparation Portal  
> **Course:** UE24CS341A - Software Engineering (5th Semester, AY 2026-27)  
> **Sprint Timeline:** 19th October to 23rd October 2026  
> **Department:** Computer Science and Engineering, PES University  

---

## 👥 Team Members, Roles & Directory Allocation

| Member Name | SRN | Assigned Sprint-1 Role | Directory Path |
| :--- | :--- | :--- | :--- |
| **Sohel Mahibubasa Chapparband** | `PES2UG25CS826` | **Authentication and Integration** | [`Sprint-1/sohel/`](./sohel/) |
| **Navya R** | `PES2UG24CS308` | **User Interface (Frontend)** | [`Sprint-1/navya/`](./navya/) |
| **Nikhil Raj G** | `PES2UG24CS319` | **Backend Setup** | [`Sprint-1/nikhil_raj/`](./nikhil_raj/) |
| **Patnaikuni Sai Dheeraj** | `PES2UG24CS341` | **Database Setup** | [`Sprint-1/dheeraj/`](./dheeraj/) |

---

## 📂 Sprint-1 Deliverables & Documentation

- 📄 [`Sprint-1-Deviations-and-Summary.md`](./Sprint-1-Deviations-and-Summary.md) - Complete documentation of Sprint-1 activities, requirement traceability mapping, and architectural deviations explanation.
- 🎬 [`VIDEO_DEMO_GUIDE.md`](./VIDEO_DEMO_GUIDE.md) - Step-by-step 60-second video recording script demonstrating the working product.
- ⚙️ [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) - GitHub Actions CI workflow automating PR checks, test suites, and commit verifications.

---

## 🚀 Quick Start: Running the Modules

### 1. Run Sohel's Module (Authentication & Integration)
```bash
cd Sprint-1/sohel
npm install
node integration/testRunner.js
```

### 2. Run Dheeraj's Module (Database Setup & Seeder)
```bash
cd Sprint-1/dheeraj
npm install
npm run seed
```

### 3. Run Nikhil Raj's Module (Backend Server)
```bash
cd Sprint-1/nikhil_raj
npm install
npm start
```

### 4. Run Navya's Module (Frontend UI)
```bash
cd Sprint-1/navya
npm install
npm start
```

---

## 🌐 Running the Full Integrated Product (One-Command Launch)
To launch the complete working product for the video demonstration:

```bash
# In the root repository directory
npm install
npm run dev
```
Open **`http://localhost:5000`** in your browser to interact with the working system!
