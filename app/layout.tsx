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
      { url: '/favicon.ico?v=4', sizes: 'any' },
      { url: '/favicon-16x16.png?v=4', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png?v=4', type: 'image/png', sizes: '32x32' },
      { url: '/app-icon-192x192.png?v=4', type: 'image/png', sizes: '192x192' },
      { url: '/app-icon-512x512.png?v=4', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=4', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png?v=4',
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
                  var resolvedTheme;
                  
                  if (theme === 'dark' || theme === 'light') {
                    // Use saved theme preference
                    resolvedTheme = theme;
                    console.log('Using saved theme:', resolvedTheme);
                  } else {
                    // Auto-detect system theme preference on first visit
                    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    resolvedTheme = systemPrefersDark ? 'dark' : 'light';
                    console.log('System prefers dark:', systemPrefersDark, 'Setting theme to:', resolvedTheme);
                  }
                  
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(resolvedTheme);
                } catch (e) {
                  console.log('Error in initial theme script, falling back to light');
                  // Fallback to light theme
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
        {/* Apple PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PESITM CSD" />
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
