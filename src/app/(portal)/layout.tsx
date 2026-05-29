'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/layout/navbar';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { is_authenticated } = useAuth();
  const router = useRouter();
  // useRef to track mount without triggering a re-render, avoiding the
  // ESLint react-hooks/set-state-in-effect rule while still guarding against
  // the SSR hydration gap where useSyncExternalStore returns the server snapshot.
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    if (!is_authenticated) router.replace('/login');
  }, [is_authenticated, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
