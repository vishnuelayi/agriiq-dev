# examService.js

## Purpose
Provides Firestore access for exam-related operations.

## Responsibilities
- Fetch published exams for users

## Firestore Collections Accessed
- exams

## Query Logic
- status == "published"

## Business Rules
- Users can only see published exams
- Draft or archived exams are hidden

## Security Rule Dependency
- Firestore allows read on published exams

## Related Files
- user/UserDashboard.jsx
