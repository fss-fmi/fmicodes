'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@fmicodes/fmicodes-ui/lib/components/common/server';
import { SponsorsShowcase } from '@fmicodes/fmicodes-ui/lib/components/site/sponsors-showcase/sponsors-showcase';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';

export default async function Index() {
  const t = useTranslations('Index');

  return (
    <>
      <h1>{t('title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      <SponsorsShowcase
        sponsors={await ApiClient.SponsorsApiService.sponsorsControllerGetV1(
          {},
        )}
      />
    </>
  );
}
