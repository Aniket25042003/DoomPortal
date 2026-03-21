import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { PortalForm } from "@/components/portal-form";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="w-full max-w-3xl space-y-8 text-center">
          <div className="space-y-4">
            <div className="animate-float mx-auto w-20">
              <Image
                src="/app-icon.png"
                alt=""
                width={80}
                height={80}
                className="rounded-2xl object-contain"
              />
            </div>
            <h1 className="animate-neon-flicker font-heading text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              DoomPortal
            </h1>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground">
              Your future self from 2050 is{" "}
              <span className="font-semibold text-destructive">fed up</span>{" "}
              with your social media habits. They&apos;re coming through a
              portal to roast you. There is no escape.
            </p>
            <p className="text-sm text-muted-foreground/60">
              (Side effects may include existential dread, deleting your
              accounts, and sending this to your friends)
            </p>
          </div>
          <PortalForm />
        </div>
      </main>
    </div>
  );
}
