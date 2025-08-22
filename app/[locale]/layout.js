import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/getDictionary';
import { Suspense } from 'react';

export const metadata = {
  title: 'Iced3DPrinting',
  description: 'Luxury 3D Printed Ships',
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <Suspense fallback={null}>
        <main className='min-h-screen'>{children}</main>
      </Suspense>
      <Suspense>
        <Footer
          locale={locale}
          tagline={t.footer?.tagline}
          links={t.footer?.links}
          contact={t.footer?.contact}
        />
      </Suspense>
    </>
  );
}
