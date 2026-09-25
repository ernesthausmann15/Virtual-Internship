import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsView } from "@/components/settings/SettingsView";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl space-y-4 px-6 py-10">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
      }
    >
      <SettingsView />
    </Suspense>
  );
}
