import '../../global.css';
import '@fmicodes/fmicodes-ui/global.css';

import React from 'react';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { AxiomWebVitals } from 'next-axiom';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@fmicodes/fmicodes-ui/lib/providers/theme-provider';
import { routing } from '../../../i18n/routing';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        {/* Enable production logging */}
        <AxiomWebVitals />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="flex h-screen items-center justify-center">
              {children}
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
