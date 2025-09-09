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
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PESITM CSD',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
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
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
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
