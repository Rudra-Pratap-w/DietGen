# Dynamic AI Macros & Suggestions Architecture

This document outlines the technical strategy to transition the app from static hardcoded values (like 120g Protein, 69% progress) to dynamic, hyper-personalized data powered by AI.

## User Review Required

> [!WARNING]
> **API Key Security:** Do not call OpenAI, Gemini, or Claude directly from your React Native frontend components. If you do, your API keys will be exposed in the mobile app bundle, leading to potential abuse and high costs. We must use a backend solution.

We have two primary options for the backend to handle AI requests securely. Please review and let me know your preference:
1. **Expo API Routes:** We can create an `app/api/...` folder in this project to act as a lightweight backend.
2. **Supabase Edge Functions:** We can write serverless TypeScript functions hosted directly on your existing Supabase project.

*My Recommendation:* Since you are already heavily invested in Supabase, using **Supabase Edge Functions** is the most professional architecture and pairs perfectly with your database.

## Proposed Changes

To achieve dynamic macros and AI suggestions, we need to implement a three-step flow: Fetch User Data -> Generate AI Data -> Render Dynamic UI.

### 1. Database Schema Update (Supabase)

We need to store the AI's calculations so we don't have to call the expensive AI API every single time the user opens the app.

#### [MODIFY] Supabase `profile` table (or new `diet_plans` table)
Add the following columns to store the generated targets:
- `target_calories` (Integer)
- `target_protein` (Integer)
- `target_carbs` (Integer)
- `target_fats` (Integer)
- `ai_meal_plan` (JSONB) - To store the actual suggested meals.

### 2. Backend AI Service

#### [NEW] Backend Function (e.g., Supabase Edge Function: `generate-diet`)
This function will:
1. Take the user's profile data (Age, Height, Weight, Allergies, Diet type).
2. Construct a prompt: *"Create a daily macronutrient breakdown and 3 meals for a [Age] year old weighing [Weight]kg who is [Diet] and allergic to [Allergies]. Return STRICTLY as JSON: { calories: number, protein: number... }"*
3. Call the AI API (OpenAI/Gemini).
4. Save the exact JSON response back to the user's Supabase database row.

### 3. Frontend Dynamic Rendering

#### [MODIFY] `app/(app)/(TABS)/index.tsx`
- We will add a `useEffect` that checks if `target_calories` exists in the user's profile.
- If it is `null`, we show a loading spinner and call the backend AI function to generate it.
- If it exists, we load it into state.

#### [MODIFY] `app/(app)/components/ui/Macros.tsx`
Instead of hardcoded values, this component will accept props:
```tsx
const Macros = ({ protein, carbs, fats }) => { ... }
```

#### [MODIFY] `app/(app)/components/ui/progressCircle.tsx`
Update to accept dynamic limits:
```tsx
<ProgressCircle progress={currentCalories} value={targetCalories} />
```

## Open Questions

> [!IMPORTANT]
> 1. Do you want to use **Supabase Edge Functions** or **Expo API Routes** to hide your AI API Keys?
> 2. Which AI Provider do you intend to use? (OpenAI, Google Gemini, Anthropic Claude)?

## Verification Plan

### Automated/Manual Testing
1. Complete the onboarding flow with a test user (e.g., Vegan, 70kg).
2. Verify the index screen shows a loading state while "Generating AI Profile...".
3. Verify the generated Macro values match expected vegan/70kg ranges.
4. Verify the database updates correctly without exposing any API keys to the client.
