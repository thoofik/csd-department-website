import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PES Institute of Technology and Management - CSD Department',
  description: 'Official website of the Computer Science and Design Department at PES Institute of Technology and Management',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/light-logo-icon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/light-logo-icon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/light-logo-icon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/light-logo-icon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/light-logo-icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/light-logo-icon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/light-logo-apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/light-logo-apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PESITM CSD',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen overflow-x-hidden`}>
        <ThemeProvider>
          <div className="min-h-screen w-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
