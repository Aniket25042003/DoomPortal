const MAGIC_HOUR_API_BASE = "https://api.magichour.ai";

interface ImageToVideoResponse {
  id: string;
  credits_charged?: number;
}

interface VideoProjectResponse {
  id: string;
  status: "queued" | "rendering" | "complete" | "error" | "canceled" | "draft";
  downloads?: Array<{ url: string; expires_at?: string }>;
  error?: { message: string; code?: string };
}

function getApiKey(): string {
  const key = process.env.MAGIC_HOUR_API_KEY;
  if (!key) {
    throw new Error("MAGIC_HOUR_API_KEY is not configured");
  }
  return key;
}

export async function createImageToVideo(
  imageUrl: string,
  prompt: string
): Promise<string> {
  const response = await fetch(`${MAGIC_HOUR_API_BASE}/v1/image-to-video`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      end_seconds: 11,
      model: "kling-3.0",
      resolution: "720p",
      assets: {
        image_file_path: imageUrl,
      },
      style: {
        prompt,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Magic Hour API error (${response.status}): ${errorBody}`
    );
  }

  const data = (await response.json()) as ImageToVideoResponse;
  if (!data.id) {
    throw new Error("Magic Hour API did not return a project ID");
  }
  return data.id;
}

export interface ProjectStatus {
  status: "queued" | "rendering" | "complete" | "error" | "canceled" | "draft";
  downloadUrl?: string;
  error?: string;
}

export async function checkProjectStatus(
  projectId: string
): Promise<ProjectStatus> {
  const response = await fetch(
    `${MAGIC_HOUR_API_BASE}/v1/video-projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Magic Hour API error (${response.status}): ${await response.text()}`
    );
  }

  const data = (await response.json()) as VideoProjectResponse;

  if (data.status === "complete" && data.downloads?.length) {
    return {
      status: "complete",
      downloadUrl: data.downloads[0].url,
    };
  }

  if (data.status === "error") {
    return {
      status: "error",
      error: data.error?.message ?? "Video generation failed",
    };
  }

  return { status: data.status };
}

export async function downloadVideo(downloadUrl: string): Promise<ArrayBuffer> {
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to download video (${response.status}): ${response.statusText}`
    );
  }
  return response.arrayBuffer();
}
