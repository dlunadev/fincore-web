'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLogin } from './use-login';

export function LoginForm() {
  const { form, error, is_loading, onSubmit } = useLogin();
  const { register, formState: { errors } } = form;

  const [showPassword, setShowPassword] = useState(false);

  const wrapperRef  = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const formRef     = useRef<HTMLFormElement>(null);

  // ── Entrance animation ──────────────────────────────────────────
  useEffect(() => {
    // Safety: ensure elements are visible even if GSAP fails
    gsap.set('[data-field]', { opacity: 1, y: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(logoRef.current, { y: -28, opacity: 0, duration: 0.75 })
        .from(cardRef.current, { y: 36, opacity: 0, scale: 0.97, duration: 0.85, ease: 'power4.out' }, '-=0.45')
        .from('[data-field]', {
          y: 18, opacity: 0, duration: 0.55, stagger: 0.09,
        }, '-=0.55');
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  // ── Error shake ─────────────────────────────────────────────────
  useEffect(() => {
    if (!error || !formRef.current) return;
    gsap.fromTo(
      formRef.current,
      { x: 0 },
      {
        duration: 0.45,
        ease: 'none',
        keyframes: { x: [0, -9, 9, -7, 7, -4, 4, -2, 2, 0] },
      },
    );
  }, [error]);

  return (
    <div ref={wrapperRef} className="w-full max-w-[400px]">

      {/* Logo */}
      <div ref={logoRef} className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-[62px] w-[62px] items-center justify-center rounded-[18px] bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-600/30">
          <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" fill="none">
            <rect x="5" y="18" width="5" height="9" rx="1.5" fill="currentColor" fillOpacity=".6" />
            <rect x="13.5" y="11" width="5" height="16" rx="1.5" fill="currentColor" fillOpacity=".8" />
            <rect x="22" y="5" width="5" height="22" rx="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">FinCore</h1>
          <p className="mt-0.5 text-[13px] text-[#6e6e73]">Portal de Gestión Financiera</p>
        </div>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className="rounded-2xl border border-black/[0.07] bg-white/80 px-8 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.10)] backdrop-blur-2xl"
      >
        <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">

          {/* Email */}
          <div data-field className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-medium text-[#1d1d1f]">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="usuario@empresa.com"
              className={[
                'h-11 w-full rounded-xl border bg-white/60 px-3.5 text-[15px] text-[#1d1d1f] outline-none',
                'placeholder:text-[#aeaeb2] transition-all duration-200',
                'focus:border-blue-400 focus:ring-3 focus:ring-blue-500/15',
                errors.email ? 'border-red-400 ring-2 ring-red-400/15' : 'border-black/[0.1]',
              ].join(' ')}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-[12px] text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div data-field className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[13px] font-medium text-[#1d1d1f]">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={[
                  'h-11 w-full rounded-xl border bg-white/60 px-3.5 pr-11 text-[15px] text-[#1d1d1f] outline-none',
                  'placeholder:text-[#aeaeb2] transition-all duration-200',
                  'focus:border-blue-400 focus:ring-3 focus:ring-blue-500/15',
                  errors.password ? 'border-red-400 ring-2 ring-red-400/15' : 'border-black/[0.1]',
                ].join(' ')}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aeaeb2] transition-colors hover:text-[#6e6e73]"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[12px] text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Error alert */}
          {error && (
            <div data-field className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600 ring-1 ring-red-200">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            data-field
            type="submit"
            disabled={is_loading}
            className={[
              'relative mt-1 flex h-11 w-full items-center justify-center rounded-xl',
              'bg-[#0071e3] text-[15px] font-medium text-white',
              'transition-all duration-200 hover:bg-[#0077ed] active:scale-[0.98] active:bg-[#006edb]',
              'disabled:cursor-not-allowed disabled:opacity-60',
              'shadow-md shadow-blue-600/20',
            ].join(' ')}
          >
            {is_loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Ingresando…
              </span>
            ) : (
              'Ingresar'
            )}
          </button>

        </form>
      </div>

      {/* Footer */}
      <p data-field className="mt-6 text-center text-[12px] text-[#aeaeb2]">
        © {new Date().getFullYear()} FinCore · Todos los derechos reservados
      </p>

    </div>
  );
}
