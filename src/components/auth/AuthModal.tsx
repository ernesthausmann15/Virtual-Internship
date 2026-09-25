"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AiField } from "@/components/motion/AiField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  describeAuthError,
  GUEST_EMAIL,
  GUEST_PASSWORD,
  loginAsGuest,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  sendResetEmail,
} from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { closeAuthModal, setAuthMode } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { AuthMode } from "@/types/user";

export function AuthModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.authModalOpen);
  const mode = useAppSelector((state) => state.ui.authMode);
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function switchMode(next: AuthMode) {
    setError(null);
    setNotice(null);
    dispatch(setAuthMode(next));
  }

  async function run(action: () => Promise<void>) {
    setError(null);
    setNotice(null);
    if (!isFirebaseConfigured()) {
      setError("Add your Firebase keys to .env.local before signing in.");
      return;
    }
    setPending(true);
    try {
      await action();
      if (mode !== "reset") {
        dispatch(closeAuthModal());
        if (pathname === "/") router.push("/for-you");
      }
    } catch (caught) {
      setError(caught instanceof Error && !("code" in caught) ? caught.message : describeAuthError(caught));
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setError("That email address is invalid.");
      return;
    }
    if (mode !== "reset" && password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    if (mode === "register") {
      void run(() => registerWithEmail(trimmed, password));
      return;
    }
    if (mode === "login") {
      void run(() => loginWithEmail(trimmed, password));
      return;
    }
    void run(async () => {
      await sendResetEmail(trimmed);
      setNotice("Password reset email sent. Check your inbox.");
    });
  }

  const title =
    mode === "register" ? "Create your account" : mode === "reset" ? "Reset your password" : "Log in";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dispatch(closeAuthModal());
      }}
    >
      <DialogContent className="overflow-hidden sm:max-w-md" showCloseButton>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28">
          <AiField density={18} />
          <div className="absolute inset-0 bg-gradient-to-b from-mint/30 to-popover" />
        </div>
        <motion.div
          key={mode}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <DialogHeader className="pt-6">
            <DialogTitle className="text-xl text-navy">{title}</DialogTitle>
            <DialogDescription>
              {mode === "reset"
                ? "We will email you a link to choose a new password."
                : "Read or listen to the ideas that matter, in minutes."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-4 grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            {mode !== "reset" && (
              <div className="grid gap-1.5">
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-lg bg-mint/20 px-3 py-2 text-sm text-navy" role="status">
                {notice}
              </p>
            )}

            <Button type="submit" className="h-10" disabled={pending}>
              {pending ? "Please wait…" : mode === "register" ? "Register" : mode === "reset" ? "Send reset link" : "Login"}
            </Button>
          </form>

          {mode !== "reset" && (
            <div className="mt-3 grid gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10"
                disabled={pending}
                onClick={() => void run(loginWithGoogle)}
              >
                <Image src="/images/google.png" alt="" width={16} height={16} />
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-10"
                disabled={pending}
                onClick={() => {
                  setEmail(GUEST_EMAIL);
                  setPassword(GUEST_PASSWORD);
                  void run(loginAsGuest);
                }}
              >
                Continue as guest
              </Button>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-1 text-sm text-ink">
            {mode === "login" && (
              <>
                <button type="button" className="text-left hover:text-navy" onClick={() => switchMode("reset")}>
                  Forgot your password?
                </button>
                <button type="button" className="text-left hover:text-navy" onClick={() => switchMode("register")}>
                  No account yet? Register
                </button>
              </>
            )}
            {mode === "register" && (
              <button type="button" className="text-left hover:text-navy" onClick={() => switchMode("login")}>
                Already registered? Log in
              </button>
            )}
            {mode === "reset" && (
              <button type="button" className="text-left hover:text-navy" onClick={() => switchMode("login")}>
                Back to login
              </button>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
