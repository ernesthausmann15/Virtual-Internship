import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "Gain more knowledge in less time",
};

export default function Home() {
  return <HomePage />;
}
