'use client';

import React, { useEffect, useState } from 'react';
import { SponsorsShowcase } from '@fmicodes/fmicodes-ui/lib/components/site/client';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { Hero } from '@fmicodes/fmicodes-ui/lib/components/site/hero/hero';

export default function Index() {
  const [sponsors, setSponsors] = useState({
    gold: [],
    silver: [],
    bronze: [],
    partners: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSponsorsAndPartners() {
      try {
        const [gold, silver, bronze, partners] = await Promise.all([
          ApiClient.SponsorsApiService.sponsorsControllerGetV1({
            type: 'GOLD',
          }),
          ApiClient.SponsorsApiService.sponsorsControllerGetV1({
            type: 'SILVER',
          }),
          ApiClient.SponsorsApiService.sponsorsControllerGetV1({
            type: 'BRONZE',
          }),
          ApiClient.SponsorsApiService.sponsorsControllerGetV1({
            type: 'PARTNER',
          }),
        ]);
        setSponsors({ gold, silver, bronze, partners });
      } catch (error) {
        console.error('Error fetching sponsors and partners:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSponsorsAndPartners();
  }, []);

  return (
    <div className="relative">
      <Hero />
      <div className="relative mx-auto max-w-[88rem] px-4 sm:-mt-16 lg:-mt-28 z-5">
        <div className="pt-8 px-8 rounded-t-lg shadow-lg">
          {loading ? (
            <></>
          ) : (
            <>
              {sponsors.gold.length > 0 && (
                <SponsorsShowcase sponsors={sponsors.gold} variant="gold" />
              )}
              {sponsors.silver.length > 0 && (
                <SponsorsShowcase sponsors={sponsors.silver} variant="silver" />
              )}
              {sponsors.bronze.length > 0 && (
                <SponsorsShowcase sponsors={sponsors.bronze} variant="bronze" />
              )}
              {sponsors.partners.length > 0 && (
                <SponsorsShowcase
                  sponsors={sponsors.partners}
                  variant="partners"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
