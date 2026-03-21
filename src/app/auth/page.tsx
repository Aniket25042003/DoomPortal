import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { AuthPageClient } from "./auth-page-client";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getServerSession();
  const { callbackUrl } = await searchParams;
  if (session) {
    redirect(callbackUrl ?? "/");
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <p className="text-4xl">🕳️</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary">
            Enter the Portal
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to save your roasts and build a personal hall of shame.
          </p>
        </div>
        <AuthPageClient callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
