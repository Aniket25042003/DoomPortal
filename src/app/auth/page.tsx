import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AuthPageClient } from "./auth-page-client";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { callbackUrl } = await searchParams;
  if (session) {
    redirect(callbackUrl ?? "/dashboard");
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in to DoomPortal
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to save your roasts to your library and access your
            dashboard.
          </p>
        </div>
        <AuthPageClient callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
