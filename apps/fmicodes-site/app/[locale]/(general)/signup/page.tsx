import { getUser } from '@fmicodes/fmicodes-api-client/next';
import { redirect, RedirectType } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card } from '@fmicodes/fmicodes-ui/lib/components/common/card/components/card';
import { SignUpForm } from '@fmicodes/fmicodes-ui/lib/components/site/client';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sign-up-page');

  return {
    title: `${t('title')} | FMI{Codes} 2024`,
    description: t('description'),
  };
}

export default async function SignUpPage() {
  if (await getUser()) {
    redirect('/', RedirectType.replace);
  }

  const t = await getTranslations('sign-up-page');

  return (
    <Card className="flex mx-auto mt-10 h-5/6 w-5/6 md:w-2/3 flex-col items-center p-4 md:p-8 space-y-4">
      <div className="flex flex-col space-y-2 h-1/6 justify-end text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('heading')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="w-full h-5/6">
        <SignUpForm />
      </div>
    </Card>
  );
}
