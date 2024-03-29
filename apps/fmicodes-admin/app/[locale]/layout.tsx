import '../global.css';
import '@fmicodes/fmicodes-ui/global.css';

import React from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ThemeProvider } from '@fmicodes/fmicodes-ui/lib/providers/theme-provider';
import { locales } from '../i18n';

export const metadata = {
  title: 'Welcome to fmicodes-admin',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <html lang={locale}>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
