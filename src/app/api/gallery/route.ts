import { NextRequest, NextResponse } from "next/server";
import { getRemixesCollection } from "@/lib/db";
import type { Remix } from "@/types";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 48;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) ||
        DEFAULT_LIMIT,
      MAX_LIMIT
    );
    const page = Math.max(
      parseInt(searchParams.get("page") ?? "1", 10) || 1,
      1
    );
    const skip = (page - 1) * limit;

    const remixes = await getRemixesCollection();
    const filter = { showInGallery: { $ne: false } };
    const [items, total] = await Promise.all([
      remixes
        .find(filter)
        .sort({ views: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      remixes.countDocuments(filter),
    ]);

    const serialized = items.map((r: Remix) => ({
      shortId: r.shortId,
      handle: r.handle,
      platform: r.platform,
      sinId: r.sinId,
      videoUrl: r.videoUrl,
      thumbnailUrl: r.thumbnailUrl,
      views: r.views,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({
      items: serialized,
      total,
      page,
      limit,
      hasMore: skip + items.length < total,
    });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}
