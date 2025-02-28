import { getTranslations } from 'next-intl/server';
import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from '@fmicodes/fmicodes-ui/lib/components/common/server';
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { FaPeopleGroup } from 'react-icons/fa6';
import { TeamBanner } from '@fmicodes/fmicodes-ui/lib/components/site/team-banner/team-banner';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ranking-page');

  return {
    title: `${t('title')} | FMI{Codes} 2025`,
    description: t('description'),
  };
}

export default async function RankingPage() {
  const t = await getTranslations('ranking-page');

  async function RankingCards() {
    const teams = await ApiClient.TeamsApiService.teamsControllerGetV1({});
    const sortedTeams = teams
      .filter((team) => team.totalPoints !== undefined)
      .sort((team1, team2) => team2.totalPoints - team1.totalPoints);
    const [firstTeam, secondTeam, thirdTeam, ...otherTeams] = sortedTeams;

    return (
      <div className="max-w-3xl m-auto flex flex-col gap-2">
        <Card>
          <CardHeader className="relative p-0 w-full aspect-[21/9] space-y-0 overflow-hidden rounded-t-xl">
            <TeamBanner team={firstTeam} />
            <Image
              src="/assets/images/ranking/first.jpg"
              alt={firstTeam.name}
              width={3000}
              height={2000}
              className="absolute inset-0 object-cover w-full h-full hover:opacity-0 transition-opacity"
            />
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center">
              <FaPeopleGroup className="w-6 h-6 mr-2" />
              <p className="text-lg font-bold text-ellipsis overflow-hidden grow whitespace-nowrap">
                {firstTeam.name}
              </p>
              <p className="text-lg font-bold">{firstTeam.totalPoints}</p>
              <p className="text-xs">/700</p>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-3xl m-auto grid grid-cols-2 gap-2 w-full">
          <Card>
            <CardHeader className="relative p-0 w-full aspect-[16/9] space-y-0 overflow-hidden rounded-t-xl">
              <TeamBanner team={secondTeam} />
              <Image
                src="/assets/images/ranking/second.jpg"
                alt={secondTeam.name}
                width={3000}
                height={2000}
                className="absolute inset-0 object-cover w-full h-full hover:opacity-0 transition-opacity"
              />
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center">
                <FaPeopleGroup className="w-6 h-6 mr-2" />
                <p className="text-lg font-bold text-ellipsis overflow-hidden grow whitespace-nowrap">
                  {secondTeam.name}
                </p>
                <p className="text-lg font-bold">{secondTeam.totalPoints}</p>
                <p className="text-xs">/700</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="relative p-0 w-full aspect-[16/9] space-y-0 overflow-hidden rounded-t-xl">
              <TeamBanner team={thirdTeam} />
              <Image
                src="/assets/images/ranking/third.jpg"
                alt={thirdTeam.name}
                width={3000}
                height={2000}
                className="absolute inset-0 object-cover w-full h-full hover:opacity-0 transition-opacity"
              />
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center">
                <FaPeopleGroup className="w-6 h-6 mr-2" />
                <p className="text-lg font-bold text-ellipsis overflow-hidden grow whitespace-nowrap">
                  {thirdTeam.name}
                </p>
                <p className="text-lg font-bold">{thirdTeam.totalPoints}</p>
                <p className="text-xs">/700</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl m-auto w-full flex flex-col gap-2">
          {otherTeams.map((team) => (
            <Card key={team.id}>
              <CardContent className="p-3">
                <div className="flex items-center">
                  <FaPeopleGroup className="w-6 h-6 mr-2" />
                  <p className="text-lg font-bold text-ellipsis overflow-hidden grow">
                    {team.name}
                  </p>
                  <p className="text-lg font-bold">{team.totalPoints}</p>
                  <p className="text-xs">/700</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function FallbackCards() {
    return (
      <div className="max-w-3xl m-auto flex flex-col gap-2">
        <Card key={Math.random()} className="w-full transition">
          <CardHeader className="relative p-0 w-full aspect-[21/9] space-y-0 overflow-hidden rounded-t-xl">
            <Skeleton className="w-full h-full" />
          </CardHeader>
          <div className="p-3">
            <Skeleton className="w-1/2 h-6" />
          </div>
        </Card>

        <div className="flex flex-row gap-2">
          <Card key={Math.random()} className="w-full transition">
            <CardHeader className="relative p-0 w-full aspect-[21/9] space-y-0 overflow-hidden rounded-t-xl">
              <Skeleton className="w-full h-full" />
            </CardHeader>
            <div className="p-3">
              <Skeleton className="w-1/2 h-6" />
            </div>
          </Card>

          <Card
            key={Math.random()}
            className="w-full transition hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader className="relative p-0 w-full aspect-[21/9] space-y-0 overflow-hidden rounded-t-xl">
              <Skeleton className="w-full h-full" />
            </CardHeader>
            <div className="p-3">
              <Skeleton className="w-1/2 h-6" />
            </div>
          </Card>
        </div>

        <div className="max-w-2xl m-auto w-full flex flex-col gap-2">
          {Array(15)
            .fill(0)
            .map((_) => (
              <Card
                key={Math.random()}
                className="w-full  h-14 flex flex-row items-center p-3"
              >
                <Skeleton className="w-1/2 h-6" />
              </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase my-4 truncate text-clip">
        {t('title')}
      </h1>

      <Suspense fallback={<FallbackCards />}>
        <RankingCards />
      </Suspense>
    </>
  );
}
