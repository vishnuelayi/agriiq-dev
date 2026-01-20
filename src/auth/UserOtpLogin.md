# UserOtpLogin.jsx

## Purpose
Handles mobile number OTP-based authentication for users.

## Responsibilities
- Send OTP using Firebase Phone Auth
- Verify OTP
- Auto-create user profile in Firestore on first login

## UI Behavior
- Phone input → Send OTP
- OTP input appears only after OTP sent
- Invisible reCAPTCHA used

## State & Props
- phone: string
- otp: string
- confirmation: Firebase confirmation object

## Firestore Collections Accessed
### users/{uid}

## User Schema
{
  uid: string,
  phone: string,
  role: "user",
  blocked: boolean,
  createdAt: timestamp
}

## Business Rules
- User profile created only once
- Default role is "user"
- Blocked users handled later

## Edge Cases
- OTP resend
- Invalid OTP
- Network failure

## Firebase Security Rule Expectations
- Users can read/write their own profile
- Admin can read all users

## Related Files
- firebase/firebase.js
- app/App.jsx

