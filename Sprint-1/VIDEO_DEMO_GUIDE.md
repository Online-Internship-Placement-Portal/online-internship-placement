# Sprint-1: 1-Minute Working Product Video Recording Guide

> **Project:** Online Internship & Placement Preparation Portal  
> **Sprint Period:** 19th Oct to 23rd Oct  
> **Course:** UE24CS341A - Software Engineering, 5th Sem, PES University  
> **Target Video Duration:** Exactly 60 seconds (1 minute)  

---

## 🎬 60-Second Video Demonstration Script

Follow this precise timeline to showcase a completely working product that covers all 4 team members' contributions within 60 seconds:

| Time | Scene / Screen | Action to Perform | Team Role Highlighted |
| :---: | :--- | :--- | :--- |
| **0:00 - 0:10** | **Login Page & Student Authentication** | Open `http://localhost:5000` (or `http://localhost:3000`). Click quick-demo button **Student (Sohel)**. Click **Sign In**. Show instant authentication & token generation. | **Sohel** (Authentication & JWT) & **Navya** (Login UI) |
| **0:11 - 0:22** | **Student Dashboard & Preparation Analytics** | View Student Dashboard. Point out **Placement Preparation Progress bar (65%)**, topics breakdown (Algorithms, Aptitude, Core CS), and active applications counter. | **Navya** (UI), **Dheeraj** (Database Schema), **Nikhil** (REST API) |
| **0:23 - 0:34** | **Internship Search & Duplicate Prevention** | Navigate to **Browse Internships**. Show search filtering by keyword ("Google"). Click **Apply for Internship**. Show success confirmation. Click Apply **again** to demonstrate **Duplicate Application Prevention (409 Conflict)** in action! | **Nikhil** (Backend API), **Sohel** (Integration), **Dheeraj** (Compound Unique Index) |
| **0:35 - 0:46** | **Aptitude Test & Auto Scoring** | Navigate to **Aptitude Tests**. Select answers for the 3 questions (e.g. Q1: 150 metres, Q2: O(n^2), Q3: 409). Click **Submit Assessment**. Show immediate **Automatic Score Calculation (3/3 - 100% Passed)**. | **Nikhil** (Auto Evaluation Engine) & **Sohel** (Test Verification) |
| **0:47 - 0:60** | **Recruiter Evaluation Workflow & Logout** | Click **Logout**. Sign in using **Recruiter (Google)**. Show candidate applicant list. Click **Shortlist** on the student application; watch status update to green **Shortlisted** instantly! Wrap up with repo overview. | **All Team Members** (Integrated Working Product) |

---

## 📹 Recommended Screen Recording Tools
1. **OBS Studio** (Free & Open Source) - Recommended
2. **Xbox Game Bar** (Built into Windows: press `Win + G`)
3. **Loom** / **Clipchamp**

## 📤 Upload Instructions to GitHub Repo
1. Save your recorded video as `Sprint-1/demo-sprint1.mp4` (or upload to GitHub Releases / provide YouTube/Drive unlisted link if file size exceeds 25MB).
2. Commit and push the video:
```bash
git add Sprint-1/demo-sprint1.mp4
git commit -m "Add Sprint-1 working product 1-minute video demo"
git push origin <your-branch>
```
