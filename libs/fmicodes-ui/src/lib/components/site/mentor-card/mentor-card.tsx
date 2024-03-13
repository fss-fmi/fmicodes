import React from 'react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ScrollArea } from '../../common/scroll-area/components/scroll-area';
import { cn } from '../../../utils';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
} from '../../common/server';

interface Mentor {
  name: string;
  company: string;
  jobTitle: string;
  pictureUrl: string;
  availability: string[];
  technologies: { name: string; color: string }[];
  team?: { name: string };
}

interface MentorCardProps {
  mentor: Mentor;
}

export async function MentorCard({ mentor }: MentorCardProps) {
  const t = await getTranslations('site.mentor-card');
  return (
    <Card className="w-full transition hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="relative p-0 w-full aspect-square space-y-0 overflow-hidden rounded-t-xl">
        <Image
          src={mentor.pictureUrl}
          alt={mentor.name}
          width={800}
          height={800}
          className="object-cover"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2 p-3">
        <div>
          <h2 className="text-lg font-bold text-ellipsis overflow-hidden">
            {mentor.name}
          </h2>
          <p>
            <span>{mentor.company}</span>
            {' - '}
            <span>{mentor.jobTitle}</span>
          </p>
        </div>
        <div>
          <h3 className="font-bold">{t('availability')}</h3>
          <ul className="h-36 list-disc list-inside">
            {mentor.availability.map((timeSlot) => (
              <li key={timeSlot}>{timeSlot}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">{t('technologies')}</h3>
          <ScrollArea className="h-36 flex flex-row justify-center">
            {mentor.technologies.map((technology) => (
              <Badge key={technology.name} className="pointer-events-none">
                {technology.name}
              </Badge>
            ))}
          </ScrollArea>
        </div>
        <div>
          <Button
            className={cn('w-full', mentor.team ? 'disabled' : '')}
            disabled={!!mentor.team}
          >
            {mentor.team ? mentor.team.name : t('add-to-team')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
