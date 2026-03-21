import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createRemixSchema } from "@/validations/remix";
import { getSinById, buildMagicHourPrompt } from "@/data/sins";
import {
  fetchProfilePic,
  extensionForContentType,
} from "@/lib/unavatar";
import {
  createImageToVideo,
  pollForCompletion,
  downloadVideo,
} from "@/lib/magic-hour";
import { uploadVideo, uploadImage } from "@/lib/blob";
import { getRemixesCollection } from "@/lib/db";
import { generateShortId } from "@/lib/short-id";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Please wait before creating another roast" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = createRemixSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { handle, platform, sinId } = parseResult.data;

    const sin = getSinById(sinId);
    if (!sin) {
      return NextResponse.json(
        { error: "Invalid sin selected" },
        { status: 400 }
      );
    }

    const profilePic = await fetchProfilePic(platform, handle);
    if (!profilePic) {
      return NextResponse.json(
        { error: "Could not find this profile. Please check the handle." },
        { status: 400 }
      );
    }

    const ext = extensionForContentType(profilePic.contentType);
    const profileImageFilename = `profile-${handle}.${ext}`;
    const profileImageUrl = await uploadImage(
      profileImageFilename,
      profilePic.buffer,
      profilePic.contentType
    );

    const prompt = buildMagicHourPrompt(handle, sin);
    const projectId = await createImageToVideo(profileImageUrl, prompt);
    const downloadUrl = await pollForCompletion(projectId);
    const videoBuffer = await downloadVideo(downloadUrl);
    const buffer = Buffer.from(videoBuffer);

    const shortId = await generateShortId();
    const filename = `remix-${shortId}.mp4`;
    const videoUrl = await uploadVideo(filename, buffer);

    const session = await auth.api.getSession({ headers: await headers() });
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
      promptUsed: prompt,
    });

    return NextResponse.json({
      shortId,
      videoUrl,
      thumbnailUrl: profileImageUrl,
    });
  } catch (error) {
    console.error("Remix creation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create remix";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
