import { NextRequest, NextResponse } from "next/server";
import { viewRemixSchema } from "@/validations/remix";
import { getRemixesCollection } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = viewRemixSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { shortId } = parseResult.data;

    const remixes = await getRemixesCollection();
    const result = await remixes.findOneAndUpdate(
      { shortId },
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Remix not found" }, { status: 404 });
    }

    return NextResponse.json({ views: result.views });
  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json(
      { error: "Failed to update view count" },
      { status: 500 }
    );
  }
}
