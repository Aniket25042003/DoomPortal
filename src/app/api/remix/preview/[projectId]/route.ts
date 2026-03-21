import { NextRequest, NextResponse } from "next/server";
import { checkImageProjectStatus } from "@/lib/magic-hour";

export const maxDuration = 15;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    if (!projectId || projectId.length < 5) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const status = await checkImageProjectStatus(projectId);
    return NextResponse.json(status);
  } catch (error) {
    console.error("Preview status check error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to check preview status";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
