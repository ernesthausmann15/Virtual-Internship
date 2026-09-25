import { ViewTransition, type ReactNode } from "react";

/**
 * Templates remount on every navigation, so this wrapper can play an
 * enter/exit that a persistent layout cannot. Links opt in by passing
 * `transitionTypes={["nav-forward"]}` or `"nav-back"`. Untyped navigations
 * (browser back, refreshes) stay still because `default` is `"none"`.
 */
const routeMotion = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={routeMotion} exit={routeMotion} default="none">
      {children}
    </ViewTransition>
  );
}
