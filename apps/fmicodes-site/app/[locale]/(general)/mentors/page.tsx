import { getTranslations } from 'next-intl/server';
import {
  Card,
  CardHeader,
  Skeleton,
} from '@fmicodes/fmicodes-ui/lib/components/common/server';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { MentorCard } from '@fmicodes/fmicodes-ui/lib/components/site/mentor-card/mentor-card';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('mentors-page');

  return {
    title: `${t('title')} | FMI{Codes} 2024`,
    description: t('description'),
  };
}

export default async function TeamsPage() {
  const t = await getTranslations('mentors-page');

  // const user = await getUser();

  async function MentorCards() {
    // const mentors = await ApiClient.TeamsApiService.teamsControllerGetV1({});
    const mentors = [
      {
        id: 1,
        name: 'Гошо Лошо Мошо',
        company: 'SAP',
        jobTitle: 'Development Expert | Architect',
        pictureUrl: '/assets/images/mentors/Aleksandar_Stefanov.jpg',
        availability: [
          'Петък 18:00 - 19:00',
          'Събота 13:00 - 16:00',
          'Петък 18:00 - 19:00',
          'Събота 13:00 - 16:00',
          'Петък 18:00 - 19:00',
          'Събота 13:00 - 16:00',
        ],
        technologies: [
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
          { name: 'Tensorflow', color: '#e1862f' },
        ],
        team: { name: 'gosho' },
      },
    ];

    return mentors.map((mentor) => (
      <MentorCard key={mentor.id} mentor={mentor} />
    ));
  }

  function FallbackCards() {
    return Array(18)
      .fill(0)
      .map((_) => (
        <Card
          key={Math.random()}
          className="w-full transition hover:-translate-y-1 hover:shadow-lg "
        >
          <CardHeader className="relative p-0 w-full aspect-square space-y-0 overflow-hidden rounded-t-xl">
            <Skeleton className="w-full h-full" />
          </CardHeader>
          <div className="flex flex-col gap-y-2 p-3">
            <div className="flex flex-col gap-y-1">
              <Skeleton className="w-1/2 h-6" />
              <Skeleton className="w-full h-4" />
            </div>
            <div className="flex flex-col gap-y-1">
              <Skeleton className="w-1/2 h-6" />
              <Skeleton className="w-3/4 h-36" />
            </div>
            <div className="flex flex-col gap-y-1">
              <Skeleton className="w-1/2 h-6" />
              <Skeleton className="w-full h-36" />
            </div>
            <Skeleton className="w-full h-8" />
          </div>
        </Card>
      ));
  }

  return (
    <>
      <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase my-4 truncate text-clip">
        {t('title')}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-evenly">
        <Suspense fallback={<FallbackCards />}>
          <MentorCards />
        </Suspense>
      </div>
    </>
  );
}
