import React from 'react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import ApiClient from '@fmicodes/fmicodes-api-client/client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { AddToTeamButton } from './components/add-to-team-button';
import { ScrollArea } from '../../common/scroll-area/components/scroll-area';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
} from '../../common/server';

interface Mentor {
  id: number;
  name: string;
  company: { name: string; color: string };
  jobTitle: string;
  pictureUrl: string;
  availability: string[];
  technologies: { name: string; color: string }[];
  team?: { id: number; name: string };
}

interface MentorCardProps {
  mentor: Mentor;
  user: ApiClient.UserResponseBodyDto;
}

export async function MentorCard({ mentor, user }: MentorCardProps) {
  const t = await getTranslations('site.mentor-card');
  const locale = useLocale();

  return (
    <Card className="w-full transition hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="relative p-0 w-full aspect-square space-y-0 overflow-hidden rounded-t-xl">
        <Image
          src={mentor.pictureUrl}
          alt={mentor.name}
          width={800}
          height={800}
          className="object-cover w-full h-full"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2 p-3">
        <div>
          <h2 className="text-lg font-bold text-ellipsis overflow-hidden">
            {mentor.name}
          </h2>
          <p className="h-12">
            <span style={{ color: mentor.company.color }}>
              {mentor.company.name}
            </span>
            {' - '}
            <span>{mentor.jobTitle}</span>
          </p>
        </div>
        <div>
          <h3 className="font-bold">{t('availability')}</h3>
          <ul className="h-40 list-disc list-inside">
            {mentor.availability.map((timeSlot) => (
              <li key={timeSlot}>{timeSlot}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">{t('technologies')}</h3>
          <ScrollArea className="h-40 flex flex-row justify-center">
            {mentor.technologies.map((technology) => (
              <Badge key={technology.name} className="pointer-events-none">
                {technology.name}
              </Badge>
            ))}
          </ScrollArea>
        </div>

        <div>
          {!mentor.team && <AddToTeamButton user={user} mentorId={mentor.id} />}
          {mentor.team && (
            <Link href={`${locale}/teams/${mentor.team.id}`}>
              <Button className="w-full">{mentor.team.name}</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
