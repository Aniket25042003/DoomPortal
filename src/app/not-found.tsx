import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="animate-float overflow-hidden rounded-2xl bg-background">
          <Image
            src="/app-icon.png"
            alt=""
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
        <h1 className="mt-4 font-heading text-5xl font-bold text-primary">
          404
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          This portal collapsed into the void. Even your future self
          can&apos;t find it.
        </p>
        <p className="mt-1 text-sm text-muted-foreground/50">
          Maybe you doom-scrolled past it?
        </p>
        <Link
          href="/"
          className="mt-8 rounded-lg border border-primary/30 bg-primary/10 px-6 py-3 font-heading text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          Open a new portal (if you dare)
        </Link>
      </main>
    </div>
  );
}
