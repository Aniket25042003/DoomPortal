import type { ObjectId } from "mongodb";

export type Platform = "x" | "instagram";

/** Remix document in MongoDB. `_id` is set by the driver after insert. */
export interface Remix {
  _id?: ObjectId;
  shortId: string;
  userId: string | null;
  handle: string;
  platform: Platform;
  sinId: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  createdAt: Date;
  promptUsed: string;
  showInGallery: boolean;
}

export interface Sin {
  id: string;
  name: string;
  visual: string;
  roast: string;
}
