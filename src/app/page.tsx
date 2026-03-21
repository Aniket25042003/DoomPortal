import { Navbar } from "@/components/navbar";
import { PortalForm } from "@/components/portal-form";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="w-full max-w-3xl space-y-8 text-center">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              DoomPortal
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Your 2050 holographic self teleports in to roast your worst
              social media habit.
            </p>
          </div>
          <PortalForm />
        </div>
      </main>
    </div>
  );
}
