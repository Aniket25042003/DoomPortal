import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { getRemixesCollection } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { SettingsClient } from "./settings-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/auth?callbackUrl=/settings");
  }

  const remixes = await getRemixesCollection();
  const items = await remixes
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  const serialized = items.map((r) => ({
    shortId: r.shortId,
    handle: r.handle,
    sinId: r.sinId,
    showInGallery: r.showInGallery ?? false,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary">
            Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Control which of your roasts appear in the public Trending Gallery.
          </p>
          <SettingsClient remixes={serialized} />
        </div>
      </main>
    </div>
  );
}
