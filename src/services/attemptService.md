# attemptService.js

## Purpose
Fetches the latest attempt for a user and exam.

## Firestore Collection
- attempts

## Query Logic
- userId + examId
- ordered by submittedAt DESC

## Business Rules
- Latest attempt is authoritative for display

## Related Files
- exam/ExamResult.jsx
