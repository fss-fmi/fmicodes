'use client';

import React, { useEffect, useState } from 'react';
import { SponsorsShowcase } from '@fmicodes/fmicodes-ui/lib/components/site/client';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { Hero } from '@fmicodes/fmicodes-ui/lib/components/site/hero/hero';

const Loader = () => (
  <div className="flex justify-center items-center h-full mt-16">
    {' '}
    {/* Added mt-16 for margin-top */}
    <div className="w-16 h-16 border-t-4 border-[#725979] dark:border-[#eaa19a] border-solid rounded-full animate-spin"></div>
  </div>
);

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
      <div className="relative mx-auto max-w-[88rem] px-4 -mt-16 z-5">
        <div className="pt-8 px-8 rounded-t-lg shadow-lg">
          {loading ? (
            <Loader />
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
