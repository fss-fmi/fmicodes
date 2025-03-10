'use client';

import { FaLink } from 'react-icons/fa6';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import ApiClient from '@fmicodes/fmicodes-api-client/client';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '../../common/client';
import { Card } from '../../common/card/card';
import { Button } from '../../common/server';
import { cn } from '../../../utils';

interface SponsorsShowcaseProps {
  sponsors: ApiClient.SponsorResponseBodyDto[];
  variant: 'gold' | 'silver' | 'bronze' | 'partners';
}

export function SponsorsShowcase({ sponsors, variant }: SponsorsShowcaseProps) {
  const [highlightedSponsor, setHighlightedSponsor] = useState<
    { name: string; color: string } | undefined
  >();
  const t = useTranslations('site.sponsors-showcase');

  function renderSponsorVariant() {
    switch (variant) {
      case 'gold':
        return t('our-gold-sponsors');
      case 'silver':
        return t('our-silver-sponsors');
      case 'bronze':
        return t('our-bronze-sponsors');
      case 'partners':
        return t('our-partners');
      default:
        return '';
    }
  }

  // Default text colors per section
  const variantTextColors: Record<typeof variant, string> = {
    gold: 'text-yellow-500',
    silver: 'text-gray-500',
    bronze: 'text-orange-600',
    partners: 'text-blue-500',
  };

  return (
    <Card className="w-full mt-2 p-4">
      <div className="grid gap-4 md:grid-cols-[auto,1fr]">
        {/* Mobile: Sponsor Type on Top */}
        <div className="flex flex-col justify-center items-center border p-4 rounded-lg shadow-md w-full text-center md:w-64 md:text-left">
          <span className="font-semibold uppercase text-lg">
            {t('with-the-support-of')}
          </span>
          <span
            className={cn(
              'text-3xl font-bold uppercase transition-all duration-200 text-center',
              highlightedSponsor
                ? '' // Remove default class when hovering
                : variantTextColors[variant], // Default variant color
            )}
            style={{
              color: highlightedSponsor?.color || '', // Change to sponsor color on hover
              scale: highlightedSponsor ? 1.3 : 1,
            }}
          >
            {highlightedSponsor?.name || renderSponsorVariant()}
          </span>
        </div>

        {/* Sponsors Grid (2 columns on mobile, 3 on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {sponsors.map((sponsor) => (
            <Dialog key={sponsor.name}>
              <DialogTrigger asChild>
                <div
                  className="flex flex-col justify-center items-center border cursor-pointer p-4 transition-transform hover:scale-105 rounded-lg shadow-md"
                  style={{ height: '180px', backgroundColor: 'transparent' }}
                  onMouseEnter={() => setHighlightedSponsor(sponsor)}
                  onMouseLeave={() => setHighlightedSponsor(undefined)}
                >
                  <Image
                    src={`/assets/images/sponsors/${sponsor.logo}`}
                    alt={sponsor.name}
                    width={150}
                    height={100}
                    className="object-contain max-h-20"
                  />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>{sponsor.name}</DialogTitle>
                <ScrollArea className="max-h-72">
                  <p className="pr-2">{sponsor.description}</p>
                </ScrollArea>
                <Button asChild>
                  <Link href={sponsor.website} target="_blank">
                    <FaLink className="mr-2 h-4 w-4" />
                    Visit
                  </Link>
                </Button>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </Card>
  );
}
