'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import Image from 'next/image';
import { DialogFooter } from '../../../common/client';
import { Button } from '../../../common/server';

interface WelcomeStepProps {
  nextStep: () => void;
}

export function WelcomeStep({ nextStep }: WelcomeStepProps) {
  const t = useTranslations('site.onboarding-dialog.welcome-step');
  return (
    <>
      <div className="flex flex-col items-center text-center w-full">
        <Image
          src="/assets/icons/fmicodes.svg"
          alt="Fmi{Codes} logo"
          width={200}
          height={200}
        />
        <h1 className="text-lg font-semibold">{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      <DialogFooter>
        <Button type="button" onClick={nextStep}>
          {t('continue')}
        </Button>
      </DialogFooter>
    </>
  );
}
