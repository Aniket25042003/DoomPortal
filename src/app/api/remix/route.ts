import { NextRequest, NextResponse } from "next/server";
import { createRemixSchema } from "@/validations/remix";
import { getSinById, buildVideoPrompt, buildPreviewPrompt } from "@/data/sins";
import {
  fetchProfilePic,
  extensionForContentType,
} from "@/lib/unavatar";
import { createImageToVideo, createPreviewImage } from "@/lib/magic-hour";
import { uploadImage } from "@/lib/blob";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

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

    const videoPrompt = buildVideoPrompt(handle, sin);
    const previewPrompt = buildPreviewPrompt(handle, sin);

    const [projectId, previewProjectId] = await Promise.all([
      createImageToVideo(profileImageUrl, videoPrompt),
      createPreviewImage(previewPrompt).catch(() => null),
    ]);

    return NextResponse.json({
      projectId,
      previewProjectId,
      profileImageUrl,
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
