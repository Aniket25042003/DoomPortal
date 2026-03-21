import { notFound } from "next/navigation";
import Link from "next/link";
import { getRemixesCollection } from "@/lib/db";
import { getSinById } from "@/data/sins";
import { Navbar } from "@/components/navbar";
import { RemixShareClient } from "./remix-share-client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ shortId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { shortId } = await params;
  const remixes = await getRemixesCollection();
  const remix = await remixes.findOne({ shortId });

  if (!remix) {
    return { title: "Remix Not Found | DoomPortal" };
  }

  const sin = getSinById(remix.sinId);

  return {
    title: `${remix.handle}'s 2050 Portal Roast – ${sin?.name ?? "DoomPortal"}`,
    description: `Watch ${remix.handle}'s hilarious 2050 hologram roast. Made with DoomPortal & Magic Hour API.`,
    openGraph: {
      title: `${remix.handle}'s 2050 Portal Roast`,
      description: `Their 2050 self came back to roast them. Try yours!`,
      images: remix.thumbnailUrl ? [remix.thumbnailUrl] : undefined,
    },
    twitter: {
      card: "player",
      title: `${remix.handle}'s 2050 Portal Roast`,
    },
  };
}

export default async function RemixSharePage({ params }: PageProps) {
  const { shortId } = await params;
  const remixes = await getRemixesCollection();
  const remix = await remixes.findOne({ shortId });

  if (!remix) {
    notFound();
  }

  const sin = getSinById(remix.sinId);

  if (!sin) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          <RemixShareClient
            shortId={remix.shortId}
            videoUrl={remix.videoUrl}
            handle={remix.handle}
            sin={sin}
            views={remix.views}
          />
          <div className="flex justify-center">
            <Link href="/">
              <button className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 font-heading text-sm font-semibold text-primary transition-colors hover:bg-primary/20">
                Try your own
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
