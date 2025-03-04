import React from 'react';
import libConfig from '@fmicodes/fmicodes-services/config/lib.config';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import { cn } from '../../../utils';
import { Logo } from '../logo/logo';
import { TeamMemberAvatar } from '../team-member-avatar/team-member-avatar';

interface TeamBannerProps {
  team: ApiClient.TeamResponseBodyDto;
  enableTeamCapitanControls?: boolean;
  className?: string;
}

export function TeamBanner({
  team,
  enableTeamCapitanControls = false,
  className = '',
}: TeamBannerProps) {
  return (
    <>
      <div
        className={cn(
          'absolute inset-0 flex flex-col w-full h-full pt-5 overflow-ellipsis items-center text-center text-white',
          className,
        )}
        style={{ backgroundColor: libConfig.team.color.mapping[team.color] }}
      >
        <span className="w-fit px-2 py-1 text-3xl font-bold bg-white text-black dark:bg-black dark:text-white">
          {team.name.toUpperCase()}
        </span>
        <Logo className="px-4 py-2 scale-50 -mt-3 bg-white text-black dark:bg-black dark:text-white" />
      </div>
      <div
        className="absolute inset-0 w-full h-full grid justify-center items-end"
        style={{
          padding: `0px ${2 + (libConfig.team.members.max - team.members.length) * 7}%`,
          gridTemplateColumns: `repeat(${team.members.length}, 1fr)`,
        }}
      >
        {team.members.map((member: ApiClient.UserResponseBodyDto) => (
          <TeamMemberAvatar
            key={member.id}
            team={team}
            member={member}
            enableTeamCapitanControls={enableTeamCapitanControls}
          />
        ))}
      </div>
    </>
  );
}
