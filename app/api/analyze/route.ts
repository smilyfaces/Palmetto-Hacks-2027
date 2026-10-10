import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const image = formData.get("image");

        if (!(image instanceof File)) {
            return NextResponse.json(
                { error: "Please upload an image." },
                { status: 400 }
            );
        }

        if (!image.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "The uploaded file must be an image." },
                { status: 400 }
            );
        }

        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const imageBase64 = imageBuffer.toString("base64");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType: image.type,
                                data: imageBase64,
                            },
                        },
                        {
                            text: `Analyze this food photo for a recipe app.

Find the ingredients that are clearly visible. Do not guess ingredients that are not shown.

Return ONLY valid JSON in exactly this format:
{
  "ingredients": [
    {
      "name": "chicken breast",
      "confidence": "high"
    }
  ]
}`,
                        },
                    ],
                },
            ],
            config: {
                responseMimeType: "application/json",
            },
        });

        const ingredients = JSON.parse(response.text || "{}");

        return NextResponse.json(ingredients);
    } catch (error) {
        console.error("Analyze route error:", error);

        return NextResponse.json(
            { error: "Could not analyze the image. Please try again." },
            { status: 500 }
        );
    }
}