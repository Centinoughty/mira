"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const router = useRouter();

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
  }, []);

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

  async function handleCredentialResponse(response: any) {
    try {
      const idToken = response.credential;

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        { idToken },
        { withCredentials: true },
      );

      if (res.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.log("Login failed");
      alert("Login failed");
    }
  }

  return (
    <>
      <main>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      </main>
    </>
  );
}
