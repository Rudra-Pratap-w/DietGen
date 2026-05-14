import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request): Promise<Response> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const body = await request.json();
    const { age, weight, height, diet, allergy, disease, region } = body;

    if (age == null || weight == null || height == null) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const prompt = `You are an expert nutritionist. Return ONLY raw JSON (no markdown, no backticks).

User Profile:
- Age: ${age}, Weight: ${weight}kg, Height: ${height}cm
- Diet: ${diet || "none"}, Allergies: ${allergy || "none"}
- Conditions: ${disease || "none"}, Region: ${region || "none"}


Return this exact JSON structure:
{
  "target_calories": 0,
  "target_protein": 0,
  "target_carbs": 0,
  "target_fats": 0,
  "meals":[
    { "type": "Breakfast", "title": "Breakfast Option 1 Name", "subtitle": "Description", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
    { "type": "Breakfast", "title": "Breakfast Option 2 Name", "subtitle": "Description", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
    { "type": "Breakfast", "title": "Breakfast Option 3 Name", "subtitle": "Description", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
    { "type": "Lunch", "title": "Lunch Option 1 Name", "subtitle": "Description", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
    { "type": "Lunch", "title": "Lunch Option 2 Name", "subtitle": "Description", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
    { "type": "Lunch", "title": "Lunch Option 3 Name", "subtitle": "Description", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
    { "type": "Dinner", "title": "Dinner Option 1 Name", "subtitle": "Description", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
    { "type": "Dinner", "title": "Dinner Option 2 Name", "subtitle": "Description", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
    { "type": "Dinner", "title": "Dinner Option 3 Name", "subtitle": "Description", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean up potential markdown formatting even if we asked not to
    const cleanJson = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleanJson);

    return Response.json(parsed);
  } catch (error: any) {
    console.error("API error:", error);
    return Response.json(
      { error: "Failed to generate diet plan" },
      { status: 500 },
    );
  }
}
