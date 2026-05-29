import { Suspense } from 'react';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f7] px-4">

      {/* Background orbs */}
      <div className="pointer-events-none absolute -left-64 -top-64 h-[700px] w-[700px] rounded-full bg-blue-300/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-violet-300/20 blur-[110px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-sky-200/20 blur-[90px]" />

      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
