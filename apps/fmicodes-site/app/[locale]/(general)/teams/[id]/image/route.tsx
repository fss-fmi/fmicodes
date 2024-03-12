/* eslint react/no-unknown-property: 0 */

import { ImageResponse } from 'next/og';
import { ApiClient } from '@fmicodes/fmicodes-api-client/client';
import React from 'react';
import { NextApiRequest } from 'next';

export const runtime = 'edge';

export async function GET(req: NextApiRequest, { params }) {
  const { id } = params;
  const team = await ApiClient.TeamsApiService.teamsControllerGetTeamV1({
    teamId: id as string,
  });

  return new ImageResponse(
    (
      <div tw="bg-black w-full h-full relative flex">
        <div
          tw="absolute inset-0 flex flex-col w-full h-full pt-10 items-center text-center text-white"
          style={{ backgroundColor: team.color, display: 'flex' }}
        >
          <div
            tw="flex px-2 py-1 bg-black text-white"
            style={{
              fontSize: '80px',
              fontWeight: 900,
            }}
          >
            {team.name.toUpperCase()}gosholoshogosholosho
          </div>
          <div tw="flex items-center px-4 py-2 -mt-3 bg-black text-white">
            <img
              src="https://fmicodes.com/assets/icons/fmicodes.svg"
              alt="FMI{Codes} Logo"
              width={64}
              height={64}
            />
            <span tw="flex text-4xl font-bold text-[#788cc6] ml-3">
              {'FMI{Codes}'}
            </span>
          </div>
        </div>

        <div
          tw="absolute inset-0 w-full h-full justify-center items-end flex"
          style={{
            marginLeft: `${(team.members.length * 40) / 2}px`,
          }}
        >
          {team.members.map((member: ApiClient.UserResponseBodyDto) => (
            <img
              key={member.id}
              src={member.avatarUrl}
              alt={`${member.firstName} ${member.lastName}`}
              width={475 - (team.members.length - 1) * 10}
              height={475 - (team.members.length - 1) * 10}
              style={{
                marginLeft: `-${team.members.length * 40}px`,
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    },
  );
}
