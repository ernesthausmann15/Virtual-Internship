import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { StoreProvider } from "@/components/providers/StoreProvider";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "Virtual Internship",
    template: "%s · Virtual Internship",
  },
  description:
    "Gain more knowledge in less time. Read or listen to the key ideas from the best books.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
