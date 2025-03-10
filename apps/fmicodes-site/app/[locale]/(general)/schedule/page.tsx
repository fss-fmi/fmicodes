import { useTranslations } from 'next-intl';
import { Card } from '@fmicodes/fmicodes-ui/lib/components/common/card/components/card';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';

// SVG decorative elements for empty spaces
const CodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-16 h-16 text-gray-300"
    fill="currentColor"
  >
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
  </svg>
);

const BrainIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-16 h-16 text-gray-300"
    fill="currentColor"
  >
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 1 7.92 12.446a9 9 0 1 1 -16.313 -8.092a7.5 7.5 0 0 1 8 -4.354zm3.5 7.5a3.5 3.5 0 0 0 -7 0a3.5 3.5 0 0 0 7 0zm-2 0a1.5 1.5 0 0 1 -3 0a1.5 1.5 0 0 1 3 0z" />
  </svg>
);

const RocketIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-16 h-16 text-gray-300"
    fill="currentColor"
  >
    <path d="M2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12ZM13 16.268L13 8L17 12L13 16.268ZM11 8L11 16.268L7 12L11 8Z" />
  </svg>
);

// Day component
interface DayProps {
  date: string;
  title: string;
  events: Array<{ time: string; description: string }>;
  className?: string;
}

const DaySchedule: React.FC<DayProps> = ({
  date,
  title,
  events,
  className,
}) => {
  return (
    <Card
      className={`p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-xl ${className}`}
    >
      <div className="border-l-4 border-[#725979] pl-4 mb-4">
        <h3 className="text-xl font-bold">{date}</h3>
        <h4 className="text-lg text-gray-700 dark:text-white">{title}</h4>
      </div>
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 bg-[#fbf2ea] text-[#725979] font-medium px-2 py-1 rounded mr-3">
              {event.time}
            </div>
            <div className="text-gray-800 dark:text-white">
              {event.description}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Decorative component for empty spaces
interface DecorativeElementProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const DecorativeElement: React.FC<DecorativeElementProps> = ({
  title,
  description,
  icon,
  className,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-lg ${className}`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-white text-center text-sm">
        {description}
      </p>
    </div>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('schedule-page');

  return {
    title: `${t('title')} | FMI{Codes} 2025`,
    description: t('description'),
  };
}

export default function SchedulePage() {
  const t = useTranslations('schedule-page');

  // Day 1 events
  const day1Events = [
    { time: '17:00', description: 'Регистрация' },
    { time: '18:00', description: 'Откриване' },
    { time: '19:00', description: 'Хап и Yap' },
  ];

  // Day 2 events
  const day2Events = [
    { time: '09:00', description: 'Закуска' },
    { time: '10:00', description: 'Mentor tour' },
    { time: '11:30', description: 'Mentor pick' },
    { time: '12:30', description: 'Обяд' },
    { time: '14:00 - 18:00', description: 'Фотобудка' },
    { time: '19:30', description: 'Вечеря' },
  ];

  // Day 3 events
  const day3Events = [
    { time: '09:00', description: 'Закуска' },
    { time: '13:30', description: 'Обяд' },
    { time: '14:00', description: 'Тестване (Зала 325)' },
    {
      time: '16:00',
      description: 'Представяне и закриване',
    },
  ];

  return (
    <>
      <h1 className="text-center text-2xl sm:text-4xl md:text-6xl font-black uppercase my-4 truncate text-clip">
        {t('title')}
      </h1>

      <div className="relative min-h-screen py-8">
        {/* Connecting lines - visible on larger screens */}
        <div className="hidden md:block absolute left-1/2 top-28 bottom-28 border-r-2 border-dashed border-gray-300 z-0"></div>

        {/* Day 1 - Left side */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/2 z-10">
            <DaySchedule
              date="Петък, 14 март"
              title="Откриване и започване"
              events={day1Events}
              className="ml-auto mr-4 md:mr-8 transform hover:rotate-1"
            />
          </div>
          <div className="md:w-1/2 p-4 flex justify-center">
            <DecorativeElement
              title="Вдъхновение"
              description="Запознайте се с другите участници и се подгответе за два дни креативност!"
              icon={<BrainIcon />}
              className="max-w-xs"
            />
          </div>
        </div>

        {/* Day 2 - Right side (offset down) */}
        <div className="flex flex-col-reverse md:flex-row items-center mb-16">
          <div className="md:w-1/2 p-4 flex justify-center">
            <DecorativeElement
              title="Програмиране"
              description="Време е за код! Използвайте съветите на менторите за вашия проект."
              icon={<CodeIcon />}
              className="max-w-xs"
            />
          </div>
          <div className="md:w-1/2 z-10">
            <DaySchedule
              date="Събота, 15 март"
              title="Ден за разработка"
              events={day2Events}
              className="ml-4 md:ml-8 transform hover:rotate-1"
            />
          </div>
        </div>

        {/* Day 3 - Bottom left */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <DaySchedule
              date="Неделя, 16 март"
              title="Финализация и презентации"
              events={day3Events}
              className="ml-auto mr-4 md:mr-8 transform hover:rotate-1"
            />
          </div>
          <div className="md:w-1/2 p-4 flex justify-center">
            <DecorativeElement
              title="Успех"
              description="Представете проекта си и отпразнувайте постигнатото!"
              icon={<RocketIcon />}
              className="max-w-xs"
            />
          </div>
        </div>
      </div>

      <div className="py-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            Важна информация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-bold mb-2">Награди</h3>
              <ul className="list-disc list-inside">
                <li>Първо място - 4500 лв.</li>
                <li>Второ място - 3000 лв.</li>
                <li>Трето място - 2000 лв.</li>
                <li>Специални награди от спонсорите</li>
              </ul>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-bold mb-2">Ментори</h3>
              <p>
                Менторите ще бъдат на разположение според график в Discord
                сървъра на събитието и на място във факултета.
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-bold mb-2">Локации</h3>
              <p>Основните събития ще се проведат в зала 325.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-center">
        <p className="text-xl py-4 text-center max-w-screen-lg">
          При промени в програмата, участниците ще бъдат уведомени своевременно.
          За допълнителни въпроси участниците могат да се свържат с
          организаторите във всички{' '}
          <a
            className="underline"
            href="https://linktr.ee/lifeinfmi?utm_source=linktree_profile_share&ltsid=e27fd093-5fa0-4920-b9cc-1590081815de"
          >
            социални мрежи
          </a>
        </p>
      </div>
    </>
  );
}
