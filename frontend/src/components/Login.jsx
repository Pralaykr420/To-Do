import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import ThreeOrbBackground from "./ThreeOrbBackground.jsx";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setError("");
    setSigningIn(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      setError(err.message || "Sign-in failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-void bg-grid-fade">
      <ThreeOrbBackground progress={0.35} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel relative z-10 w-full max-w-sm rounded-2xl px-8 py-10 flex flex-col items-center text-center gap-5"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-cyan uppercase">
          Mission log
        </span>
        <h1 className="font-display text-4xl font-semibold text-ink tracking-tight">
          Orbit
        </h1>
        <p className="text-sm text-mute max-w-xs">
          Sign in with Google to keep a task list that's private to you — no one
          else can see or edit it.
        </p>

        <div className="mt-2">
          {signingIn ? (
            <p className="font-mono text-xs text-mute">Signing you in…</p>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError("Google sign-in failed. Please try again.")}
              theme="filled_black"
              shape="pill"
              size="large"
            />
          )}
        </div>

        {error && <p className="text-xs text-ember font-mono">{error}</p>}
      </motion.div>
    </div>
  );
}
