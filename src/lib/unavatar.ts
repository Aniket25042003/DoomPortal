const UNAVATAR_BASE = "https://unavatar.io";

/**
 * Builds the unavatar.io URL for a given platform and handle.
 * Uses fallback=false so we get 404 when the avatar can't be resolved,
 * instead of a placeholder/default image (which would be mistaken for success).
 */
export function getProfilePicUrl(platform: string, handle: string): string {
  const cleanHandle = handle.replace(/^@/, "").trim();
  const encoded = encodeURIComponent(cleanHandle);
  return `${UNAVATAR_BASE}/${platform}/${encoded}?fallback=false`;
}

/**
 * Fetches the profile picture from unavatar.io and returns the raw image
 * buffer along with the detected content type. Returns null if not found.
 *
 * Magic Hour requires a URL with a valid image extension, so we can't pass
 * the bare unavatar redirect URL directly — we need to download the image
 * and re-upload it to Vercel Blob with a proper filename.
 *
 * Note: unavatar free tier has ~50 requests/day per IP. On Vercel, serverless
 * functions may share IPs, so rate limits can be hit; users may see
 * "Could not find this profile" when the limit is exceeded.
 */
export async function fetchProfilePic(
  platform: string,
  handle: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const url = getProfilePicUrl(platform, handle);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "DoomPortal/1.0 (https://github.com/Aniket25042003/DoomPortal)",
      },
    });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "image/png";
    if (!contentType.startsWith("image/")) return null;

    const arrayBuffer = await response.arrayBuffer();
    return { buffer: Buffer.from(arrayBuffer), contentType };
  } catch {
    return null;
  }
}

const CONTENT_TYPE_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/tiff": "tiff",
  "image/bmp": "bmp",
};

export function extensionForContentType(contentType: string): string {
  const base = contentType.split(";")[0].trim().toLowerCase();
  return CONTENT_TYPE_TO_EXT[base] ?? "png";
}
