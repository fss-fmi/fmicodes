/* eslint-disable react/prop-types */
import { getTranslations } from 'next-intl/server';
import {
  Card,
  CardHeader,
  Skeleton,
  Button,
} from '@fmicodes/fmicodes-ui/lib/components/common/server';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { MentorCard } from '@fmicodes/fmicodes-ui/lib/components/site/mentor-card/mentor-card';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { getUser } from '@fmicodes/fmicodes-api-client/next';
import { Lightbulb, Users, Code, Star, Clock } from 'lucide-react';
import { TechColorLegend } from './legend';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('mentors-page');

  return {
    title: `${t('title')} | FMI{Codes} 2025`,
    description: t('description'),
  };
}

const InfoCard = ({ icon: Icon, title, description, color }) => (
  <Card
    className={`w-full h-full transition duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden border-l-4 ${color} flex`}
  >
    <div className="p-6 flex flex-col items-center justify-center w-full text-center">
      <div
        className={`p-3 md:p-4 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')} mb-4 inline-flex items-center justify-center`}
      >
        <Icon
          className={`${color.replace('border-', 'text-').replace('-500', '-600')} w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10`}
        />
      </div>
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-white mb-6 max-w-xs mx-auto">
        {description}
      </p>
    </div>
  </Card>
);

export default async function MentorsPage() {
  const t = await getTranslations('mentors-page');
  const user = await getUser();

  const infoCards = [
    {
      icon: Lightbulb,
      title: 'Експертно ръководство',
      description:
        'Менторите предоставят ценни насоки и помагат на екипите да се справят с трудни предизвикателства благодарение на своя опит в индустрията.',
      color: 'border-blue-500',
    },
    {
      icon: Users,
      title: 'Развитие на екипа',
      description:
        'Работата с ментор спомага за развитието на техническите умения на екипа и за подобряване на ефективната колаборация.',
      color: 'border-purple-500',
    },
    {
      icon: Code,
      title: 'Техническо съвършенство',
      description:
        'Получавате ревюта на кода, съвети за архитектура и най-добри практики от опитни професионалисти в своята област.',
      color: 'border-green-500',
    },
    {
      icon: Star,
      title: 'Успех на проекта',
      description:
        'Екипите с ментори имат по-големи шансове да завършат проектите си успешно и в срок, с високо качество.',
      color: 'border-amber-500',
    },
    {
      icon: Clock,
      title: 'Управление на времето',
      description:
        'Менторите помагат на екипите да организират времето си ефективно и да се справят с належащите срокове по време на хакатона.',
      color: 'border-red-500',
    },
    {
      icon: Lightbulb,
      title: 'Иновации и креативност',
      description:
        'Менторите насърчават екипите да мислят извън рамките и да прилагат иновации за решаване на проблемите по време на хакатона.',
      color: 'border-yellow-500',
    },
  ];

  async function MentorCards() {
    const mentors = await ApiClient.MentorsApiService.mentorsControllerGetV1(
      {},
    );

    const mentorCards = mentors.map((mentor) => (
      <MentorCard
        key={mentor.id}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mentor={mentor}
        user={user}
        className="h-full"
      />
    ));

    const allCards = [...mentorCards];
    infoCards.forEach((infoCard, index) => {
      const position = index * 5;
      allCards.splice(
        position < allCards.length ? position : allCards.length,
        0,
        <InfoCard
          key={`info-${index}`}
          icon={infoCard.icon}
          title={infoCard.title}
          description={infoCard.description}
          color={infoCard.color}
        />,
      );
    });

    return allCards;
  }

  function FallbackCards() {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <Card
          key={index}
          className="w-full h-full transition duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-200 bg-white"
        >
          <CardHeader className="relative p-0 w-full aspect-square space-y-0 overflow-hidden rounded-t-xl">
            <Skeleton className="w-full h-full bg-gray-200" />
          </CardHeader>
          <div className="flex flex-col gap-y-3 p-4">
            <div className="flex flex-col gap-y-2">
              <Skeleton className="w-2/3 h-6 bg-gray-200" />
              <Skeleton className="w-full h-4 bg-gray-200" />
            </div>
            <div className="flex flex-col gap-y-2">
              <Skeleton className="w-1/2 h-5 bg-gray-200" />
              <Skeleton className="w-full h-20 bg-gray-200" />
            </div>
            <div className="flex flex-col gap-y-2">
              <Skeleton className="w-1/2 h-5 bg-gray-200" />
              <Skeleton className="w-full h-20 bg-gray-200" />
            </div>
            <Skeleton className="w-full h-10 mt-2 bg-gray-200 rounded-lg" />
          </div>
        </Card>
      ));
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase my-4 truncate text-clip">
          {t('title')}
        </h1>
        <p className="text-lg max-w-2xl mx-auto">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-evenly">
        <Suspense fallback={<FallbackCards />}>
          <MentorCards />
        </Suspense>
      </div>

      <TechColorLegend />
    </div>
  );
}
