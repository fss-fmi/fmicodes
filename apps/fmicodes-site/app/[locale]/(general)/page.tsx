import React from 'react';
import { SponsorsShowcase } from '@fmicodes/fmicodes-ui/lib/components/site/client';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { Hero } from '@fmicodes/fmicodes-ui/lib/components/site/hero/hero';

export default async function Index() {
  return (
    <>
      <Hero />
      <SponsorsShowcase
        sponsors={await ApiClient.SponsorsApiService.sponsorsControllerGetV1({
          type: 'GOLD',
        })}
        variant="gold"
      />

      <SponsorsShowcase
        sponsors={await ApiClient.SponsorsApiService.sponsorsControllerGetV1({
          type: 'SILVER',
        })}
        variant="silver"
      />

      <SponsorsShowcase
        sponsors={await ApiClient.SponsorsApiService.sponsorsControllerGetV1({
          type: 'BRONZE',
        })}
        variant="bronze"
      />
    </>
  );
}
