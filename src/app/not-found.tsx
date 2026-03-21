import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <h1 className="font-heading text-4xl font-bold text-primary">404</h1>
        <p className="mt-2 text-muted-foreground">
          This portal has collapsed. The remix you&apos;re looking for doesn&apos;t
          exist.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 font-heading text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          Open a new portal
        </Link>
      </main>
    </div>
  );
}
