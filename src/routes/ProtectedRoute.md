# ProtectedRoute.jsx

## Purpose
Guards routes based on auth and role.

## Responsibilities
- Redirect unauthenticated users
- Enforce admin-only access

## Props
- adminOnly: boolean

## Business Rules
- Users must be logged in
- Admin routes require role === "admin"

## Related Files
- hooks/useAuth.jsx
- auth/AuthContext.jsx
