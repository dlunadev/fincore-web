'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

const NAV_LINKS = [
  { href: '/cuentas',       label: 'Cuentas' },
  { href: '/transacciones', label: 'Transacciones' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">

        {/* Brand + nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-blue-500 to-blue-700">
              <svg className="h-4 w-4 text-white" viewBox="0 0 32 32" fill="none">
                <rect x="5"  y="18" width="5" height="9" rx="1.5" fill="currentColor" fillOpacity=".6" />
                <rect x="13.5" y="11" width="5" height="16" rx="1.5" fill="currentColor" fillOpacity=".8" />
                <rect x="22" y="5"  width="5" height="22" rx="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">FinCore</span>
          </div>

          <div className="h-4 w-px bg-black/[0.1]" />

          <nav className="flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-[#0071e3]/10 text-[#0071e3]'
                      : 'text-[#6e6e73] hover:bg-black/[0.04] hover:text-[#1d1d1f]',
                  ].join(' ')}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-[13px] text-[#6e6e73]">{user.name}</span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#6e6e73] transition-colors duration-150 hover:bg-black/[0.04] hover:text-[#1d1d1f]"
          >
            Cerrar sesión
          </button>
        </div>

      </div>
    </header>
  );
}
