import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  RecaptchaVerifier,
  sendPasswordResetEmail,
  type AuthError,
  type ConfirmationResult,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

/** Recruiter demo account. Created on first use if it does not exist yet. */
export const GUEST_EMAIL = "guest@gmail.com";
export const GUEST_PASSWORD = "guest123";

const googleProvider = new GoogleAuthProvider();

export function getAuthErrorCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    return String((error as AuthError).code);
  }
  return "auth/unknown";
}

/**
 * Firebase's message strings are for developers. These sentences are what
 * a person filling out the form should read, including the cases the
 * assignment calls out: invalid email, short password, and missing user.
 */
export function describeAuthError(error: unknown) {
  switch (getAuthErrorCode(error)) {
    case "auth/invalid-email":
      return "That email address is invalid.";
    case "auth/missing-email":
      return "Enter an email address.";
    case "auth/missing-password":
      return "Enter a password.";
    case "auth/weak-password":
    case "auth/password-does-not-meet-requirements":
      return "Password should be at least 6 characters.";
    case "auth/user-not-found":
      return "No account found for that email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account with that email already exists. Try logging in.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before it finished.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication settings.";
    case "auth/invalid-phone-number":
      return "Enter a phone number with the country code, like +1 555 555 0100.";
    case "auth/invalid-verification-code":
      return "That code is incorrect.";
    case "auth/code-expired":
      return "That code expired. Request a new one.";
    case "auth/operation-not-allowed":
      return "That sign-in method is not enabled in Firebase Authentication yet.";
    case "auth/captcha-check-failed":
      return "The security check failed. Try the code request again.";
    case "auth/quota-exceeded":
      return "Too many texts were sent from this project. Try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export async function registerWithEmail(email: string, password: string) {
  await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function loginWithEmail(email: string, password: string) {
  await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function loginWithGoogle() {
  await signInWithPopup(getFirebaseAuth(), googleProvider);
}

export async function sendResetEmail(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

/**
 * Sign in as the guest. If the demo user has never been created in this
 * Firebase project, create it with the same hardcoded credentials so a
 * fresh project still works for a recruiter.
 */
let phoneConfirmation: ConfirmationResult | null = null;
let phoneVerifier: RecaptchaVerifier | null = null;

/**
 * Sends an SMS code. The verifier has to be recreated each attempt;
 * Firebase will not render a second reCAPTCHA into the same widget.
 */
export async function sendPhoneCode(phoneNumber: string, containerId: string) {
  const auth = getFirebaseAuth();
  if (phoneVerifier) {
    phoneVerifier.clear();
    phoneVerifier = null;
  }
  phoneVerifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  phoneConfirmation = await signInWithPhoneNumber(auth, phoneNumber, phoneVerifier);
}

export async function confirmPhoneCode(code: string) {
  if (!phoneConfirmation) {
    throw new Error("Request a code before entering it.");
  }
  await phoneConfirmation.confirm(code.trim());
  phoneConfirmation = null;
}

export async function loginAsGuest() {
  const auth = getFirebaseAuth();
  try {
    await signInWithEmailAndPassword(auth, GUEST_EMAIL, GUEST_PASSWORD);
  } catch (error) {
    const code = getAuthErrorCode(error);
    if (code !== "auth/user-not-found" && code !== "auth/invalid-credential") {
      throw error;
    }
    try {
      await createUserWithEmailAndPassword(auth, GUEST_EMAIL, GUEST_PASSWORD);
    } catch (createError) {
      if (getAuthErrorCode(createError) === "auth/email-already-in-use") {
        throw new Error(
          "The guest account exists, but the password does not match guest123.",
        );
      }
      throw createError;
    }
  }
}
