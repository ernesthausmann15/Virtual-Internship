"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

/**
 * The marketing page and the sales page are full-bleed.
 * Every other route keeps the sidebar so search and account stay one tap away.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname === "/" || pathname.startsWith("/choose-plan");

  if (bare) return children;

  return (
    <div className="min-h-screen bg-white md:pl-64">
      <Sidebar />
      {children}
    </div>
  );
}
