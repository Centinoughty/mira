"use client";

import { api } from "@/api/axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (r: { credential: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        const res = await api.post("/auth/google", {
          idToken: response.credential,
        });
        if (res.status === 200) router.push("/");
      } catch {
        alert("Login failed");
      }
    },
    [router],
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
      });
    };

    document.body.appendChild(script);
  }, [handleCredentialResponse]);

  function handleGoogleLogin() {
    if (!window.google?.accounts?.id) {
      alert("Google SDK not loaded yet");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.prompt();
  }

  return (
    <>
      <main>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      </main>
    </>
  );
}
