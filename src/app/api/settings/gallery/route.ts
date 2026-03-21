import { NextRequest, NextResponse } from "next/server";
import { getRemixesCollection } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { z } from "zod";

const toggleSchema = z.object({
  shortId: z.string().min(1),
  showInGallery: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = toggleSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { shortId, showInGallery } = parseResult.data;

    const remixes = await getRemixesCollection();
    const result = await remixes.findOneAndUpdate(
      { shortId, userId: session.user.id },
      { $set: { showInGallery } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Remix not found or you don't own it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, showInGallery });
  } catch (error) {
    console.error("Gallery toggle error:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
