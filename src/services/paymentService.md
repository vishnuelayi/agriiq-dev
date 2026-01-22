# paymentService.js

## Purpose
Handles payment-related Firestore operations.

## Responsibilities
- Fetch UPI payment settings
- Create payment request documents

## Firestore Collections
- settings/payment
- payments

## Business Rules
- Payment is always created as "pending"
- Approval handled by admin later

## Security Rules Dependency
- Users: read settings, create payments
- Admins: write settings, manage payments

## Related Files
- components/PaymentModal.jsx
