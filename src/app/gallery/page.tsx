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
          <div className="space-y-1">
            <h1 className="font-heading text-3xl font-bold text-primary">
              Wall of Shame
            </h1>
            <p className="text-muted-foreground">
              These people got roasted by their future selves. Enjoy their
              pain. Then make your own.
            </p>
          </div>
          <GalleryClient />
        </div>
      </main>
    </div>
  );
}
