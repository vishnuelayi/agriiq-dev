# ExamCard.jsx

## Purpose
Displays a single exam summary card.

## Responsibilities
- Render exam metadata
- Present price and future purchase CTA

## Props
- exam: object

## Expected Data Shape
{
  id: string,
  title: string,
  description: string,
  questionCount: number,
  durationMinutes: number,
  price: number
}

## UI Behavior
- Buy button disabled (payment not implemented)

## Related Files
- user/UserDashboard.jsx
