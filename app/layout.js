import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export const metadata = {
  title: 'Iced3DPrinting',
  description: 'Luxury 3D Printed Ships',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/logo_bq.ico' />
      </head>
      <body className='bg-gray-900'>
        <Navbar />
        <main className='min-h-screen'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
