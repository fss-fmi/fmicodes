import React from 'react';
import { SponsorsShowcase } from '@fmicodes/fmicodes-ui/lib/components/site/client';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@fmicodes/fmicodes-ui/lib/components/site/hero/hero';

export default async function Index() {
  const t = await getTranslations('Index');

  return (
    <>
      <Hero />
      <SponsorsShowcase
        sponsors={await ApiClient.SponsorsApiService.sponsorsControllerGetV1(
          {},
        )}
        variant="gold"
      />
    </>
  );
}
