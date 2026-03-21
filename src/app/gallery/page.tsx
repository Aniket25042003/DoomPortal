import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { GalleryClient } from "./gallery-client";

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary">
            Trending Roasts
          </h1>
          <p className="mt-2 text-muted-foreground">
            Top remixes by view count. Get inspired and create your own!
          </p>
          <GalleryClient />
        </div>
      </main>
    </div>
  );
}
