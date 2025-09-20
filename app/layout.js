// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Iced3DPrinting',
  description: '3D Printed Ships',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel='icon' href='/logo_bq.ico' />
      </head>
      <body className='bg-gray-900'>{children}</body>
    </html>
  );
}
