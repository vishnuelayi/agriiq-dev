# AuthContext.jsx

## Purpose
Provides global authentication and user profile state.

## Responsibilities
- Listen to Firebase auth state changes
- Fetch Firestore user profile
- Expose user, profile, and loading state

## State
- user: Firebase Auth user
- profile: Firestore user document
- loading: boolean

## Firestore Access
- users/{uid}

## Business Rules
- Profile fetched only after login
- Cleared on logout

## Edge Cases
- Auth delay on refresh
- Missing profile document

## Related Files
- hooks/useAuth.jsx
- routes/ProtectedRoute.jsx
