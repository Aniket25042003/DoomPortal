import { NextRequest, NextResponse } from "next/server";
import { createPreviewImage } from "@/lib/magic-hour";

export const maxDuration = 15;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const projectId = await createPreviewImage(prompt);
    return NextResponse.json({ projectId });
  } catch (error) {
    console.error("Preview generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate preview";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
