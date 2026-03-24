import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useAuth } from "../features/auth/AuthProvider";
import { signIn, signInWithGoogle } from "../features/auth/authService";

export function LoginPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signIn(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleSubmitting(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in with Google.";
      setError(message);
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-toolbar">
        <ThemeToggle />
      </div>
      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Farm Report, rebuilt for a cleaner daily workflow.</h1>
        <p className="muted-copy">
          This first release keeps your existing Firebase collections intact while modernizing the UI.
        </p>

        <button
          className="button button-secondary auth-provider-button"
          type="button"
          onClick={() => void handleGoogleSignIn()}
          disabled={submitting || googleSubmitting}
        >
          <span className="auth-provider-mark" aria-hidden="true">
            G
          </span>
          {googleSubmitting ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <div className="auth-divider" aria-hidden="true">
          <span />
          <p>or use email and password</p>
          <span />
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button" type="submit" disabled={submitting || googleSubmitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
}
