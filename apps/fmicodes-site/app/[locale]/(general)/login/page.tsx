import { LoginForm } from '@fmicodes/fmicodes-ui/lib/components/site/login-form/login-form';
import { getUser } from '@fmicodes/fmicodes-api-client/next';
import { redirect, RedirectType } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@fmicodes/fmicodes-ui/lib/components/common/server';
import { getLocale, getTranslations } from 'next-intl/server';
import { Logo } from '@fmicodes/fmicodes-ui/lib/components/site/server';
import { Metadata } from 'next';

interface LoginPageProps {
  params: Promise<{ error?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('login-page');

  return {
    title: `${t('title')} | FMI{Codes} 2025`,
    description: t('description'),
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  if (await getUser()) {
    redirect('/', RedirectType.replace);
  }

  const t = await getTranslations('login-page');
  const { error } = await params;
  const locale = await getLocale();

  return (
    <Card className="mx-auto mt-10 grid h-5/6 w-5/6 md:w-2/3 flex-col items-center justify-center xl:grid-cols-2 xl:px-0 overflow-hidden">
      <div className="hidden xl:flex h-full flex-col p-10 text-white bg-zinc-900">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo />
        </div>
      </div>

      <div className="p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('heading')}
            </h1>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
          </div>

          <LoginForm error={error} />

          <p className="px-4 text-center text-sm text-muted-foreground">
            {t('by-signing-in-you-agree-to-our')}{' '}
            <Link
              href={`/${locale}/regulations`}
              target="_blank"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('hackathon-regulations')}
            </Link>
            .
          </p>
        </div>
      </div>
    </Card>
  );
}
