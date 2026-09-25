import type { Metadata } from "next";
import { ChoosePlan } from "@/components/pricing/ChoosePlan";

export const metadata: Metadata = { title: "Choose a plan" };

export default function ChoosePlanPage() {
  return <ChoosePlan />;
}
