import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/getDictionary';

export const metadata = {
  title: 'Iced3DPrinting',
  description: 'Luxury 3D Printed Ships',
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params; // ✅ počakamo na params
  const t = await getDictionary(locale); // naloži en.json / nl.json glede na URL

  return (
    <>
      <Navbar />
      <main className='min-h-screen'>{children}</main>
      <Footer
        locale={locale}
        tagline={t.footer?.tagline}
        links={t.footer?.links}
        contact={t.footer?.contact}
      />
    </>
  );
}
