'use client';

import React from 'react';
import ApiClient from '@fmicodes/fmicodes-api-client/client';
import { getBearerToken } from '@fmicodes/fmicodes-api-client/next';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../../../common/button/button';

interface AddToTeamButtonProps {
  user: ApiClient.UserResponseBodyDto;
  mentorId: number;
}

export function AddToTeamButton({ user, mentorId }: AddToTeamButtonProps) {
  const locale = useLocale();
  const t = useTranslations('site.mentor-card');

  async function assignMentor() {
    await ApiClient.MentorsApiService.mentorsControllerAssignTeam({
      id: `${mentorId}`,
      teamId: `${user.team?.id}`,
      authorization: await getBearerToken(),
      acceptLanguage: locale,
    });

    // refresh the page
    window.location.reload();
  }

  return (
    <Button
      onClick={() => assignMentor()}
      className="w-full"
      disabled={
        !user ||
        !user.team ||
        user.team.capitanId !== user.id ||
        (user.team.mentors && user.team.mentors.length > 0)
      }
    >
      {t('add-to-team')}
    </Button>
  );
}
