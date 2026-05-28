'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/layout/navbar';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { is_authenticated } = useAuth();
  const router = useRouter();

  // Secondary auth guard — middleware handles server-side redirect.
  // This catches mid-session token expiry on the client.
  useEffect(() => {
    if (!is_authenticated) {
      router.replace('/login');
    }
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
