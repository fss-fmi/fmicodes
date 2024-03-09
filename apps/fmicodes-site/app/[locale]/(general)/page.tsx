import React from 'react';
import { SponsorsShowcase } from '@fmicodes/fmicodes-ui/lib/components/site/client';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { getTranslations } from 'next-intl/server';

export default async function Index() {
  const t = await getTranslations('Index');

  return (
    <SponsorsShowcase
      sponsors={await ApiClient.SponsorsApiService.sponsorsControllerGetV1({})}
    />
  );
}
