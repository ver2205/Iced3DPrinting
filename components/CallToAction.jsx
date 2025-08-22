// components/CallToAction.jsx
'use client';
import { useRouter } from 'next/navigation';

export default function CallToAction({
  title = '',
  subtitle = '',
  buttonPrimary = '',
  buttonSecondary = '',
  locale = 'en',
}) {
  const router = useRouter();

  return (
    <section className="py-16 bg-slate-900 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          {subtitle}
        </p>
      )}

      {(buttonPrimary || buttonSecondary) && (
        <div className="mt-8 flex gap-4 justify-center">
          {buttonPrimary && (
            <button
              onClick={() => router.push(`/${locale}/quote`)}
              className="px-6 py-3 rounded-full bg-white text-slate-900 font-medium hover:bg-gray-200 transition"
            >
              {buttonPrimary}
            </button>
          )}
          {buttonSecondary && (
            <button
              onClick={() => router.push(`/${locale}/catalogue`)}
              className="px-6 py-3 rounded-full border border-white/40 text-white hover:bg-white/10 transition"
            >
              {buttonSecondary}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
