# Security Specification for MK Vocational & Training Center

## 1. Data Invariants
- A `Student` must have a valid `userId`.
- `Attendance` records are daily; a student can only have one record per day (enforced by app logic + document ID pattern `studentId_YYYY-MM-DD`).
- `Applications` start with status `pending`.
- `markedBy` in `Attendance` must be the current authenticated user's UID.

## 2. The Dirty Dozen Payloads (Red Team Test Cases)
1. **Identity Spoofing**: Student tries to change their `role` to `admin` in `/users/{userId}`.
2. **Identity Spoofing**: Anonymous user tries to read `/users`.
3. **Identity Spoofing**: Student tries to read another student's `/users` profile.
4. **State Shortcutting**: New applicant tries to submit an application with status `approved`.
5. **State Shortcutting**: Student tries to change their application status from `rejected` to `approved`.
6. **Resource Poisoning**: User tries to create an attendance record with a 1MB string for `status`.
7. **Resource Poisoning**: User tries to use a very long `studentId` (ID Poisoning).
8. **Malicious Ownership**: User A tries to mark attendance for User B by setting `studentId` to User B's ID.
9. **Tampering**: User tries to change the `createdAt` timestamp on an existing document.
10. **Privilege Escalation**: User tries to create a document in `/admins/`.
11. **Bypassing Invariants**: User tries to mark attendance without a `timestamp`.
12. **Unauthorized Deletion**: Student tries to delete their attendance record after marked.

## 3. Implementation Strategy
- Use `isValidId()` for all document IDs.
- Use `isValidUser()`, `isValidStudent()`, `isValidAttendance()`, `isValidApplication()` helpers.
- `isAdmin()` helper looks up `/admins/$(request.auth.uid)`.
- `allow update` uses `affectedKeys().hasOnly()` to prevent role manipulation.
