import { NextRequest, NextResponse } from "next/server";
import { viewRemixSchema } from "@/validations/remix";
import { getRemixesCollection } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to save to library" },
        { status: 401 }
      );
    }

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
      { shortId, userId: null },
      { $set: { userId: session.user.id } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Remix not found or already saved" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save to library error:", error);
    return NextResponse.json(
      { error: "Failed to save to library" },
      { status: 500 }
    );
  }
}
