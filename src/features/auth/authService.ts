import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User
} from "firebase/auth";
import { auth } from "../../lib/firebase/config";
import type { AuthUser } from "../../types/domain";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

function mapUser(user: User | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email
  };
}

export function subscribeToAuth(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(auth, (user) => callback(mapUser(user)));
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return mapUser(credential.user);
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  return mapUser(credential.user);
}

export function signOut() {
  return firebaseSignOut(auth);
}
