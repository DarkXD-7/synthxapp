"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-black mb-3">Authentication Error</h1>
        <p className="text-gray-400 mb-8">
          Something went wrong during sign-in. Please try again.
        </p>
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
