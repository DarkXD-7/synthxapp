"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const errors: Record<string, string> = {
  Configuration: "Server configuration error. Check your environment variables.",
  AccessDenied: "You denied access to your Discord account.",
  Verification: "Token verification failed.",
  OAuthSignin: "Error starting Discord OAuth. Check your Client ID.",
  OAuthCallback: "Error during Discord callback. Check your redirect URL in Discord portal.",
  OAuthCreateAccount: "Could not create account.",
  Callback: "Callback URL mismatch. Check NEXTAUTH_URL env variable.",
  Default: "An unknown error occurred.",
};

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error") ?? "Default";
  const message = errors[error] ?? errors.Default;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-black mb-3 text-white">Authentication Error</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
          <p className="text-red-400 font-mono text-sm font-bold">Error: {error}</p>
        </div>
        <p className="text-gray-400 mb-8">{message}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white"
          style={{ background: "linear-gradient(135deg, #ef1515, #f97316)" }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}