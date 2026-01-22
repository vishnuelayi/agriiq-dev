# PaymentModal.jsx

## Purpose
Collects manual UPI payment details from user.

## Responsibilities
- Display admin-configured UPI info
- Accept transaction reference ID
- Create payment request

## Props
- exam
- onClose

## Firestore Dependency
- settings/payment
- payments

## Business Rules
- No payment auto-approval
- Exam unlocked only after admin approval

## Related Files
- services/paymentService.js
