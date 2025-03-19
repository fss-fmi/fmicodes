import { getTranslations } from 'next-intl/server';
import React from 'react';
import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Badge,
} from '@fmicodes/fmicodes-ui/lib/components/common/server';
import Image from 'next/image';
import { Trophy, Medal } from 'lucide-react';

// Hardcoded teams data
const teamsData = [
  { id: 1, name: 'The Commiters', totalPoints: 74 },
  { id: 2, name: 'Kopengafen', totalPoints: 74 },
  { id: 3, name: 'Exodia', totalPoints: 74 },
  { id: 4, name: 'Zafira', totalPoints: 72 },
  { id: 5, name: 'Corgi Lovers', totalPoints: 71 },
  { id: 6, name: 'Hummingbird', totalPoints: 70 },
  { id: 7, name: 'The Social Butterflies', totalPoints: 70 },
  { id: 8, name: 'Жълта Книжка', totalPoints: 69 },
  { id: 9, name: 'The Chu', totalPoints: 69 },
  { id: 10, name: 'Kolegite', totalPoints: 68 },
  { id: 11, name: 'Ctrl+Alt+Elite', totalPoints: 68 },
  { id: 12, name: 'CodeBros', totalPoints: 67 },
  { id: 13, name: 'Баланджинатор', totalPoints: 66 },
  { id: 14, name: 'SpanakHaters', totalPoints: 65 },
  { id: 15, name: 'PeakMotion', totalPoints: 65 },
  { id: 16, name: 'Гвинпин', totalPoints: 64 },
  { id: 17, name: '2^2', totalPoints: 64 },
  { id: 18, name: 'ByteStorm', totalPoints: 54 },
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ranking-page');

  return {
    title: `${t('title')} | FMI{Codes} 2025`,
    description: t('description'),
  };
}

export default async function RankingPage() {
  const t = await getTranslations('ranking-page');

  const sortedTeams = [...teamsData].sort(
    (team1, team2) => team2.totalPoints - team1.totalPoints,
  );
  const [firstTeam, secondTeam, thirdTeam, ...otherTeams] = sortedTeams;

  // Calculate the highest possible score
  const maxScore = 100;

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase mb-4">
          {t('title')}
        </h1>
        <p className="max-w-2xl mx-auto">{t('description')}</p>
      </div>

      {/* Podium section - adjusted for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* First place - always first in mobile view */}
        <div className="order-1 md:order-2">
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-yellow-500 dark:border-yellow-600">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 dark:bg-yellow-600 rounded-full p-4 shadow-lg z-10">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardHeader className="relative p-0 w-full aspect-video space-y-0 overflow-hidden rounded-t-xl mt-2">
              <div className="absolute top-0 left-0 bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 rounded-br-lg font-bold">
                1<sup>st</sup>
              </div>
              <Image
                src="/assets/images/ranking/first.jpg"
                alt={firstTeam.name}
                width={3000}
                height={2000}
                className="object-cover w-full h-full"
              />
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                  {firstTeam.name}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700 text-sm">
                    ПОБЕДИТЕЛ #{firstTeam.id}
                  </Badge>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
                      {firstTeam.totalPoints}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                      /{maxScore}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
                  <div
                    className="bg-yellow-500 dark:bg-yellow-600 h-3 rounded-full"
                    style={{
                      width: `${(firstTeam.totalPoints / maxScore) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second place */}
        <div className="order-2 md:order-1 md:mt-8">
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-100 dark:bg-gray-700 rounded-full p-3 shadow-md z-10">
              <Medal className="w-6 h-6 text-gray-500 dark:text-gray-300" />
            </div>
            <CardHeader className="relative p-0 w-full aspect-video space-y-0 overflow-hidden rounded-t-xl mt-2">
              <div className="absolute top-0 left-0 bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-br-lg font-bold">
                2<sup>nd</sup>
              </div>
              <Image
                src="/assets/images/ranking/second.jpg"
                alt={secondTeam.name}
                width={3000}
                height={2000}
                className="object-cover w-full h-full"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                  {secondTeam.name}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-sm">
                    ПОБЕДИТЕЛ #{secondTeam.id}
                  </Badge>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                      {secondTeam.totalPoints}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                      /{maxScore}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-gray-500 dark:bg-gray-400 h-2 rounded-full"
                    style={{
                      width: `${(secondTeam.totalPoints / maxScore) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third place */}
        <div className="order-3 md:mt-12">
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-100 dark:bg-amber-900 rounded-full p-3 shadow-md z-10">
              <Medal className="w-6 h-6 text-amber-700 dark:text-amber-300" />
            </div>
            <CardHeader className="relative p-0 w-full aspect-video space-y-0 overflow-hidden rounded-t-xl mt-2">
              <div className="absolute top-0 left-0 bg-amber-700 dark:bg-amber-800 text-white px-4 py-2 rounded-br-lg font-bold">
                3<sup>rd</sup>
              </div>
              <Image
                src="/assets/images/ranking/third.jpg"
                alt={thirdTeam.name}
                width={3000}
                height={2000}
                className="object-cover w-full h-full"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                  {thirdTeam.name}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-sm">
                    ПОБЕДИТЕЛ #{thirdTeam.id}
                  </Badge>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-amber-700 dark:text-amber-500">
                      {thirdTeam.totalPoints}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                      /{maxScore}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-amber-700 dark:bg-amber-600 h-2 rounded-full"
                    style={{
                      width: `${(thirdTeam.totalPoints / maxScore) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center w-full mb-8 mt-2">
        <div className="text-center flex items-center">
          <span className="text-yellow-500 dark:text-yellow-400 mr-2">★</span>
          <p className="text-sm italic">
            Класирането на отборите на първите три места беше гласувано от
            журито.
          </p>
        </div>
      </div>

      {/* Other teams */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Други отбори</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherTeams.map((team, index) => (
            <Card
              key={team.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                    {index + 4}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                    <div>
                      <h3 className="font-bold text-lg">{team.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        Отбор #{team.id}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end mt-2 md:mt-0">
                      <div className="flex items-baseline">
                        <span className="text-xl font-bold">
                          {team.totalPoints}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                          /{maxScore}
                        </span>
                      </div>
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-500 dark:bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${(team.totalPoints / maxScore) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
