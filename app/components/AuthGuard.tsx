import React from 'react';
"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * AuthGuard – redirects unauthenticated users to the login page.
 * Wraps children that require a signed‑in session.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If unauthenticated, the effect above will redirect; render nothing.
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
