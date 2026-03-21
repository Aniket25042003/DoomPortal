import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRemixesCollection } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/auth?callbackUrl=/dashboard");
  }

  const remixes = await getRemixesCollection();
  const items = await remixes
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  const serialized = items.map((r) => ({
    shortId: r.shortId,
    handle: r.handle,
    platform: r.platform,
    sinId: r.sinId,
    videoUrl: r.videoUrl,
    thumbnailUrl: r.thumbnailUrl,
    views: r.views,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto">
          <h1 className="font-heading text-3xl font-bold text-primary">
            My Roasts
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your saved roast videos. Download, share, or delete them.
          </p>
          <DashboardClient initialRemixes={serialized} />
        </div>
      </main>
    </div>
  );
}
