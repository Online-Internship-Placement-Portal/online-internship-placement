# Authentication and Integration — Sprint 1

## 1. Assignment Details

**Project:** Online Internship & Placement Preparation Portal

**Team Member:** Sohel Mahibubasa Chapparband

**SRN:** PES2UG25CS826

**Sprint:** Sprint 1

**Duration:** 19 October 2026 – 23 October 2026

**Role:** Authentication and Integration

## 2. Objective

Implement secure user authentication and connect the frontend, backend, and database components so that users can register and log in to the portal.

The implementation must follow the submitted SRS, SAD, and STP documents.

## 3. Responsibilities

### A. User Registration
- Integrate the registration form with the backend.
- Validate required user details.
- Store user information in MongoDB through the backend.
- Prevent duplicate accounts where required.
- Store passwords using secure password hashing, never as plaintext.

### B. User Login
- Integrate the login form with the authentication API.
- Verify submitted credentials securely.
- Return appropriate success and error responses.
- Handle invalid credentials without exposing sensitive information.

### C. Role-Based Access Control
Support the three project roles:

- **Student:** Access student-facing features.
- **Recruiter:** Access recruiter-specific functionality.
- **Admin:** Access administration functionality.

Ensure that protected backend endpoints verify the user's authentication and permissions.

### D. Frontend and Backend Integration
- Connect the React registration and login screens to the Express backend.
- Use REST APIs and JSON request/response data.
- Integrate with the agreed backend routes and MongoDB user data.
- Handle loading states, successful responses, validation errors, and server errors.
- Ensure frontend routes do not substitute for backend authorization checks.

### E. API Integration

The SAD identifies these authentication endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |

Coordinate with the backend member to agree on request fields, response formats, authentication mechanism, and error handling before integration.

## 4. Security Requirements

- Hash passwords securely before storage.
- Never store plaintext passwords.
- Validate and sanitize user input.
- Enforce role-based authorization on protected backend routes.
- Avoid exposing passwords, secrets, or sensitive authentication details in API responses or logs.
- Use HTTPS/TLS in deployment, as specified in the SAD.
- Handle invalid input and authentication failures appropriately.

## 5. Testing Checklist

- [ ] Register a user with valid details.
- [ ] Reject invalid or incomplete registration data.
- [ ] Handle duplicate registration attempts.
- [ ] Log in with valid credentials.
- [ ] Reject incorrect credentials.
- [ ] Confirm passwords are stored as hashes.
- [ ] Verify role-specific access restrictions.
- [ ] Verify protected endpoints reject unauthenticated requests.
- [ ] Test frontend-to-backend API communication.
- [ ] Test backend-to-MongoDB operations.
- [ ] Check appropriate error responses.
- [ ] Record defects and retest fixes.

## 6. Sprint 1 Deliverables

- Registration and login integration.
- Secure password handling.
- Initial role-based authorization.
- Frontend-backend authentication integration.
- Authentication test results.
- Source code committed to GitHub.
- Pull request raised for review.
- Changes merged after approval.

## 7. GitHub Contribution Workflow

1. Implement authentication and integration changes.
2. Test the changes locally.
3. Commit the work with a meaningful message.
4. Push the changes to the agreed feature branch.
5. Open a pull request for review.
6. Resolve review comments and GitHub Actions failures.
7. Merge after approval by the repository owners.

**Suggested commit message:** `Sohel: Authentication and Integration`

## 8. Dependencies

- React registration and login screens from the frontend member.
- Express backend setup and API contracts from the backend member.
- MongoDB connection and user data structure from the database member.

Coordinate API names, request/response formats, and role definitions with the team before integrating.

## 9. Deviations and Notes

Document any changes from the submitted SRS, SAD, or STP here, including the reason, impact, and approval where applicable.

- **Deviation:** To be recorded if applicable.
- **Reason:** To be recorded if applicable.
- **Impact:** To be recorded if applicable.

## 10. Status

- [ ] Registration
- [ ] Login
- [ ] Password hashing
- [ ] Role-based authorization
- [ ] Frontend-backend integration
- [ ] MongoDB integration
- [ ] Authentication tests
- [ ] Pull request review and merge

**Note:** Update the checklist and status based on verified implementation progress.
