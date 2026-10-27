# Database Setup — Sprint 1

**Team member:** Patnaikuni Sai Dheeraj (PES2UG24CS341)  
**Responsibility:** MongoDB database setup

## Scope

This folder records the initial MongoDB data model for the Online Internship & Placement Preparation Portal. The project README specifies MongoDB with a Node.js/Express backend. This is a proposed starting point for the backend and authentication work to integrate; collection and field names should be kept consistent with the API contract agreed by the team.

## Collections

| Collection | Purpose | Key fields |
|---|---|---|
| `users` | Student, recruiter, and admin accounts | `name`, `email`, `passwordHash`, `role`, `createdAt`, `updatedAt` |
| `internships` | Recruiter-created internship listings | `recruiterId`, `title`, `company`, `location`, `description`, `status`, `createdAt`, `updatedAt` |
| `applications` | Student applications and their status history | `studentId`, `internshipId`, `status`, `appliedAt`, `updatedAt` |
| `tests` | Aptitude test definitions | `title`, `description`, `durationMinutes`, `questionIds`, `isActive` |
| `questions` | Reusable test question bank | `testId`, `prompt`, `options`, `correctOption`, `points` |
| `testAttempts` | Student submissions and results | `studentId`, `testId`, `answers`, `score`, `startedAt`, `submittedAt` |
| `progressRecords` | Preparation progress and analytics history | `studentId`, `category`, `value`, `recordedAt` |

MongoDB's generated `_id` is used as each document's primary identifier. References between collections store the related document's `ObjectId`.

## Integrity and security

- Store normalized email addresses and enforce a unique index on `users.email`.
- Restrict `users.role` to `student`, `recruiter`, or `admin`; validate required fields at the API boundary and in MongoDB schema validation where practical.
- Store only a password hash in `users.passwordHash`; never persist or return a plaintext password.
- Add a unique compound index on `applications.studentId` and `applications.internshipId` to prevent duplicate applications.
- Index `internships.status` and common discovery fields such as `location`; index `applications.studentId` and `applications.internshipId` for student and recruiter views.
- Validate referenced IDs and authorize access in the backend. MongoDB references alone do not enforce foreign-key constraints or permissions.
- Keep credentials in environment variables (for example, `MONGODB_URI` and `MONGODB_DB_NAME`), outside source control.

## Initial setup checklist

- [ ] Agree collection and field names with the backend and authentication contributors.
- [ ] Configure the MongoDB URI and database name through environment variables.
- [ ] Connect to MongoDB during backend startup and handle connection failures safely.
- [ ] Create the unique and query-supporting indexes above.
- [ ] Add MongoDB validators for required fields and allowed enum values.
- [ ] Verify valid writes, invalid writes, duplicate email rejection, and duplicate application rejection.
- [ ] Document the chosen local or hosted MongoDB setup without committing credentials.

The current repository does not yet include backend source code, so this document defines the proposed database baseline rather than claiming a live connection or tested implementation.
