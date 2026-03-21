import { put } from "@vercel/blob";

export async function uploadVideo(
  filename: string,
  buffer: Buffer
): Promise<string> {
  const blob = await put(filename, buffer, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function uploadImage(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const blob = await put(filename, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}
