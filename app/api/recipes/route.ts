import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const ingredients = body.ingredients;
        const preference = body.preference || "quick and easy";

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json(
                { error: "Please provide at least one ingredient." },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: `You are a helpful recipe assistant for college students.

Available ingredients: ${ingredients.join(", ")}
Cooking preference: ${preference}

Create exactly 3 realistic recipes that use as many available ingredients as possible.
You may list common pantry staples separately, but do not assume the user owns unusual ingredients.

Return ONLY valid JSON in exactly this format:
{
  "recipes": [
    {
      "title": "Recipe name",
      "description": "One-sentence description",
      "timeMinutes": 20,
      "ingredientsUsed": ["ingredient 1", "ingredient 2"],
      "missingIngredients": ["optional missing item"],
      "steps": [
        "Step one",
        "Step two"
      ]
    }
  ]
}`,
            config: {
                responseMimeType: "application/json",
            },
        });

        const recipes = JSON.parse(response.text || "{}");

        return NextResponse.json(recipes);
    } catch (error) {
        console.error("Recipe route error:", error);

        return NextResponse.json(
            { error: "Could not generate recipes. Please try again." },
            { status: 500 }
        );
    }
}