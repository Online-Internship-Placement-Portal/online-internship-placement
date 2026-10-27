# Authentication & Integration Module (Sprint-1)

> **Team Member:** Sohel Mahibubasa Chapparband  
> **SRN:** PES2UG25CS826  
> **Role:** Authentication and Integration  
> **Sprint Period:** 19th Oct to 23rd Oct  
> **Project:** Online Internship & Placement Preparation Portal  

---

## 📌 Module Responsibilities & Contributions

In accordance with the **SRS v1.0**, **SAD v1.0**, and **Software Test Plan (STP v1.0)**, this module delivers the end-to-end user authentication, role-based access authorization, security sanitization, and subsystem integration for Sprint-1.

### Requirements Implemented & Traceability
| Requirement ID | Description | Component | STP Test Case | Status |
| :--- | :--- | :--- | :--- | :---: |
| **IPR-F-001** | Student registration with personal & academic details | Auth Controller | `TC-Auth-01` | **COMPLETED** |
| **IPR-F-002** | User login & authentication returning JWT token | Auth Controller | `TC-Auth-02` | **COMPLETED** |
| **IPR-F-003** | Role-Based Access Control (Student, Recruiter, Admin) | RBAC Middleware | `TC-Auth-03` | **COMPLETED** |
| **IPR-SR-001** | Authentication protection of endpoints & rejection of invalid tokens | Auth Middleware | `TC-Sec-01` | **COMPLETED** |
| **IPR-SR-002** | Salted adaptive password hashing (bcrypt, salt rounds = 10) | Auth Controller | `TC-Sec-02` | **COMPLETED** |
| **IPR-SR-003** | Role authorization enforcement | RBAC Middleware | `TC-Sec-03` | **COMPLETED** |
| **IPR-SR-005** | Server-side input sanitization & XSS payload stripping | Sanitize Middleware | `TC-Sec-05` | **COMPLETED** |

---

## 📁 Directory Structure

```
Sprint-1/sohel/
├── controllers/
│   └── authController.js       # Register, Login, getMe controllers with bcrypt & JWT
├── middleware/
│   ├── authMiddleware.js       # Bearer token verification middleware
│   ├── rbacMiddleware.js       # Role authorization middleware (Student/Recruiter/Admin)
│   └── sanitizeMiddleware.js   # XSS and payload sanitization
├── routes/
│   └── authRoutes.js           # Express router endpoints (/register, /login, /me)
├── tests/
│   ├── auth.test.js            # Unit & functional tests (TC-Auth-01, TC-Auth-02)
│   ├── rbac.test.js            # RBAC role access tests (TC-Auth-03)
│   └── integration.test.js     # Security & E2E integration tests (TC-Sec-01, TC-Sec-05)
├── integration/
│   └── testRunner.js           # Automated standalone test execution script & metrics
├── package.json                # Module package definition and dependencies
└── README.md                   # This documentation file
```

---

## 🔑 REST API Specifications

### 1. Register User
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Sohel Chapparband",
  "email": "sohel@pes.edu",
  "password": "Password123",
  "role": "student",
  "department": "Computer Science and Engineering"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "67160abc12345...",
    "name": "Sohel Chapparband",
    "email": "sohel@pes.edu",
    "role": "student"
  }
}
```

### 2. Login User
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "sohel@pes.edu",
  "password": "Password123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication successful.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "67160abc12345...",
    "name": "Sohel Chapparband",
    "email": "sohel@pes.edu",
    "role": "student"
  }
}
```

### 3. Get Current User Profile
- **Method:** `GET`
- **Endpoint:** `/api/auth/me`
- **Headers:** `Authorization: Bearer <jwt-token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "67160abc12345...",
    "name": "Sohel Chapparband",
    "email": "sohel@pes.edu",
    "role": "student",
    "department": "Computer Science and Engineering"
  }
}
```

---

## 🧪 Automated Test Execution

To execute the automated test runner and verify 100% test pass rate according to STP Section 14:

```bash
cd Sprint-1/sohel
node integration/testRunner.js
```
