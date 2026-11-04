# Sprint 2 — 2-Minute Working Product Video Demo Guide

> **Project:** Online Internship & Placement Preparation Portal  
> **Course:** UE24CS341A - Software Engineering, PES University  
> **Requirement:** 3.b "Record a two minute video of the outcome of the second Sprint. [It should be a working product]"  
> **Target Video Duration:** Exactly 120 seconds (2 minutes)  
> **Output File Destination:** `Sprint-2/demo-sprint2.mp4`

---

## 1. Quick Setup Before Recording

1. Start your portal server:
   ```powershell
   cd "C:\Users\HP\Desktop\SE\Sprint-1\online-internship-placement"
   npm start
   ```
2. Open your web browser to **`http://localhost:5000`**.
3. Open your screen recorder (e.g., OBS Studio, Xbox Game Bar `Win + G`, or Chrome Screen Recorder). Set recording resolution to 1080p (1920x1080).

---

## 2. Timed Scene-by-Scene Demo Script (120 Seconds)

### Scene 1: Introduction & Architecture (0:00 – 0:15) [15s]
- **Action:** Show the portal home page with the PES University banner and active navigation bar.
- **Spoken Commentary:**
  > *"Welcome to the Sprint-2 final demonstration of the Online Internship & Placement Preparation Portal for Department of CSE, PES University. Built on the MERN stack with strict adherence to SRS, SAD, and STP specifications, Sprint-2 delivers a complete, role-based working platform for Students, Recruiters, and Administrators."*

---

### Scene 2: Student Authentication & Placement Profile (0:15 – 0:35) [20s]
- **Action:** Click "Student (Sohel)" quick-fill button, click "Sign In", then navigate to **"My Profile"**. Show CGPA (8.92), USN (PES2UG25CS826), skills badges, and edit bio or CGPA to `9.1` and save.
- **Spoken Commentary:**
  > *"Logging in as a student using JWT authentication with salted bcrypt hashing, we navigate to the comprehensive Student Profile module. Here students maintain verified academic records, CGPA, semester, skills, and resume links with strict input validation."*

---

### Scene 3: Internship Catalog Search, Filtering & 1-Click Apply (0:35 – 0:50) [15s]
- **Action:** Click **"Browse Internships"**. Type `"Google"` in search, apply filter `"Full-time"`, click on Google SWE listing, and click **"Apply Now"** with a custom cover note.
- **Spoken Commentary:**
  > *"Students can search and filter internship opportunities by role, location, and company in real-time. With a single click, students submit an application including customized cover notes and verified profile credentials."*

---

### Scene 4: Duplicate Application Blocker (0:50 – 1:00) [10s]
- **Action:** Immediately click **"Apply Now"** on the same Google internship again. Point to the red **409 Conflict** error message: *"Conflict: Duplicate application detected. You have already submitted an application for this internship."*
- **Spoken Commentary:**
  > *"To enforce business integrity and data constraints per IPR-F-009, the portal physically blocks duplicate submissions using a compound unique index, returning a clear 409 Conflict notification."*

---

### Scene 5: Aptitude Test Engine, Auto-Scoring & Test History (1:00 – 1:20) [20s]
- **Action:** Navigate to **"Aptitude Tests"**. Click **"Start Assessment"** on Technical Assessment. Show the countdown timer. Answer the 5 questions, click **"Submit Test"**. Point to the instant 100% score card, pass status, and question-by-question explanations review. Click **"Test History"** to show historical progression.
- **Spoken Commentary:**
  > *"The Aptitude Test subsystem delivers timed online assessments without leaking answer keys. Upon submission, the engine calculates scores in real-time, displays question explanations, and logs attempts in the permanent Test History."*

---

### Scene 6: Placement Preparation Progress & Analytics (1:20 – 1:35) [15s]
- **Action:** Return to **"Dashboard"**. Point out the **Placement Readiness Index (78%)**, category breakdown cards (Data Structures, Algorithms, Core CS), and toggle a topic checkbox to watch the progress bar dynamically update.
- **Spoken Commentary:**
  > *"The placement analytics dashboard aggregates performance across Data Structures, Algorithms, and Core CS, providing students with actionable readiness benchmarks against university placement standards."*

---

### Scene 7: Recruiter Management & Status Pipeline (1:35 – 1:50) [15s]
- **Action:** Click Logout. Sign in as **"Recruiter (Google)"**. Navigate to **"Candidate Applications"**. Show applicant cards, review Sohel's resume, and update status from "Under Review" to **"Interview Scheduled"** with meeting link and feedback note.
- **Spoken Commentary:**
  > *"Switching to the Recruiter view, company partners can create new listings and manage candidate pipelines. Recruiters can inspect student CGPA, review resumes, and schedule interviews with custom feedback notes."*

---

### Scene 8: Admin Governance & Test Quality Gate (1:50 – 2:00) [10s]
- **Action:** Log in as **"Admin (PES)"**. Show the Admin Governance dashboard with live metrics (Platform Health: 99.9%, registered users, active tests). Briefly flash terminal showing **`node integration/testRunner.js` with 100% Pass Rate**.
- **Spoken Commentary:**
  > *"Finally, administrators govern user access and monitor system health. Backed by a 100% automated test pass rate across 26 test cases, Sprint-2 represents a complete, verified, and frozen software deliverable. Thank you."*

---

## 3. Saving the Video
Save the recorded video as `demo-sprint2.mp4` in `Sprint-2/` directory:
`C:\Users\HP\Desktop\SE\Sprint-1\online-internship-placement\Sprint-2\demo-sprint2.mp4`
