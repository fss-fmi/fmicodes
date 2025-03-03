import '../../global.css';
import '@fmicodes/fmicodes-ui/global.css';

import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@fmicodes/fmicodes-ui/lib/providers/theme-provider';
import { Navbar } from '@fmicodes/fmicodes-ui/lib/components/common/server';
import {
  Blobcho,
  NavbarLinks,
  NavbarUserControls,
  NotificationsPopover,
  OnboardingDialog,
} from '@fmicodes/fmicodes-ui/lib/components/site/client';
import { getUser } from '@fmicodes/fmicodes-api-client/next';
import { getMessages, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { AxiomWebVitals } from 'next-axiom';
import { Logo } from '@fmicodes/fmicodes-ui/lib/components/site/server';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { routing } from '../../../i18n/routing';

export { useReportWebVitals } from 'next-axiom';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout');
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const user = await getUser();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen">
        {/* Enable production logging */}
        <AxiomWebVitals />
        <Analytics />
        <SpeedInsights />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar>
              <NavbarLinks
                className="block xl:hidden place-self-start"
                variant="mobile"
              />

              <Link
                href={`/${locale}`}
                className="place-self-center xl:place-self-start"
              >
                <Logo />
              </Link>

              <NavbarLinks
                className="hidden xl:flex justify-center place-self-center"
                variant="desktop"
              />

              <div className="flex flex-row align-middle gap-2 place-self-end">
                {user && <NotificationsPopover user={user} />}
                <NavbarUserControls user={user} className="" />
              </div>
            </Navbar>

            <OnboardingDialog isOpen={user && !user.isOnboardingCompleted} />

            <Blobcho />

            <main className="max-w-[88rem] m-auto px-4 overflow-x-hidden">
              {children}
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
