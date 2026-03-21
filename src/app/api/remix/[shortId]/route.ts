import { NextRequest, NextResponse } from "next/server";
import { getRemixesCollection } from "@/lib/db";
import { getServerSession } from "@/lib/session";

interface RouteParams {
  params: Promise<{ shortId: string }>;
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shortId } = await params;

    if (!shortId) {
      return NextResponse.json(
        { error: "Invalid short ID" },
        { status: 400 }
      );
    }

    const remixes = await getRemixesCollection();
    const result = await remixes.findOneAndDelete({
      shortId,
      userId: session.user.id,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Remix not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete remix error:", error);
    return NextResponse.json(
      { error: "Failed to delete remix" },
      { status: 500 }
    );
  }
}
