import { NextRequest, NextResponse } from "next/server";
import { completeRemixSchema } from "@/validations/remix";
import { getSinById } from "@/data/sins";
import { downloadVideo } from "@/lib/magic-hour";
import { uploadVideo } from "@/lib/blob";
import { getRemixesCollection } from "@/lib/db";
import { generateShortId } from "@/lib/short-id";
import { getServerSession } from "@/lib/session";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = completeRemixSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { downloadUrl, handle, platform, sinId, profileImageUrl } =
      parseResult.data;

    const sin = getSinById(sinId);
    if (!sin) {
      return NextResponse.json(
        { error: "Invalid sin selected" },
        { status: 400 }
      );
    }

    const videoBuffer = await downloadVideo(downloadUrl);
    const buffer = Buffer.from(videoBuffer);

    const shortId = await generateShortId();
    const filename = `remix-${shortId}.mp4`;
    const videoUrl = await uploadVideo(filename, buffer);

    const session = await getServerSession();
    const userId = session?.user?.id ?? null;

    const remixes = await getRemixesCollection();
    await remixes.insertOne({
      shortId,
      userId,
      handle: `@${handle}`,
      platform,
      sinId,
      videoUrl,
      thumbnailUrl: profileImageUrl,
      views: 0,
      createdAt: new Date(),
      promptUsed: `sin: ${sin.name}`,
    });

    return NextResponse.json({
      shortId,
      videoUrl,
      thumbnailUrl: profileImageUrl,
    });
  } catch (error) {
    console.error("Remix complete error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to finalize remix";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
