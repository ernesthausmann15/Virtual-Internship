"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "firebase/auth";
import {
  HiOutlineBookmark,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineQuestionMarkCircle,
  HiBars3,
  HiXMark,
} from "react-icons/hi2";
import { BrandMark } from "@/components/brand/BrandMark";
import { SearchBar } from "@/components/layout/SearchBar";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { openAuthModal } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cn } from "cn";

const links = [
  { href: "/for-you", label: "For you", icon: HiOutlineHome },
  { href: "/library", label: "My Library", icon: HiOutlineBookmark },
  { href: "/settings", label: "Settings", icon: HiOutlineCog6Tooth },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  const nav = (
    <div className="flex h-full flex-col gap-6 bg-navy p-5 text-white">
      <div className="flex items-center justify-between">
        <Link href="/for-you" transitionTypes={["nav-back"]} onClick={() => setOpen(false)}>
          <BrandMark light compact={false} />
        </Link>
        <button type="button" className="md:hidden" aria-label="Close menu" onClick={() => setOpen(false)}>
          <HiXMark className="size-6" />
        </button>
      </div>

      <nav className="grid gap-1">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              transitionTypes={["nav-forward"]}
              onClick={() => setOpen(false)}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                active ? "text-navy" : "text-white/80 hover:bg-white/10",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg bg-mint"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <link.icon className="relative size-5" />
              <span className="relative font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <SearchBar onNavigate={() => setOpen(false)} />

      <div className="mt-auto grid gap-2 text-sm">
        <a href="mailto:support@virtualinternship.app" className="flex items-center gap-3 px-3 py-2 text-white/80">
          <HiOutlineQuestionMarkCircle className="size-5" />
          Help & Support
        </a>
        {user ? (
          <button
            type="button"
            className="px-3 py-2 text-left text-white/80 hover:text-white"
            onClick={() => {
              if (isFirebaseConfigured()) void signOut(getFirebaseAuth());
            }}
          >
            Log out
          </button>
        ) : (
          <button
            type="button"
            className="px-3 py-2 text-left font-semibold text-mint"
            onClick={() => dispatch(openAuthModal("login"))}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 md:block">{nav}</div>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-navy px-4 py-3 text-white md:hidden">
        <BrandMark light />
        <button type="button" aria-label="Open menu" onClick={() => setOpen(true)}>
          <HiBars3 className="size-7" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-navy/40" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute inset-y-0 left-0 w-72"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {nav}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
